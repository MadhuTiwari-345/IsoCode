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
  const hasMap = Number.isFinite(p.latitude) && Number.isFinite(p.longitude) && (p.latitude !== 0 || p.longitude !== 0)
  const maps = hasMap ? `https://www.google.com/maps/search/?api=1&query=${p.latitude},${p.longitude}` : null
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 pb-20 pt-10 md:px-6">
        <nav className="text-sm text-mute" aria-label="Breadcrumb"><Link href="/" className="hover:text-ink">Home</Link> <span className="mx-1">/</span> <Link href="/projects" className="hover:text-ink">Residences</Link> <span className="mx-1">/</span> <span className="text-ink">{p.name}</span></nav>
        <div className="mt-8 grid items-end gap-6 md:grid-cols-[1fr_auto]">
          <div><p className="text-xs uppercase tracking-[0.25em] text-moss">Ahmedabad · Residential collection</p><h1 className="mt-3 font-serif text-6xl font-medium leading-none tracking-tight md:text-7xl">{p.name}</h1><p className="mt-4 max-w-xl text-mute">{p.tagline}</p></div>
          <div className="md:text-right"><p className="text-xs text-mute">Portfolio range · indicative</p><p className="font-serif text-3xl text-moss">{formatLakh(65)} – {formatLakh(120)}</p><p className="text-xs text-mute">Not a project-specific quotation</p></div>
        </div>
        <div className="relative mt-8 h-[300px] overflow-hidden rounded-[28px] md:h-[460px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={projectPhoto(p.slug)} alt="Illustrative residential architecture, not a project photograph" className="h-full w-full object-cover" />
          <span className="absolute bottom-5 right-5 rounded-full bg-ink/85 px-4 py-2 text-xs text-white">Illustrative image</span>
        </div>
        <div className="mt-12 grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          <section>
            <h2 className="font-serif text-3xl font-semibold">What we can confirm</h2>
            <div className="mt-5 divide-y divide-line border-y border-line">
              <div className="grid gap-1 py-4 sm:grid-cols-[180px_1fr]"><p className="text-sm text-mute">Home configurations</p><p>2 BHK and 3 BHK apartments</p></div>
              <div className="grid gap-1 py-4 sm:grid-cols-[180px_1fr]"><p className="text-sm text-mute">Total portfolio</p><p>420 apartments across two developments</p></div>
              <div className="grid gap-1 py-4 sm:grid-cols-[180px_1fr]"><p className="text-sm text-mute">Indicative price range</p><p>₹65 lakh – ₹1.2 crore across the portfolio; ask an advisor for project-specific pricing</p></div>
              {facts.map((f) => <div key={f.id} className="grid gap-1 py-4 sm:grid-cols-[180px_1fr]"><dt className="text-sm text-mute">{TOPICS[f.topic] ?? f.topic}</dt><dd className="text-[15px] leading-relaxed">{f.answerEn}</dd></div>)}
            </div>
            <p className="mt-4 text-xs leading-relaxed text-mute">Project-specific address, RERA registration, floor plans, availability and possession details must be confirmed against the current official fact sheet before you rely on them.</p>
          </section>
          <aside className="h-fit rounded-[24px] border border-line bg-card p-7 lg:sticky lg:top-24">
            <p className="text-xs uppercase tracking-[0.2em] text-moss">Your next step</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold">Come see it for yourself.</h2>
            <p className="mt-3 text-sm leading-relaxed text-mute">Ask questions in English, Hindi or Gujarati, then choose an available visit time. A named advisor can take over at any point.</p>
            <Link href="/chat" className="btn-grad mt-6 block rounded-full px-6 py-3.5 text-center text-sm font-medium text-white">Chat and book a visit</Link>
            {maps && <a href={maps} target="_blank" rel="noreferrer" className="mt-3 block rounded-full border border-line px-6 py-3.5 text-center text-sm transition hover:border-ink">Open location in Maps</a>}
          </aside>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
