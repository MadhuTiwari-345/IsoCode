'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { addFact, addSlot, deleteSlot, saveFact, updateSlot } from './actions'

type Proj = { id: string; name: string }
type R = { ok: boolean; error?: string }
const field = 'w-full rounded-xl border border-line bg-card px-3.5 py-2.5 text-sm outline-none focus:border-ink'
const btn = 'rounded-full border border-line bg-card px-4 py-2 text-sm transition hover:border-ink disabled:opacity-50'
const primary = 'btn-grad rounded-full px-5 py-2 text-sm font-medium text-white disabled:opacity-50'

function useDo() {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [msg, setMsg] = useState<{ ok: boolean; text: string }>()
  const run = (fn: () => Promise<R>, done = 'Saved') => start(async () => {
    const r = await fn()
    setMsg({ ok: r.ok, text: r.ok ? done : r.error ?? 'Something went wrong' })
    if (r.ok) router.refresh()
  })
  return { pending, msg, run }
}
const Msg = ({ m }: { m?: { ok: boolean; text: string } }) => (m ? <span role="status" className={`text-sm ${m.ok ? 'text-moss' : 'text-clay'}`}>{m.text}</span> : null)

export function FactForm({ fact, canEdit }: { fact: { id: string; topic: string; answerEn: string; answerHi: string; answerGu: string }; canEdit: boolean }) {
  const { pending, msg, run } = useDo()
  const [v, setV] = useState({ answerEn: fact.answerEn, answerHi: fact.answerHi, answerGu: fact.answerGu })
  return (
    <details className="group border-b border-line last:border-0">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm">
        <span><span className="font-medium capitalize">{fact.topic}</span><span className="ml-3 text-mute">{fact.answerEn.slice(0, 70)}{fact.answerEn.length > 70 ? '…' : ''}</span></span>
        <span className="text-mute transition group-open:rotate-45">+</span>
      </summary>
      <div className="space-y-3 px-5 pb-5">
        {([['answerEn', 'English'], ['answerHi', 'हिन्दी'], ['answerGu', 'ગુજરાતી']] as const).map(([k, l]) => (
          <label key={k} className="block text-xs text-mute">{l}<textarea disabled={!canEdit} rows={2} value={v[k]} onChange={(e) => setV({ ...v, [k]: e.target.value })} className={`${field} mt-1`} /></label>
        ))}
        {canEdit ? <div className="flex items-center gap-3"><button disabled={pending} onClick={() => run(() => saveFact(fact.id, v))} className={primary}>Save changes</button><Msg m={msg} /></div> : <p className="text-xs text-mute">Only the sales head can edit facts.</p>}
      </div>
    </details>
  )
}

export function AddFact({ projects, topics }: { projects: Proj[]; topics: string[] }) {
  const { pending, msg, run } = useDo()
  const [v, setV] = useState({ project: projects[0]?.id ?? '', topic: topics[0], answerEn: '' })
  return (
    <div className="space-y-3 rounded-2xl border border-line bg-card p-5">
      <p className="font-medium">Add a fact</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <select aria-label="Project" className={field} value={v.project} onChange={(e) => setV({ ...v, project: e.target.value })}>{projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
        <select aria-label="Topic" className={field} value={v.topic} onChange={(e) => setV({ ...v, topic: e.target.value })}>{topics.map((t) => <option key={t} value={t}>{t}</option>)}</select>
      </div>
      <textarea aria-label="Answer in English" rows={2} placeholder="Answer in English. You can add Hindi and Gujarati after saving." value={v.answerEn} onChange={(e) => setV({ ...v, answerEn: e.target.value })} className={field} />
      <div className="flex items-center gap-3"><button disabled={pending} onClick={() => run(async () => { const r = await addFact(v); if (r.ok) setV({ ...v, answerEn: '' }); return r }, 'Fact added')} className={primary}>Add fact</button><Msg m={msg} /></div>
    </div>
  )
}

export function AddSlot({ projects }: { projects: Proj[] }) {
  const { pending, msg, run } = useDo()
  const [v, setV] = useState({ project: projects[0]?.id ?? '', startsAtLocal: '', capacity: 2 })
  return (
    <div className="space-y-3 rounded-2xl border border-line bg-card p-5">
      <p className="font-medium">Add a visit slot <span className="font-normal text-mute">(times in IST)</span></p>
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_100px]">
        <select aria-label="Project" className={field} value={v.project} onChange={(e) => setV({ ...v, project: e.target.value })}>{projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
        <input aria-label="Date and time" type="datetime-local" className={field} value={v.startsAtLocal} onChange={(e) => setV({ ...v, startsAtLocal: e.target.value })} />
        <input aria-label="Capacity" type="number" min={1} max={20} className={field} value={v.capacity} onChange={(e) => setV({ ...v, capacity: Number(e.target.value) })} />
      </div>
      <div className="flex items-center gap-3"><button disabled={pending} onClick={() => run(() => addSlot(v), 'Slot added')} className={primary}>Add slot</button><Msg m={msg} /></div>
    </div>
  )
}

export function SlotRow({ slot, canEdit }: { slot: { id: string; when: string; project: string; booked: number; capacity: number; isOpen: boolean }; canEdit: boolean }) {
  const { pending, msg, run } = useDo()
  const [cap, setCap] = useState(slot.capacity)
  const full = slot.booked >= slot.capacity
  return (
    <tr className="border-t border-line">
      <td className="px-4 py-3">{slot.when}</td>
      <td className="px-4 py-3">{slot.project}</td>
      <td className="px-4 py-3">{slot.booked} of {canEdit ? <input aria-label="Capacity" type="number" min={1} max={20} value={cap} onChange={(e) => setCap(Number(e.target.value))} onBlur={() => cap !== slot.capacity && run(() => updateSlot(slot.id, { capacity: cap }), 'Updated')} className="ml-1 w-14 rounded-lg border border-line bg-card px-2 py-1" /> : slot.capacity}</td>
      <td className={`px-4 py-3 ${!slot.isOpen ? 'text-mute' : full ? 'text-clay' : 'text-moss'}`}>{!slot.isOpen ? 'Closed' : full ? 'Full' : 'Open'}</td>
      <td className="px-4 py-3 text-right">
        {canEdit && (
          <span className="inline-flex items-center gap-2">
            <Msg m={msg} />
            <button disabled={pending} className={btn} onClick={() => run(() => updateSlot(slot.id, { isOpen: !slot.isOpen }), slot.isOpen ? 'Closed' : 'Opened')}>{slot.isOpen ? 'Close' : 'Open'}</button>
            <button disabled={pending} className={btn} onClick={() => run(() => deleteSlot(slot.id), 'Deleted')}>Delete</button>
          </span>
        )}
      </td>
    </tr>
  )
}
