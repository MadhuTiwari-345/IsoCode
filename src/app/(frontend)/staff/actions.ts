'use server'

import { getPayloadClient } from '@/lib/payload'
import { getStaff } from '@/lib/staff'

type Result = { ok: boolean; error?: string }

export async function setBookingStatus(id: string, status: 'attended' | 'no_show' | 'cancelled' | 'booked'): Promise<Result> {
  if (!(await getStaff())) return { ok: false, error: 'Not signed in' }
  if (!['attended', 'no_show', 'cancelled', 'booked'].includes(status)) return { ok: false, error: 'Invalid status' }
  const payload = await getPayloadClient()
  try {
    const b = await payload.findByID({ collection: 'bookings', id, depth: 0, overrideAccess: true })
    await payload.update({ collection: 'bookings', id, data: { status }, overrideAccess: true })
    if (status === 'attended') await payload.update({ collection: 'leads', id: b.lead as string, data: { stage: 'visited' }, overrideAccess: true })
    return { ok: true }
  } catch (e) { return { ok: false, error: (e as Error).message } }
}

export async function updateLead(id: string, data: { assignedTo?: string; stage?: string; markContacted?: boolean; clearFlag?: boolean }): Promise<Result> {
  if (!(await getStaff())) return { ok: false, error: 'Not signed in' }
  const payload = await getPayloadClient()
  try {
    const lead = await payload.findByID({ collection: 'leads', id, depth: 0, overrideAccess: true })
    const patch: Record<string, unknown> = {}
    if (data.assignedTo !== undefined) patch.assignedTo = data.assignedTo || null
    if (data.stage && ['new', 'engaged', 'qualified', 'visit_booked', 'visited', 'lost'].includes(data.stage)) patch.stage = data.stage
    if (data.markContacted && lead.firstResponseMinutes == null) patch.firstResponseMinutes = Math.max(0, Math.round((Date.now() - +new Date(lead.enquiredAt)) / 60000))
    if (data.clearFlag) { patch.flagged = false; patch.flagReason = null }
    await payload.update({ collection: 'leads', id, data: patch, overrideAccess: true })
    return { ok: true }
  } catch (e) { return { ok: false, error: (e as Error).message } }
}

// ---- Fact sheet and visit slots (sales head only) ----

const TOPICS = ['price', 'configs', 'possession', 'amenities', 'location', 'rera', 'payment', 'parking']
const text = (v: unknown, max = 1500) => String(v ?? '').trim().slice(0, max)

async function requireHead(): Promise<Result | null> {
  const u = await getStaff()
  if (!u) return { ok: false, error: 'Not signed in' }
  if (u.role !== 'head') return { ok: false, error: 'Only the sales head can edit this.' }
  return null
}

export async function saveFact(id: string, d: { answerEn: string; answerHi: string; answerGu: string }): Promise<Result> {
  const denied = await requireHead(); if (denied) return denied
  const answerEn = text(d.answerEn)
  if (answerEn.length < 3) return { ok: false, error: 'The English answer cannot be empty.' }
  try {
    const payload = await getPayloadClient()
    await payload.update({ collection: 'fact-sheet', id, data: { answerEn, answerHi: text(d.answerHi), answerGu: text(d.answerGu) }, overrideAccess: true })
    return { ok: true }
  } catch (e) { return { ok: false, error: (e as Error).message } }
}

export async function addFact(d: { project: string; topic: string; answerEn: string }): Promise<Result> {
  const denied = await requireHead(); if (denied) return denied
  if (!TOPICS.includes(d.topic)) return { ok: false, error: 'Choose a topic.' }
  const answerEn = text(d.answerEn)
  if (!d.project || answerEn.length < 3) return { ok: false, error: 'Choose a project and write the answer.' }
  try {
    const payload = await getPayloadClient()
    const dup = await payload.count({ collection: 'fact-sheet', where: { and: [{ project: { equals: d.project } }, { topic: { equals: d.topic } }] }, overrideAccess: true })
    if (dup.totalDocs > 0) return { ok: false, error: 'That topic already exists for this project. Edit it instead.' }
    await payload.create({ collection: 'fact-sheet', data: { project: d.project, topic: d.topic as 'price', answerEn }, overrideAccess: true })
    return { ok: true }
  } catch (e) { return { ok: false, error: (e as Error).message } }
}

export async function addSlot(d: { project: string; startsAtLocal: string; capacity: number }): Promise<Result> {
  const denied = await requireHead(); if (denied) return denied
  const start = new Date(`${text(d.startsAtLocal, 16)}:00+05:30`) // times are entered in IST
  const capacity = Math.floor(Number(d.capacity))
  if (!d.project || isNaN(+start)) return { ok: false, error: 'Choose a project, date and time.' }
  if (+start < Date.now()) return { ok: false, error: 'That time is in the past.' }
  if (!(capacity >= 1 && capacity <= 20)) return { ok: false, error: 'Capacity must be between 1 and 20.' }
  try {
    const payload = await getPayloadClient()
    const clash = await payload.count({ collection: 'visit-slots', where: { and: [{ project: { equals: d.project } }, { startsAt: { equals: start.toISOString() } }] }, overrideAccess: true })
    if (clash.totalDocs > 0) return { ok: false, error: 'There is already a slot at that time.' }
    await payload.create({ collection: 'visit-slots', data: { project: d.project, startsAt: start.toISOString(), durationMinutes: 60, capacity, isOpen: true, demoOnly: false }, overrideAccess: true })
    return { ok: true }
  } catch (e) { return { ok: false, error: (e as Error).message } }
}

export async function updateSlot(id: string, d: { isOpen?: boolean; capacity?: number }): Promise<Result> {
  const denied = await requireHead(); if (denied) return denied
  try {
    const payload = await getPayloadClient()
    const patch: Record<string, unknown> = {}
    if (typeof d.isOpen === 'boolean') patch.isOpen = d.isOpen
    if (d.capacity !== undefined) {
      const cap = Math.floor(Number(d.capacity))
      if (!(cap >= 1 && cap <= 20)) return { ok: false, error: 'Capacity must be between 1 and 20.' }
      const booked = await payload.count({ collection: 'bookings', where: { and: [{ slot: { equals: id } }, { status: { in: ['booked', 'attended'] } }] }, overrideAccess: true })
      if (cap < booked.totalDocs) return { ok: false, error: `${booked.totalDocs} visits are already booked, so capacity cannot go below that.` }
      patch.capacity = cap
    }
    await payload.update({ collection: 'visit-slots', id, data: patch, overrideAccess: true })
    return { ok: true }
  } catch (e) { return { ok: false, error: (e as Error).message } }
}

export async function deleteSlot(id: string): Promise<Result> {
  const denied = await requireHead(); if (denied) return denied
  try {
    const payload = await getPayloadClient()
    const booked = await payload.count({ collection: 'bookings', where: { slot: { equals: id } }, overrideAccess: true })
    if (booked.totalDocs > 0) return { ok: false, error: 'This slot has bookings. Close it instead of deleting.' }
    await payload.delete({ collection: 'visit-slots', id, overrideAccess: true })
    return { ok: true }
  } catch (e) { return { ok: false, error: (e as Error).message } }
}
