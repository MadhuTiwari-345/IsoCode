'use server'

import { getPayloadClient } from '@/lib/payload'
import { appAuth, isStaffRole } from '@/lib/app-auth'
import { t, detectTopic, DISCOUNT_RE, type Lang } from '@/lib/chat-i18n'
import { normalizePhone } from '@/lib/phone'
import { fmtDateTime, fmtDay, fmtTime } from '@/lib/staff'
import { formatLakh } from '@/lib/catalog'
import { remainingCapacity } from '@/lib/booking-capacity'
import type { Lead, Project, SalesExecutive } from '@/payload-types'

export type Ctx = { lang: Lang; leadId?: string; projectId?: string; bhk?: '2' | '3'; budget?: [number, number] }
export type SlotOption = { id: string; label: string; day: string; time: string; remaining: number }
export type Chip = { label: string; action: string; value?: string }
export type Reply = {
  ok: boolean
  error?: string
  messages: string[]
  chips?: Chip[]
  slots?: SlotOption[]
  ctx: Ctx
  bookingCode?: string
}

const LANGS: Lang[] = ['en', 'hi', 'gu']
const SOURCES = ['portal_99acres', 'portal_magicbricks', 'social_ads', 'website', 'hoarding']
const BUDGETS: Record<string, [number, number]> = { b1: [50, 75], b2: [75, 95], b3: [95, 120] }
const clean = (s: unknown, max: number) => String(s ?? '').replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, max)
const cleanCtx = (c: Ctx): Ctx => ({
  lang: LANGS.includes(c?.lang) ? c.lang : 'en',
  leadId: c?.leadId ? clean(c.leadId, 64) : undefined,
  projectId: c?.projectId ? clean(c.projectId, 64) : undefined,
  bhk: c?.bhk === '2' || c?.bhk === '3' ? c.bhk : undefined,
  budget: Array.isArray(c?.budget) && c.budget.length === 2 ? [Number(c.budget[0]) || 0, Number(c.budget[1]) || 0] : undefined,
})

async function log(leadId: string | undefined, role: 'buyer' | 'assistant', text: string) {
  if (!leadId || !text) return
  const payload = await getPayloadClient()
  await payload.create({ collection: 'chat-messages', data: { lead: leadId, role, text }, overrideAccess: true })
}

async function reply(ctx: Ctx, r: Omit<Reply, 'ok' | 'ctx'>, buyerText?: string): Promise<Reply> {
  const leadId = ctx.leadId
  // Record the first assistant response when the response is prepared, not at lead creation.
  if (leadId) {
    const payload = await getPayloadClient()
    const lead = await payload.findByID({ collection: 'leads', id: leadId, depth: 0, overrideAccess: true }).catch(() => null)
    if (lead && !lead.firstResponseAt) {
      const firstResponseAt = new Date()
      const enquiredAt = new Date(lead.enquiredAt).getTime()
      await payload.update({
        collection: 'leads', id: leadId, overrideAccess: true,
        data: {
          firstResponseAt: firstResponseAt.toISOString(),
          firstResponseMinutes: Number.isFinite(enquiredAt) ? Math.max(0, (firstResponseAt.getTime() - enquiredAt) / 60_000) : undefined,
        },
      })
    }
  }
  // Persist each turn before returning it. Handoff summaries must never race
  // an after-response callback and omit the message that triggered escalation.
  if (leadId) {
    await log(leadId, 'buyer', buyerText ?? '')
    for (const m of r.messages) await log(leadId, 'assistant', m)
  }
  return { ok: true, ctx, ...r }
}

async function getProject(id?: string): Promise<Project | null> {
  if (!id) return null
  const payload = await getPayloadClient()
  return payload.findByID({ collection: 'projects', id, depth: 0, overrideAccess: true }).catch(() => null)
}

