import Link from 'next/link'
import { notFound } from 'next/navigation'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import { getProjects, getProjectBySlug, getFacts, formatLakh, projectPhoto } from '@/lib/catalog'

export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ slug: p.slug }))
}

const TOPICS: Record<string, string> = { price: 'Price', configs: 'Homes and sizes', possession: 'Possession', amenities: 'Amenities', location: 'Location', rera: 'RERA and approvals', payment: 'Payment and loans', parking: 'Parking' }

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = await getProjectBySlug(slug)
  if (!p) notFound()
  const facts = await getFacts(p.id)
  const maps = `https://www.google.com/maps/search/?api=1&query=${p.latitude},${p.longitude}`
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 pt-10">
        <nav className="text-sm text-mute" aria-label="Breadcrumb"><Link href="/" className="hover:text-ink">Home</Link> <span className="mx-1">/</span> <Link href="/projects" className="hover:text-ink">Projects</Link> <span className="mx-1">/</span> <span className="text-ink">{p.name}</span></nav>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
          <div><p className="text-xs uppercase tracking-[0.25em] text-moss">{p.locality}, Ahmedabad</p><h1 className="mt-2 font-serif text-6xl font-medium leading-none tracking-tight">{p.name}</h1><p className="mt-3 text-mute">{p.tagline}</p></div>
          <div className="text-right"><p className="text-xs text-mute">Starting from</p><p className="font-serif text-4xl font-semibold text-moss">{formatLakh(p.priceFromLakh)}</p><p className="text-xs text-mute">up to {formatLakh(p.priceToLakh)}, indicative</p></div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={projectPhoto(p.slug)} alt={`${p.name}`} className="mt-8 h-[420px] w-full rounded-[28px] object-cover" />

        <div className="mt-12 grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          <section>
            <h2 className="font-serif text-3xl font-semibold">Project facts</h2>
            <dl className="mt-5 divide-y divide-line border-y border-line">
              {facts.length === 0 && <p className="py-6 text-sm text-mute">Facts will appear here shortly.</p>}
              {facts.map((f) => (
                <div key={f.id} className="grid gap-1 py-4 sm:grid-cols-[180px_1fr]"><dt className="text-sm text-mute">{TOPICS[f.topic] ?? f.topic}</dt><dd className="text-[15px] leading-relaxed">{f.answerEn}</dd></div>
              ))}
            </dl>
            <p className="mt-4 text-xs text-mute">RERA registration: {p.reraNumber}. Prices are indicative; the final price is confirmed in writing by a sales advisor.</p>
          </section>
          <aside className="h-fit rounded-[24px] border border-line bg-card p-7 lg:sticky lg:top-24">
            <h2 className="font-serif text-3xl font-semibold">See it in person</h2>
            <p className="mt-2 text-sm leading-relaxed text-mute">Ask questions in English, हिन्दी or ગુજરાતી, then pick a free visit time.</p>
            <Link href="/chat" className="btn-grad mt-6 block rounded-full px-6 py-3.5 text-center text-sm font-medium text-white">Chat and book a visit</Link>
            <a href={maps} target="_blank" rel="noreferrer" className="mt-3 block rounded-full border border-line px-6 py-3.5 text-center text-sm transition hover:border-ink">Open location in Maps</a>
            <p className="mt-5 text-xs leading-relaxed text-mute">{p.address}</p>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
