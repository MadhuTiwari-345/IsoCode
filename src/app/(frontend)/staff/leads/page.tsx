import Link from 'next/link'
import BackLink from '@/components/BackLink'
import { getPayloadClient } from '@/lib/payload'
import { fmtDateTime, SOURCE_LABEL, STAGE_LABEL } from '@/lib/staff'
import type { Project, SalesExecutive } from '@/payload-types'

export default async function LeadsPage({ searchParams }: { searchParams: Promise<{ source?: string; dup?: string; flagged?: string }> }) {
  const sp = await searchParams
  const payload = await getPayloadClient()
  const where: any = { and: [] }
  if (sp.source && SOURCE_LABEL[sp.source]) where.and.push({ source: { equals: sp.source } })
  if (sp.dup === '1') where.and.push({ isDuplicate: { equals: true } })
  if (sp.flagged === '1') where.and.push({ flagged: { equals: true } })
  const res = await payload.find({ collection: 'leads', where, sort: '-enquiredAt', limit: 100, depth: 0, overrideAccess: true })
  const dupCount = (await payload.count({ collection: 'leads', where: { isDuplicate: { equals: true } }, overrideAccess: true })).totalDocs
  const flaggedCount = (await payload.count({ collection: 'leads', where: { flagged: { equals: true } }, overrideAccess: true })).totalDocs
  const pill = (active: boolean) => `rounded-full border px-4 py-1.5 text-sm transition ${active ? 'border-moss bg-moss text-white' : 'border-line bg-card hover:border-moss'}`
  return (
    <div>
      <BackLink href="/staff">Dashboard</BackLink>
      <p className="text-xs uppercase tracking-[0.2em] text-brass">Unified inbox</p>
      <h1 className="mt-2 font-serif text-4xl tracking-tight">Leads</h1>
      <div className="mt-8 flex flex-wrap gap-2">
        <Link href="/staff/leads" className={pill(!sp.source && !sp.dup && !sp.flagged)}>All</Link>
        {Object.entries(SOURCE_LABEL).map(([k, v]) => <Link key={k} href={`/staff/leads?source=${k}`} className={pill(sp.source === k)}>{v}</Link>)}
        <Link href="/staff/leads?dup=1" className={pill(sp.dup === '1')}>Duplicates ({dupCount})</Link>
        <Link href="/staff/leads?flagged=1" className={pill(sp.flagged === '1')}>Flagged ({flaggedCount})</Link>
      </div>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-card">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="text-left text-xs text-mute"><tr className="border-b border-line">
            {['Lead', 'Name', 'Source', 'Project', 'Preference', 'Stage', 'Owner', 'Enquired'].map((h) => <th key={h} className="px-4 py-3 font-normal">{h}</th>)}
          </tr></thead>
          <tbody>
            {res.docs.length === 0 && <tr><td colSpan={8} className="px-4 py-10 text-center text-mute">No leads match this filter.</td></tr>}
            {res.docs.map((l) => {
              const p = l.project && typeof l.project === 'object' ? l.project as Project : null, e = l.assignedTo && typeof l.assignedTo === 'object' ? l.assignedTo as SalesExecutive : null
              const legacyProject = typeof l.project === 'string' && !/^[a-f0-9]{24}$/i.test(l.project) ? l.project : null
              return (
                <tr key={l.id} className="border-b border-line last:border-0 hover:bg-paper">
                  <td className="px-4 py-3.5"><Link href={`/staff/leads/${l.id}`} className="text-moss underline-offset-4 hover:underline">{l.leadCode}</Link></td>
                  <td className="px-4 py-3.5">{l.name}{l.flagged && <span className="ml-2 rounded-full bg-[#f8e3df] px-2 py-0.5 text-[11px] text-clay">Flagged</span>}{l.isDuplicate && <span className="ml-2 rounded-full bg-[#f8e3df] px-2 py-0.5 text-[11px] text-clay">Duplicate</span>}<div className="text-xs text-mute">{l.phone}</div></td>
                  <td className="px-4 py-3.5">{SOURCE_LABEL[l.source]}</td>
                  <td className="px-4 py-3.5">{p?.name ?? legacyProject ?? '—'}</td>
                  <td className="px-4 py-3.5">{l.bhk ? `${l.bhk} BHK` : '—'}{l.budgetMaxLakh ? <div className="text-xs text-mute">₹{l.budgetMinLakh}–{l.budgetMaxLakh} lakh</div> : null}</td>
                  <td className="px-4 py-3.5">{STAGE_LABEL[l.stage ?? 'new']}</td>
                  <td className="px-4 py-3.5">{e?.name ?? <span className="text-clay">Unassigned</span>}</td>
                  <td className="px-4 py-3.5 text-mute">{fmtDateTime(l.enquiredAt)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