async function openSlots(projectId: string, lang: Lang): Promise<SlotOption[]> {
  const payload = await getPayloadClient()
  const now = new Date().toISOString()
  const slots = await payload.find({
    collection: 'visit-slots', depth: 0, limit: 60, sort: 'startsAt', overrideAccess: true,
    where: { and: [{ project: { equals: projectId } }, { isOpen: { equals: true } }, { startsAt: { greater_than: now } }] },
  })
  if (!slots.docs.length) return []
  const booked = await payload.find({
    collection: 'bookings', depth: 0, limit: 1000, pagination: false, overrideAccess: true,
    where: { and: [{ slot: { in: slots.docs.map((s) => s.id) } }, { status: { in: ['booked', 'attended'] } }] },
  })
  const used = new Map<string, number>()
  for (const b of booked.docs) used.set(b.slot as string, (used.get(b.slot as string) ?? 0) + 1)
  return slots.docs
    .map((s) => ({ id: s.id, remaining: remainingCapacity(s.capacity, Array.from({ length: used.get(s.id) ?? 0 }, () => ({ status: 'booked' }))), startsAt: s.startsAt }))
    .filter((s) => s.remaining > 0)
    .slice(0, 8)
    .map((s) => ({ id: s.id, remaining: s.remaining, label: fmtDateTime(s.startsAt), day: fmtDay(s.startsAt), time: fmtTime(s.startsAt) }))
}

async function pickExec(project: string | undefined, lang: Lang): Promise<SalesExecutive | null> {
  const payload = await getPayloadClient()
  const execs = (await payload.find({ collection: 'sales-executives', where: { active: { equals: true } }, depth: 0, limit: 50, overrideAccess: true })).docs
  const fit = (strict: boolean) => execs.filter((e) => (!project || !strict || (e.projects as string[] | undefined)?.includes(project)) && (!strict || (e.languages as string[]).includes(lang)))
  const pool = fit(true).length ? fit(true) : execs
  let best: SalesExecutive | null = null, bestLoad = Infinity
  for (const e of pool) {
    const assigned = await payload.find({ collection: 'leads', overrideAccess: true, depth: 0, where: { and: [{ assignedTo: { equals: e.id } }, { stage: { in: ['qualified', 'visit_booked'] } }] }, limit: 1000, pagination: false })
    const load = assigned.docs.length
    if (load < bestLoad) { best = e; bestLoad = load }
  }
  return best
}

async function answerFact(projectId: string | undefined, topic: string, lang: Lang): Promise<string | null> {
  if (!projectId) return null
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'fact-sheet', depth: 0, limit: 1, overrideAccess: true,
    where: { and: [{ project: { equals: projectId } }, { topic: { equals: topic } }] },
  })
  const f = res.docs[0]
  if (!f) return null
  return (lang === 'hi' ? f.answerHi : lang === 'gu' ? f.answerGu : f.answerEn) || f.answerEn
}

const nextChips = (lang: Lang, other: boolean): Chip[] => [
  { label: t(lang, 'yesVisit'), action: 'visit' },
  { label: t(lang, 'price'), action: 'fact', value: 'price' },
  { label: t(lang, 'amenities'), action: 'fact', value: 'amenities' },
  { label: t(lang, 'possession'), action: 'fact', value: 'possession' },
  { label: t(lang, 'rera'), action: 'fact', value: 'rera' },
  ...(other ? [{ label: t(lang, 'other'), action: 'other' }] : []),
  { label: t(lang, 'human'), action: 'human' },
]

