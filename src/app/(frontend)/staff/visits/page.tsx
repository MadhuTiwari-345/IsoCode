import Link from 'next/link'
import BackLink from '@/components/BackLink'
import { getPayloadClient } from '@/lib/payload'
import { fmtDateTime, fmtDay, fmtTime } from '@/lib/staff'
import { BookingButtons } from '../StaffControls'
import type { Lead, Project, SalesExecutive, VisitSlot } from '@/payload-types'

export default async function VisitsPage() {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'bookings', limit: 200, depth: 3, overrideAccess: true })
  const rows = res.docs
    .map((b) => ({ b, slot: b.slot as VisitSlot, lead: b.lead as Lead }))
    .sort((a, c) => +new Date(a.slot.startsAt) - +new Date(c.slot.startsAt))
  const groups = new Map<string, typeof rows>()
  for (const r of rows) { const k = fmtDay(r.slot.startsAt); groups.set(k, [...(groups.get(k) ?? []), r]) }
  return (
    <div>
      <BackLink href="/staff">Dashboard</BackLink>
      <p className="text-xs uppercase tracking-[0.2em] text-brass">Schedule</p>
      <h1 className="mt-2 font-serif text-4xl tracking-tight">Site visits</h1>
      <p className="mt-2 text-sm text-mute">Every slot has a fixed capacity, checked when a visit is booked, so a time cannot be booked past its limit.</p>
      {rows.length === 0 && <p className="mt-10 text-mute">No visits booked yet.</p>}
      {[...groups].map(([day, items]) => (
        <section key={day} className="mt-10">
          <h2 className="font-serif text-xl">{day}</h2>
          <ul className="mt-3 divide-y divide-line rounded-2xl border border-line bg-card">
            {items.map(({ b, slot, lead }) => {
              const p = slot.project as Project, e = lead.assignedTo as SalesExecutive | null
              return (
                <li key={b.id} className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 text-sm">
                  <div className="min-w-[200px]">
                    <p className="font-medium">{fmtTime(slot.startsAt)} · <Link href={`/staff/leads/${lead.id}`} className="text-moss underline-offset-4 hover:underline">{lead.name}</Link></p>
                    <p className="mt-0.5 text-xs text-mute">{p.name} · {b.visitors} visitors · {e ? e.name : 'Unassigned'} · {b.code}</p>
                    <p className="mt-0.5 text-xs text-mute">Reminders: {b.reminderDayBefore ? fmtDateTime(b.reminderDayBefore) : '—'} and {b.reminderTwoHours ? fmtDateTime(b.reminderTwoHours) : '—'}</p>
                  </div>
                  <BookingButtons id={b.id} status={b.status ?? 'booked'} />
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}
