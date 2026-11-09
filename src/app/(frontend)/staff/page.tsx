import { getPayloadClient } from '@/lib/payload'
import Link from 'next/link'
import { SOURCE_LABEL, fmtDateTime } from '@/lib/staff'
import type { Booking, Lead } from '@/payload-types'

const median = (a: number[]) => { if (!a.length) return null; const s = [...a].sort((x, y) => x - y); const m = Math.floor(s.length / 2); return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2 }
const fmtMin = (m: number | null) => (m == null ? '—' : m < 60 ? `${Math.round(m)} min` : `${(m / 60).toFixed(1)} hr`)
const inr = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`
const pct = (n: number, d: number) => (d ? `${((n / d) * 100).toFixed(1)}%` : '—')

export default async function Dashboard() {
  const payload = await getPayloadClient()
  const [leadsRes, bookingsRes, spendRes] = await Promise.all([
    payload.find({ collection: 'leads', limit: 2000, pagination: false, depth: 0, overrideAccess: true }),
    payload.find({ collection: 'bookings', limit: 2000, pagination: false, depth: 0, overrideAccess: true }),
    payload.find({ collection: 'source-spend', limit: 50, depth: 0, overrideAccess: true }),
  ])
  const leads = leadsRes.docs.filter((l) => !l.isDuplicate)
  const bookings = bookingsRes.docs.filter((b) => b.status !== 'cancelled')
  const leadById = new Map<string, Lead>(leadsRes.docs.map((l) => [l.id, l]))
  const now = Date.now()
  const med = median(leads.filter((l) => l.firstResponseMinutes != null).map((l) => l.firstResponseMinutes as number))
  const old = leads.filter((l) => now - +new Date(l.enquiredAt) > 48 * 3600e3)
  const unreached = old.filter((l) => l.firstResponseMinutes == null || l.firstResponseMinutes > 48 * 60)
  const bookingLeadIds = new Set(bookings.map((b) => b.lead as string))
  // Legacy/sample leads may record a completed visit without a Booking document.
  // Count those once, without double-counting leads already represented by bookings.
  const visitedWithoutBooking = leads.filter((l) => l.stage === 'visited' && !bookingLeadIds.has(l.id))
  const visitLeads = new Set([...bookingLeadIds, ...visitedWithoutBooking.map((l) => l.id)])
  const done = bookings.filter((b: Booking) => b.status === 'attended' || b.status === 'no_show')
  const completedVisitCount = done.length + visitedWithoutBooking.length
  const showUp = done.filter((b) => b.status === 'attended').length + visitedWithoutBooking.length

  const rows = Object.keys(SOURCE_LABEL).map((s) => {
    const sl = leads.filter((l) => l.source === s)
    const bookedVisits = bookings.filter((b) => leadById.get(b.lead as string)?.source === s)
    const legacyVisited = leads.filter((l) => l.source === s && l.stage === 'visited' && !bookingLeadIds.has(l.id))
    const visits = bookedVisits.length + legacyVisited.length
    const spend = spendRes.docs.find((x) => x.source === s)?.spendInr ?? 0
    return { s, leads: sl.length, visits, spend, cpl: sl.length ? spend / sl.length : null, cpv: visits ? spend / visits : null, rate: sl.length ? visits / sl.length : 0 }
  })
  const maxRate = Math.max(...rows.map((r) => r.rate), 0.01)
  const totalSpend = rows.reduce((a, r) => a + r.spend, 0)

  const kpis = [
    ['Median first response', fmtMin(med), 'Target under 5 min'],
    ['Unreached after 48 hours', pct(unreached.length, old.length), `${unreached.length} of ${old.length} leads. Target under 5%`],
    ['Lead to visit rate', pct(visitLeads.size, leads.length), 'Target 8%'],
    ['Show-up rate', pct(showUp, completedVisitCount), `${showUp} of ${completedVisitCount} completed visits`],
    ['Cost per visit', totalSpend > 0 && visitLeads.size ? inr(totalSpend / visitLeads.size) : '—', totalSpend > 0 ? `${inr(totalSpend)} across ${visitLeads.size} recorded visits` : 'Enter verified source spend to calculate this KPI'],
  ]
  const flagged = leadsRes.docs.filter((l) => l.flagged)
  const waiting = leads.filter((l) => l.firstResponseMinutes == null).sort((a, b) => +new Date(a.enquiredAt) - +new Date(b.enquiredAt)).slice(0, 6)
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.2em] text-moss">Sales workspace</p>
      <h1 className="mt-2 font-serif text-5xl tracking-tight">Lead performance</h1>
      <p className="mt-2 max-w-xl text-sm text-mute">Based on {leads.length} unique leads. Duplicate enquiries are excluded from every figure.</p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {kpis.map(([k, v, n]) => (
          <div key={k} className="rounded-2xl border border-line bg-white p-5 shadow-[0_4px_20px_rgba(27,41,39,0.035)]">
            <p className="text-xs text-mute">{k}</p>
            <p className="mt-3 font-serif text-4xl tracking-tight">{v}</p>
            <p className="mt-2 text-xs text-mute">{n}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-12 font-serif text-3xl">Source performance</h2>
      <div className="mt-5 overflow-x-auto rounded-2xl border border-line bg-card">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="text-left text-xs text-mute"><tr className="border-b border-line">
            {['Source', 'Leads', 'Visits recorded', 'Lead to visit', 'Spend', 'Cost per lead', 'Cost per visit'].map((h) => <th key={h} className="px-5 py-3 font-normal">{h}</th>)}
          </tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.s} className="border-b border-line last:border-0">
                <td className="px-5 py-4 font-medium">{SOURCE_LABEL[r.s]}</td>
                <td className="px-5 py-4">{r.leads}</td>
                <td className="px-5 py-4">{r.visits}</td>
                <td className="px-5 py-4"><div className="flex items-center gap-3"><div className="h-1.5 w-24 rounded-full bg-moss-soft"><div className="h-full rounded-full bg-moss" style={{ width: `${(r.rate / maxRate) * 100}%` }} /></div>{pct(r.visits, r.leads)}</div></td>
                <td className="px-5 py-4">{inr(r.spend)}</td>
                <td className="px-5 py-4">{r.cpl ? inr(r.cpl) : '—'}</td>
                <td className="px-5 py-4">{r.cpv ? inr(r.cpv) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-mute">The brief supplies only total monthly spend, not a channel split. Enter verified spend by source under Source spend to calculate reliable source-level CPL and cost per visit.</p>

      <div className="mt-12 grid gap-5 lg:grid-cols-2">
        <section>
          <h2 className="font-serif text-2xl">Chats flagged for review <span className="text-mute">({flagged.length})</span></h2>
          <ul className="mt-4 divide-y divide-line rounded-2xl border border-line bg-white shadow-[0_4px_20px_rgba(27,41,39,0.035)]">
            {flagged.length === 0 && <li className="px-5 py-6 text-sm text-mute">Nothing to review.</li>}
            {flagged.slice(0, 6).map((l) => (
              <li key={l.id} className="px-5 py-3.5 text-sm"><Link href={`/staff/leads/${l.id}`} className="font-medium hover:underline">{l.name}</Link><p className="mt-0.5 text-xs text-mute">{l.flagReason}</p></li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="font-serif text-2xl">Waiting for first contact</h2>
          <ul className="mt-4 divide-y divide-line rounded-2xl border border-line bg-card">
            {waiting.length === 0 && <li className="px-5 py-6 text-sm text-mute">Every lead has been contacted.</li>}
            {waiting.map((l) => (
              <li key={l.id} className="flex justify-between gap-4 px-5 py-3.5 text-sm"><Link href={`/staff/leads/${l.id}`} className="font-medium hover:underline">{l.name}</Link><span className="text-xs text-mute">{SOURCE_LABEL[l.source]} · {fmtDateTime(l.enquiredAt)}</span></li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