export async function registerBuyer(input: { ctx: Ctx; name: string; phone: string; consent: boolean; whatsapp: boolean; source?: string }): Promise<Reply> {
  const ctx = cleanCtx(input.ctx)
  const name = clean(input.name, 80)
  const phone = normalizePhone(clean(input.phone, 20))
  if (name.length < 2) return { ok: false, error: t(ctx.lang, 'errName'), messages: [], ctx }
  if (!/^[6-9]\d{9}$/.test(phone)) return { ok: false, error: t(ctx.lang, 'errPhone'), messages: [], ctx }
  if (input.consent !== true) return { ok: false, error: t(ctx.lang, 'errConsent'), messages: [], ctx }
  const source = SOURCES.includes(String(input.source)) ? String(input.source) : 'website'
  const payload = await getPayloadClient()
  const enquiryAt = new Date()
  const now = enquiryAt.toISOString()
  const account = await appAuth.currentUser()
  const owner = account && !isStaffRole(account) ? account.id : undefined
  const lead = await payload.create({
    collection: 'leads', overrideAccess: true,
    data: {
      user: owner, name, phone: `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`, language: ctx.lang, source: source as Lead['source'], stage: 'engaged',
      enquiredAt: now, consentDpdp: true, consentAt: now, whatsappOptIn: input.whatsapp === true,
    },
  })
  const next: Ctx = { ...ctx, leadId: lead.id }
  const lang = ctx.lang
  // Persist the opening exchange before the next buyer turn can arrive.
  await log(lead.id, 'assistant', t(lang, 'greet'))
  await log(lead.id, 'assistant', t(lang, 'askRegister'))
  return reply(next, {
    messages: [t(lang, 'askBhk', { name: name.split(' ')[0] })],
    chips: [{ label: t(lang, 'bhk2'), action: 'bhk', value: '2' }, { label: t(lang, 'bhk3'), action: 'bhk', value: '3' }],
  }, `${name} · +91 ${phone}`)
}

export async function chooseOption(input: { ctx: Ctx; action: string; value?: string; label?: string }): Promise<Reply> {
  const ctx = cleanCtx(input.ctx)
  const lang = ctx.lang
  const payload = await getPayloadClient()
  const label = clean(input.label, 120)
  const value = clean(input.value, 64)

  if (input.action === 'bhk' && (value === '2' || value === '3')) {
    const next = { ...ctx, bhk: value as '2' | '3' }
    if (ctx.leadId) await payload.update({ collection: 'leads', id: ctx.leadId, data: { bhk: value as '2' | '3' }, overrideAccess: true })
    return reply(next, {
      messages: [t(lang, 'askBudget')],
      chips: ['b1', 'b2', 'b3'].map((k) => ({ label: t(lang, k), action: 'budget', value: k })),
    }, label)
  }

  if (input.action === 'budget' && BUDGETS[value]) {
    const [lo, hi] = BUDGETS[value]
    const projects = (await payload.find({ collection: 'projects', where: { approvedForPublic: { equals: true } }, depth: 0, limit: 10, sort: 'name', overrideAccess: true })).docs
    const fits = projects.filter((p) => p.priceFromLakh <= hi && p.priceToLakh >= lo && (!ctx.bhk || (p.configurations as string[] | undefined)?.includes(ctx.bhk)))
    const mid = (lo + hi) / 2
    const ranked = (fits.length ? fits : projects).slice().sort((a, b) => Math.abs((a.priceFromLakh + a.priceToLakh) / 2 - mid) - Math.abs((b.priceFromLakh + b.priceToLakh) / 2 - mid))
    const best = ranked[0]
    if (!best) return reply({ ...ctx, budget: [lo, hi] }, { messages: [t(lang, 'noSlots')] }, label)
    const next: Ctx = { ...ctx, budget: [lo, hi], projectId: best.id }
    if (ctx.leadId) await payload.update({ collection: 'leads', id: ctx.leadId, data: { budgetMinLakh: lo, budgetMaxLakh: hi, project: best.id, stage: 'qualified' }, overrideAccess: true })
    const price = (await answerFact(best.id, 'price', lang)) ?? `${formatLakh(best.priceFromLakh)} - ${formatLakh(best.priceToLakh)}`
    return reply(next, {
      messages: [t(lang, 'recommend', { project: best.name, locality: best.locality, price }) + ' ' + t(lang, 'priceNote'), t(lang, 'askVisit')],
      chips: nextChips(lang, projects.length > 1),
    }, label)
  }

  if (input.action === 'other') {
    const projects = (await payload.find({ collection: 'projects', depth: 0, limit: 10, sort: 'name', overrideAccess: true })).docs
    const alt = projects.find((p) => p.id !== ctx.projectId)
    if (!alt) return reply(ctx, { messages: [t(lang, 'askVisit')], chips: nextChips(lang, false) }, label)
    const next = { ...ctx, projectId: alt.id }
    if (ctx.leadId) await payload.update({ collection: 'leads', id: ctx.leadId, data: { project: alt.id }, overrideAccess: true })
    const price = (await answerFact(alt.id, 'price', lang)) ?? ''
    return reply(next, { messages: [t(lang, 'recommendAlt', { project: alt.name }) + ' ' + price, t(lang, 'askVisit')], chips: nextChips(lang, true) }, label)
  }

  if (input.action === 'fact' && value) {
    const ans = await answerFact(ctx.projectId, value, lang)
    return reply(ctx, { messages: [ans ? (value === 'price' ? `${ans} ${t(lang, 'priceNote')}` : ans) : t(lang, 'fallbackNoExec')], chips: nextChips(lang, true) }, label)
  }

  if (input.action === 'visit' && ctx.projectId) {
    const project = await getProject(ctx.projectId)
    const slots = await openSlots(ctx.projectId, lang)
    if (!slots.length) return reply(ctx, { messages: [t(lang, 'noSlots')] }, label)
    return reply(ctx, { messages: [t(lang, 'pickSlot', { project: project?.name ?? '' })], slots }, label)
  }

  if (input.action === 'back' && ctx.projectId) {
    const all = (await payload.find({ collection: 'projects', where: { approvedForPublic: { equals: true } }, depth: 0, limit: 10, overrideAccess: true })).docs
    return reply(ctx, { messages: [t(lang, 'askVisit')], chips: nextChips(lang, all.length > 1) })
  }

  if (input.action === 'human') return handoffToPerson(ctx, 'Buyer asked to speak to a person', label)

  return { ok: false, error: 'Unknown option', messages: [], ctx }
}

