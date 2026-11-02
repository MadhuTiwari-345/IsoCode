import Link from 'next/link'
import { redirect } from 'next/navigation'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import { appAuth, isStaffRole } from '@/lib/app-auth'
import { getPayloadClient } from '@/lib/payload'
import { fmtDateTime } from '@/lib/staff'
import type { Project, VisitSlot } from '@/payload-types'

export const metadata = { title: 'My account | Company A' }

export default async function AccountPage() {
  const user = await appAuth.currentUser()
  if (!user) redirect('/login?next=/account')
  if (isStaffRole(user)) redirect('/staff')
  const payload = await getPayloadClient()
  // Access rules limit this to bookings whose lead belongs to the signed-in buyer.
  const res = await payload.find({ collection: 'bookings', depth: 2, limit: 50, user, overrideAccess: false, sort: '-createdAt' })
  const rows = res.docs.map((b) => ({ b, slot: b.slot as VisitSlot })).sort((a, c) => +new Date(a.slot.startsAt) - +new Date(c.slot.startsAt))
  const now = Date.now()
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 pt-10">
        <nav className="text-sm text-mute" aria-label="Breadcrumb"><Link href="/" className="hover:text-ink">Home</Link> <span className="mx-1">/</span> <span className="text-ink">My account</span></nav>
        <h1 className="mt-6 font-serif text-5xl font-medium leading-none tracking-tight">Hello, {user.name.split(' ')[0]}</h1>
        <p className="mt-3 text-mute">{user.email}</p>

        <div className="mt-10 flex items-center justify-between">
          <h2 className="font-serif text-3xl font-semibold">Your site visits</h2>
          <Link href="/chat" className="btn-grad rounded-full px-5 py-2.5 text-sm font-medium text-white">Book a visit</Link>
        </div>
        <ul className="mt-5 divide-y divide-line rounded-2xl border border-line bg-card">
          {rows.length === 0 && <li className="px-6 py-10 text-center text-sm text-mute">No visits yet. Chat with us to book one.</li>}
          {rows.map(({ b, slot }) => {
            const p = slot.project as Project
            const upcoming = +new Date(slot.startsAt) > now && b.status === 'booked'
            return (
              <li key={b.id} className="flex flex-wrap items-center justify-between gap-4 px-6 py-5">
                <div><p className="font-medium">{p.name}</p><p className="mt-0.5 text-sm text-mute">{fmtDateTime(slot.startsAt)} · {b.code}</p></div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-3 py-1 text-xs ${upcoming ? 'bg-moss-soft text-moss' : 'bg-subtle text-mute'}`}>{b.status === 'booked' ? (upcoming ? 'Upcoming' : 'Past') : b.status === 'attended' ? 'Attended' : b.status === 'no_show' ? 'Missed' : 'Cancelled'}</span>
                  <Link href={`/visit/${b.code}`} className="text-sm underline underline-offset-4">Details and map</Link>
                </div>
              </li>
            )
          })}
        </ul>
        <section className="mt-12 rounded-2xl border border-line bg-card p-6 text-sm text-mute">
          <p className="font-medium text-ink">Your data</p>
          <p className="mt-1 leading-relaxed">We keep your details only to manage your enquiries and visits. To change or delete them, or to stop messages, write to your sales advisor or the sales head.</p>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
