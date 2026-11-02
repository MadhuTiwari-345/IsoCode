'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { setBookingStatus, updateLead } from './actions'

const btn = 'rounded-full border border-line bg-card px-3.5 py-1.5 text-xs transition hover:border-moss hover:bg-moss-soft disabled:opacity-50'

export function BookingButtons({ id, status }: { id: string; status: string }) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [err, setErr] = useState<string>()
  const go = (s: 'attended' | 'no_show' | 'cancelled') => start(async () => {
    const r = await setBookingStatus(id, s)
    if (r.ok) router.refresh(); else setErr(r.error)
  })
  if (status !== 'booked') return <span className="text-xs text-mute">{status === 'attended' ? 'Attended' : status === 'no_show' ? 'No-show' : 'Cancelled'}</span>
  return (
    <span className="flex flex-wrap items-center gap-2">
      <button className={btn} disabled={pending} onClick={() => go('attended')}>Attended</button>
      <button className={btn} disabled={pending} onClick={() => go('no_show')}>No-show</button>
      <button className={btn} disabled={pending} onClick={() => go('cancelled')}>Cancel</button>
      {err && <span className="text-xs text-clay">{err}</span>}
    </span>
  )
}

export function LeadControls({ id, assignedTo, execs, contacted, flagged }: { id: string; assignedTo?: string; execs: { id: string; name: string }[]; contacted: boolean; flagged: boolean }) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [err, setErr] = useState<string>()
  const run = (d: Parameters<typeof updateLead>[1]) => start(async () => {
    const r = await updateLead(id, d)
    if (r.ok) router.refresh(); else setErr(r.error)
  })
  return (
    <div className="flex flex-wrap items-center gap-3">
      <label className="text-xs text-mute" htmlFor="exec">Assigned to</label>
      <select id="exec" defaultValue={assignedTo ?? ''} disabled={pending} onChange={(e) => run({ assignedTo: e.target.value })} className="rounded-full border border-line bg-card px-4 py-1.5 text-sm">
        <option value="">Unassigned</option>
        {execs.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
      </select>
      {!contacted && <button className={btn} disabled={pending} onClick={() => run({ markContacted: true })}>Mark as contacted</button>}
      {flagged && <button className={btn} disabled={pending} onClick={() => run({ clearFlag: true })}>Mark chat reviewed</button>}
      {err && <span className="text-xs text-clay">{err}</span>}
    </div>
  )
}