async function flag(leadId: string | undefined, reason: string, pendingBuyerText?: string) {
  if (!leadId) return
  const payload = await getPayloadClient()
  const lead = await payload.findByID({ collection: 'leads', id: leadId, depth: 0, overrideAccess: true }).catch(() => null)
  if (!lead) return
  const exec = lead.assignedTo
    ? await payload.findByID({ collection: 'sales-executives', id: lead.assignedTo as string, depth: 0, overrideAccess: true }).catch(() => null)
    : await pickExec(lead.project as string | undefined, (lead.language as Lang) || 'en')
  const transcript = await payload.find({
    collection: 'chat-messages', where: { lead: { equals: leadId } },
    depth: 0, limit: 1000, sort: 'createdAt', pagination: false, overrideAccess: true,
  })
  const transcriptText = [...transcript.docs.map((m) => `${m.role === 'buyer' ? 'Buyer' : 'HOMIQ'}: ${m.text}`), ...(pendingBuyerText ? [`Buyer: ${pendingBuyerText}`] : [])].join('\\n')
  const summary = [
    `Lead: ${lead.name}; source: ${lead.source}; language: ${lead.language}.`,
    `Project: ${lead.project || 'not selected'}; preference: ${lead.bhk ? lead.bhk + ' BHK' : 'not stated'}; budget: ${lead.budgetMinLakh != null ? `₹${lead.budgetMinLakh}L to ₹${lead.budgetMaxLakh}L` : 'not stated'}.`,
    `Escalation: ${reason}`,
    transcriptText ? `Full conversation transcript:\\n${transcriptText}` : 'No persisted conversation messages yet.',
  ].join('\\n\\n')
  await payload.update({
    collection: 'leads', id: leadId, data: {
      flagged: true, flagReason: reason, assignedTo: exec?.id,
      handedOffAt: new Date().toISOString(), summary,
    }, overrideAccess: true,
  })
}

