import Link from 'next/link'
import BackLink from '@/components/BackLink'
import SiteHeader from '@/components/SiteHeader'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { fmtDay, fmtTime, fmtDateTime } from '@/lib/staff'
import type { Project, SalesExecutive, VisitSlot, Lead } from '@/payload-types'

export const metadata = { title: 'Visit details | HOMIQ' }

export default async function VisitPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'bookings', where: { code: { equals: code.toUpperCase() } }, depth: 2, limit: 1, overrideAccess: true })
  const b = res.docs[0]
  if (!b) notFound()
  const slot = b.slot as VisitSlot
  const project = (typeof slot.project === 'object' ? slot.project : null) as Project | null
  const lead = b.lead as Lead
  const exec = lead.assignedTo && typeof lead.assignedTo === 'object' ? (lead.assignedTo as SalesExecutive) : null
  if (!project) notFound()
  const q = `${project.latitude},${project.longitude}`
  const bbox = `${project.longitude - 0.008},${project.latitude - 0.005},${project.longitude + 0.008},${project.latitude + 0.005}`
  const demoSlot = (slot as any).demoOnly === true
  const hasMapPin = Number.isFinite(project.latitude) && Number.isFinite(project.longitude) && (project.latitude !== 0 || project.longitude !== 0) && Boolean(project.address) && !project.address.toLowerCase().includes('to be confirmed')
  const channel = lead.whatsappOptIn ? 'WhatsApp' : 'SMS'
  const reminders = [
    { label: 'One day before', at: b.reminderDayBefore },
    { label: 'Two hours before', at: b.reminderTwoHours },
  ]
  return (
    <>
    <SiteHeader />
    <main className="mx-auto max-w-2xl px-6 py-10">
      <BackLink href="/account">My visits</BackLink>
      <p className="mt-12 text-xs uppercase tracking-[0.2em] text-brass">{demoSlot ? 'Visit request · awaiting advisor confirmation' : b.status === 'cancelled' ? 'Cancelled' : 'Visit confirmed'} · {b.code}</p>
      <h1 className="mt-3 font-serif text-4xl leading-tight tracking-tight">{fmtDay(slot.startsAt)}<br />at {fmtTime(slot.startsAt)}</h1>
      <p className="mt-4 text-mute">{project.name}, {project.locality}. About {slot.durationMinutes ?? 60} minutes.</p>

      {demoSlot && <p className="mt-5 rounded-xl border border-line bg-card px-4 py-3 text-sm leading-relaxed text-mute">Your selected time is recorded as a visit request. A sales advisor will confirm the appointment and verified location with you before you travel.</p>}
      <div className="mt-10 overflow-hidden rounded-2xl border border-line">
        {hasMapPin ? <><iframe title={`Map of ${project.name}`} className="h-64 w-full" loading="lazy" src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${q}`} /><div className="flex flex-wrap items-center justify-between gap-3 bg-card p-5"><p className="max-w-sm text-sm leading-relaxed">{project.address}</p><a className="rounded-full btn-grad px-5 py-2.5 text-sm font-medium text-white hover:brightness-110" href={`https://www.google.com/maps/search/?api=1&query=${q}`} target="_blank" rel="noreferrer">Open in Maps</a></div></> : <div className="bg-card p-5 text-sm leading-relaxed text-mute">The site address and map pin are awaiting verification. Your advisor will share the correct directions when confirming the visit.</div>}
      </div>
      {exec && (
        <section className="mt-10 border-t border-line pt-8">
          <h2 className="text-xs uppercase tracking-[0.2em] text-mute">Your sales advisor</h2>
          <p className="mt-3 font-serif text-2xl">{exec.name}</p>
          {exec.phone?.trim() && !/^0+$/.test(exec.phone.replace(/\D/g, '')) && <a href={`tel:${exec.phone.replace(/\s/g, '')}`} className="mt-1 inline-block text-sm text-moss underline underline-offset-4">{exec.phone}</a>}
          <p className="mt-2 text-sm text-mute">Your conversation so far has been shared, so you will not need to repeat yourself.</p>
        </section>
      )}

      <section className="mt-10 border-t border-line pt-8">
        <h2 className="text-xs uppercase tracking-[0.2em] text-mute">Planned reminders</h2>
        <ul className="mt-4 space-y-3">
          {reminders.map((r) => (
            <li key={r.label} className="flex justify-between border-b border-line pb-3 text-sm"><span>{r.label}</span><span className="text-mute">{r.at ? fmtDateTime(r.at) : '—'}</span></li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-mute">Reminder times are recorded here. Message delivery is not connected in this deployment, so no {channel} message is sent. WhatsApp notifications require your opt-in and an approved template.</p>
      </section>
      {project.reraNumber && !project.reraNumber.toLowerCase().includes('pending verification') && <p className="mt-12 text-xs text-mute">RERA: {project.reraNumber}</p>}
    </main>
    </>
  )
}
