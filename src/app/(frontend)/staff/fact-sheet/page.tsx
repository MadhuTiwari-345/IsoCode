import BackLink from '@/components/BackLink'
import { getPayloadClient } from '@/lib/payload'
import { getStaff, fmtDateTime } from '@/lib/staff'
import { AddFact, AddSlot, FactForm, SlotRow } from '../FactEditors'
import type { Project } from '@/payload-types'

const TOPICS = ['price', 'configs', 'possession', 'amenities', 'location', 'rera', 'payment', 'parking']

export default async function FactSheetPage() {
  const user = await getStaff()
  const canEdit = user?.role === 'head'
  const payload = await getPayloadClient()
  const [projects, facts, slots, bookings] = await Promise.all([
    payload.find({ collection: 'projects', limit: 20, sort: 'name', depth: 0, overrideAccess: true }),
    payload.find({ collection: 'fact-sheet', limit: 200, depth: 0, overrideAccess: true }),
    payload.find({ collection: 'visit-slots', limit: 120, depth: 1, sort: 'startsAt', where: { startsAt: { greater_than: new Date().toISOString() } }, overrideAccess: true }),
    payload.find({ collection: 'bookings', limit: 1000, pagination: false, depth: 0, where: { status: { in: ['booked', 'attended'] } }, overrideAccess: true }),
  ])
  const used = new Map<string, number>()
  for (const b of bookings.docs) used.set(b.slot as string, (used.get(b.slot as string) ?? 0) + 1)
  const proj = projects.docs.map((p) => ({ id: p.id, name: p.name }))
  return (
    <div>
      <BackLink href="/staff">Dashboard</BackLink>
      <p className="text-xs uppercase tracking-[0.2em] text-brass">Content the assistant relies on</p>
      <h1 className="mt-2 font-serif text-4xl tracking-tight">Fact sheet and visit slots</h1>
      <p className="mt-2 max-w-xl text-sm text-mute">The assistant quotes only these facts. If a topic is missing it says a person will confirm, flags the chat, and hands over. {canEdit ? 'Changes apply to the website and chat straight away.' : 'You can view these; the sales head edits them.'}</p>

      <h2 className="mt-12 font-serif text-2xl">Fact sheet</h2>
      {proj.map((p) => (
        <section key={p.id} className="mt-6">
          <h3 className="text-sm font-medium text-mute">{p.name}</h3>
          <div className="mt-2 rounded-2xl border border-line bg-card">
            {facts.docs.filter((f) => f.project === p.id).map((f) => <FactForm key={f.id} canEdit={canEdit} fact={{ id: f.id, topic: f.topic, answerEn: f.answerEn, answerHi: f.answerHi ?? '', answerGu: f.answerGu ?? '' }} />)}
          </div>
        </section>
      ))}
      {canEdit && <div className="mt-6"><AddFact projects={proj} topics={TOPICS} /></div>}

      <h2 className="mt-14 font-serif text-2xl">Upcoming visit slots</h2>
      <p className="mt-1 text-sm text-mute">Capacity is the most visits a time can hold. It is enforced when a visit is booked.</p>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-line bg-card">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="text-left text-xs text-mute"><tr>{['When', 'Project', 'Booked', 'Status', ''].map((h) => <th key={h} className="px-4 py-3 font-normal">{h}</th>)}</tr></thead>
          <tbody>
            {slots.docs.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-mute">No upcoming slots.</td></tr>}
            {slots.docs.map((s) => <SlotRow key={s.id} canEdit={canEdit} slot={{ id: s.id, when: fmtDateTime(s.startsAt), project: (s.project as Project).name, booked: used.get(s.id) ?? 0, capacity: s.capacity, isOpen: !!s.isOpen }} />)}
          </tbody>
        </table>
      </div>
      {canEdit && <div className="mt-6"><AddSlot projects={proj} /></div>}
    </div>
  )
}