async function handoffToPerson(ctx: Ctx, reason: string, buyerText?: string): Promise<Reply> {
  const lang = ctx.lang
  const payload = await getPayloadClient()
  const lead = ctx.leadId
    ? await payload.findByID({ collection: 'leads', id: ctx.leadId, depth: 0, overrideAccess: true }).catch(() => null)
    : null
  const exec = lead?.assignedTo
    ? await payload.findByID({ collection: 'sales-executives', id: lead.assignedTo as string, depth: 0, overrideAccess: true }).catch(() => null)
    : await pickExec(ctx.projectId, lang)
  const execName = exec?.name ?? ''

  // Save the buyer's triggering message and the assistant's handoff response
  // before reading the transcript. This prevents the summary from racing writes.
  const result = await reply(ctx, {
    messages: [execName ? t(lang, 'humanDone', { exec: execName }) : t(lang, 'humanNoExec')],
    chips: ctx.projectId ? nextChips(lang, true).filter((chip) => chip.action !== 'human') : undefined,
  }, buyerText)

  if (lead) {
    const transcript = await payload.find({
      collection: 'chat-messages',
      where: { lead: { equals: lead.id } },
      depth: 0,
      limit: 1000,
      sort: 'createdAt',
      pagination: false,
      overrideAccess: true,
    })
    const transcriptText = transcript.docs
      .map((message) => `${message.role === 'buyer' ? 'Buyer' : 'HOMIQ'}: ${message.text}`)
      .join('\\n')
    const summary = [
      `Lead: ${lead.name}; source: ${lead.source}; language: ${lead.language}.`,
      `Project: ${lead.project || ctx.projectId || 'not selected'}; preference: ${ctx.bhk ?? lead.bhk ?? 'not stated'} BHK; budget: ${ctx.budget ? `₹${ctx.budget[0]}L to ₹${ctx.budget[1]}L` : 'not stated'}.`,
      `Escalation: ${reason}`,
      transcriptText || 'No conversation messages recorded.',
    ].join('\\n\\n')
    await payload.update({
      collection: 'leads',
      id: lead.id,
      overrideAccess: true,
      data: {
        assignedTo: exec?.id,
        flagged: true,
        flagReason: reason,
        handedOffAt: new Date().toISOString(),
        summary,
      },
    })
  }
  return result
}

export async function askQuestion(input: { ctx: Ctx; text: string }): Promise<Reply> {
  const ctx = cleanCtx(input.ctx)
  const lang = ctx.lang
  const text = clean(input.text, 400)
  if (!text) return { ok: false, error: 'Empty', messages: [], ctx }
  if (DISCOUNT_RE.test(text)) {
    await flag(ctx.leadId, `Asked about discount or final price: "${text.slice(0, 120)}"`, text)
    return reply(ctx, { messages: [t(lang, 'noDiscount')], chips: ctx.projectId ? nextChips(lang, true) : undefined }, text)
  }
  const topic = detectTopic(text)
  const ans = topic ? await answerFact(ctx.projectId, topic, lang) : null
  if (ans) return reply(ctx, { messages: [ans], chips: nextChips(lang, true) }, text)
  await flag(ctx.leadId, `Unanswered question: "${text.slice(0, 120)}"`, text)
  let execName = ''
  if (ctx.leadId) {
    const payload = await getPayloadClient()
    const lead = await payload.findByID({ collection: 'leads', id: ctx.leadId, depth: 1, overrideAccess: true }).catch(() => null)
    execName = lead && typeof lead.assignedTo === 'object' && lead.assignedTo ? (lead.assignedTo as SalesExecutive).name : ''
  }
  return reply(ctx, { messages: [execName ? t(lang, 'fallback', { exec: execName }) : t(lang, 'fallbackNoExec')], chips: ctx.projectId ? nextChips(lang, true) : undefined }, text)
}

