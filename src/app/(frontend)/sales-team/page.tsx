import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'

export const metadata = { title: 'Sales team | HOMIQ' }

const capabilities = [
  ['A clear lead queue', 'New enquiries, source information and buyer preferences are brought into one focused workspace.'],
  ['Conversation context', 'When a buyer asks for a person or needs a verified answer, the conversation summary is available to the assigned advisor.'],
  ['Visits and follow-up', 'Review visit requests, update outcomes and keep follow-up work visible.'],
  ['Sales-head oversight', 'The sales head can review flagged conversations and maintain the approved project fact sheet and visit slots.'],
]

export default function SalesTeamPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 pb-24 pt-12 md:px-8 md:pt-20">
        <p className="text-xs uppercase tracking-[0.28em] text-moss">HOMIQ · Sales workspace</p>
        <div className="mt-5 grid gap-10 md:grid-cols-[1.15fr_.85fr] md:items-end">
          <div>
            <h1 className="max-w-3xl font-serif text-6xl font-medium leading-[.98] tracking-tight md:text-7xl">A better view of every buyer conversation.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-mute">The HOMIQ sales workspace brings enquiries, buyer preferences, conversations and visit follow-up into one place.</p>
          </div>
          <div className="rounded-[28px] border border-line bg-card p-7">
            <p className="text-xs uppercase tracking-[.2em] text-moss">For the sales team</p>
            <h2 className="mt-3 font-serif text-3xl">Sign in to continue.</h2>
            <p className="mt-3 text-sm leading-relaxed text-mute">Use the work account created for you by the sales head. Public buyer registration cannot create staff permissions.</p>
            <Link href="/login?next=/staff" className="btn-grad mt-6 inline-flex w-full justify-center rounded-full px-6 py-3.5 text-sm font-medium text-white">Sales team sign in <span className="ml-2" aria-hidden>↗</span></Link>
          </div>
        </div>
        <section className="mt-16 grid gap-px overflow-hidden rounded-[28px] border border-line bg-line sm:grid-cols-2">
          {capabilities.map(([title, description], i) => (
            <article key={title} className="bg-card p-7 md:p-9">
              <p className="text-xs text-moss">0{i + 1}</p>
              <h2 className="mt-4 font-serif text-3xl">{title}</h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-mute">{description}</p>
            </article>
          ))}
        </section>
        <p className="mt-8 text-xs leading-relaxed text-mute">This public page describes the workspace. Staff names and contact details are not displayed publicly; access is controlled by role after sign-in.</p>
      </main>
      <SiteFooter />
    </>
  )
}