import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { fmtDateTime, SOURCE_LABEL, STAGE_LABEL } from '@/lib/staff'
import { LeadControls } from '../../StaffControls'
import type { Lead, Project, SalesExecutive, VisitSlot } from '@/payload-types'

export default async function LeadDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const payload = await getPayloadClient()
  const lead = await payload.findByID({ collection: 'leads', id, depth: 2, overrideAccess: true }).catch(() => null)
  if (!lead) notFound()
  const [msgs, bookings, execs] = await Promise.all([
    payload.find({ collection: 'chat-messages', where: { lead: { equals: id } }, sort: 'createdAt', limit: 200, depth: 0, overrideAccess: true }),
    payload.find({ collection: 'bookings', where: { lead: { equals: id } }, depth: 2, limit: 10, overrideAccess: true }),
    payload.find({ collection: 'sales-executives', where: { active: { equals: true } }, limit: 50, depth: 0, overrideAccess: true }),
  ])
  const dupOf = lead.duplicateOf as Lead | null
  const dupes = await payload.find({ collection: 'leads', where: { duplicateOf: { equals: id } }, depth: 0, limit: 20, overrideAccess: true })
  const project = lead.project as Project | null
  const exec = lead.assignedTo as SalesExecutive | null
  const field = (k: string, v: React.ReactNode) => <div className="flex justify-between gap-6 border-b border-line py-3 text-sm"><dt className="text-mute">{k}</dt><dd className="text-right">{v ?? '—'}</dd></div>
  return (
    <div>
      <Link href="/staff/leads" className="inline-block text-sm text-mute hover:text-ink">← All leads</Link>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-brass">{lead.leadCode}</p>
          <h1 className="mt-2 font-serif text-4xl tracking-tight">{lead.name}</h1>
        </div>
        <LeadControls id={id} assignedTo={exec?.id} execs={execs.docs.map((e) => ({ id: e.id, name: e.name }))} contacted={lead.firstResponseMinutes != null} flagged={!!lead.flagged} />
      </div>

      {lead.flagged && <div className="mt-6 rounded-2xl border border-[#ecc8c0] bg-[#fbeeea] p-5 text-sm"><p className="font-medium text-clay">Flagged for review</p><p className="mt-1">{lead.flagReason}</p></div>}
      {(dupOf || dupes.docs.length > 0) && (
        <div className="mt-6 rounded-2xl border border-[#ecc8c0] bg-[#fbeeea] p-5 text-sm">
          <p className="font-medium text-clay">Possible duplicate</p>
          {dupOf && <p className="mt-1">Same phone or email as <Link className="underline underline-offset-4" href={`/staff/leads/${dupOf.id}`}>{dupOf.name} ({dupOf.leadCode})</Link>. Follow up on the original lead.</p>}
          {dupes.docs.map((d) => <p key={d.id} className="mt-1">Re-enquired as <Link className="underline underline-offset-4" href={`/staff/leads/${d.id}`}>{d.leadCode}</Link> via {SOURCE_LABEL[d.source]}.</p>)}
        </div>
      )}

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <section className="rounded-2xl border border-brass/40 bg-card p-6">
            <h2 className="text-xs uppercase tracking-[0.2em] text-brass">Handoff summary</h2>
            <p className="mt-3 text-[15px] leading-relaxed">{lead.summary ?? 'No summary yet. The assistant writes one when a visit is booked.'}</p>
            {lead.handedOffAt && <p className="mt-3 text-xs text-mute">Handed off {fmtDateTime(lead.handedOffAt)}{exec ? ` to ${exec.name}` : ''}</p>}
          </section>
          <dl className="mt-8">
            {field('Phone', lead.phone)}
            {field('Email', lead.email)}
            {field('Language', { en: 'English', hi: 'Hindi', gu: 'Gujarati' }[lead.language ?? 'en'])}
            {field('Source', SOURCE_LABEL[lead.source])}
            {field('Project', project?.name)}
            {field('Home', lead.bhk ? `${lead.bhk} BHK` : null)}
            {field('Budget', lead.budgetMaxLakh ? `₹${lead.budgetMinLakh}–${lead.budgetMaxLakh} lakh` : null)}
            {field('Preferences', lead.preferences)}
            {field('Stage', STAGE_LABEL[lead.stage ?? 'new'])}
            {field('First response', lead.firstResponseMinutes == null ? <span className="text-clay">Not contacted</span> : `${lead.firstResponseMinutes} min`)}
            {field('DPDP consent', lead.consentDpdp ? `Given ${lead.consentAt ? fmtDateTime(lead.consentAt) : ''}` : <span className="text-clay">Not recorded</span>)}
            {field('WhatsApp opt-in', lead.whatsappOptIn ? 'Yes' : 'No. Do not message on WhatsApp')}
          </dl>
          {bookings.docs.map((b) => {
            const s = b.slot as VisitSlot
            return <p key={b.id} className="mt-6 rounded-xl bg-moss-soft p-4 text-sm">Visit {b.code}: {fmtDateTime(s.startsAt)} · {b.status}</p>
          })}
        </div>

        <section>
          <h2 className="text-xs uppercase tracking-[0.2em] text-mute">Chat history</h2>
          <div className="mt-4 space-y-3">
            {msgs.docs.length === 0 && <p className="text-sm text-mute">No chat recorded. This lead came in from a form or call.</p>}
            {msgs.docs.map((m) => (
              <div key={m.id} className={`flex ${m.role === 'buyer' ? 'justify-end' : ''}`}>
                <p className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.role === 'buyer' ? 'bg-moss text-white' : 'border border-line bg-card'}`}>{m.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