export async function bookVisit(input: { ctx: Ctx; slotId: string; label?: string }): Promise<Reply> {
  const ctx = cleanCtx(input.ctx)
  const lang = ctx.lang
  const payload = await getPayloadClient()
  if (!ctx.leadId || !ctx.projectId) return { ok: false, error: 'Please start the conversation first.', messages: [], ctx }
  const lead = await payload.findByID({ collection: 'leads', id: ctx.leadId, depth: 0, overrideAccess: true }).catch(() => null)
  const slot = await payload.findByID({ collection: 'visit-slots', id: clean(input.slotId, 64), depth: 0, overrideAccess: true }).catch(() => null)
  if (!lead || !slot || slot.project !== ctx.projectId) return { ok: false, error: 'This time is not available.', messages: [], ctx }

  let booking
  // Retry unique-seat collisions. Another buyer may have claimed the same
  // candidate between the availability read and the insert. Each retry reruns
  // the booking hook, which chooses the next free seat; Mongo's unique index
  // decides which concurrent request wins.
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      booking = await payload.create({ collection: 'bookings', data: { lead: lead.id, slot: slot.id, visitors: 2 }, overrideAccess: true })
      break
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      const retryable = /duplicate key|E11000|SLOT_FULL|unique/i.test(message)
      if (!retryable || attempt === 2) {
        const slots = await openSlots(ctx.projectId, lang)
        return reply(ctx, { messages: [t(lang, 'slotTaken')], slots }, clean(input.label, 120))
      }
    }
  }
  if (!booking) {
    const slots = await openSlots(ctx.projectId, lang)
    return reply(ctx, { messages: [t(lang, 'slotTaken')], slots }, clean(input.label, 120))
  }
  const full = await payload.findByID({ collection: 'bookings', id: booking.id, depth: 0, overrideAccess: true })
  const project = await getProject(ctx.projectId)
  const exec = lead.assignedTo ? await payload.findByID({ collection: 'sales-executives', id: lead.assignedTo as string, depth: 0, overrideAccess: true }).catch(() => null) : await pickExec(ctx.projectId, lang)

  // Chat summary for the handoff.
  const asked = (await payload.find({ collection: 'chat-messages', where: { and: [{ lead: { equals: lead.id } }, { role: { equals: 'buyer' } }] }, depth: 0, limit: 20, sort: 'createdAt', overrideAccess: true })).docs
    .map((m) => m.text).filter((x) => x.includes('?')).slice(-3)
  const when = fmtDateTime(slot.startsAt)
  const summary = [
    `${lead.name} (${lead.language === 'hi' ? 'Hindi' : lead.language === 'gu' ? 'Gujarati' : 'English'}) via ${lead.source.replace('_', ' ')}.`,
    `Wants ${ctx.bhk ?? lead.bhk ?? '?'} BHK, budget ${ctx.budget ? `${formatLakh(ctx.budget[0])} to ${formatLakh(ctx.budget[1])}` : 'not stated'}.`,
    `Visit booked: ${project?.name} on ${when} (${full.code}).`,
    asked.length ? `Questions asked: ${asked.join(' | ')}` : '',
  ].filter(Boolean).join(' ')
  await payload.update({
    collection: 'leads', id: lead.id, overrideAccess: true,
    data: { stage: 'visit_booked', assignedTo: exec?.id, summary, handedOffAt: new Date().toISOString() },
  })
  return reply(ctx, {
    messages: [t(lang, 'booked', { when, project: project?.name ?? '', exec: exec?.name ?? 'Our sales advisor' })],
    bookingCode: full.code ?? undefined,
  }, clean(input.label, 120))
}
