import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import { getProjects, formatLakh, projectPhoto } from '@/lib/catalog'

export const metadata = { title: 'Residences | HOMIQ' }

const portfolioCards = [
  { id: 'project-01', name: 'Project 01', slug: 'project-01', locality: 'Ahmedabad', tagline: 'A residential development within the HOMIQ collection.', configurations: ['2', '3'] },
  { id: 'project-02', name: 'Project 02', slug: 'project-02', locality: 'Ahmedabad', tagline: 'A second residential development within the HOMIQ collection.', configurations: ['2', '3'] },
]

export default async function ProjectsPage() {
  const published = await getProjects()
  // Until Company A supplies approved project records, show two honest portfolio
  // portfolio overview from the brief rather than inventing project-specific details.
  const projects = published.length ? published : portfolioCards
  const isBriefOnly = published.length === 0

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 pb-20 pt-10 md:px-6 md:pt-14">
        <nav className="text-sm text-mute" aria-label="Breadcrumb"><Link href="/" className="hover:text-ink">Home</Link> <span className="mx-1">/</span> <span className="text-ink">Residences</span></nav>
        <div className="mt-10 grid items-end gap-8 md:grid-cols-[1fr_auto]">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.3em] text-moss">The HOMIQ collection · Ahmedabad</p>
            <h1 className="mt-4 font-serif text-6xl font-medium leading-[0.95] tracking-tight md:text-7xl">A considered place to call home.</h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-mute">Explore two residential developments with 2 and 3 BHK homes. Tell us what matters to you and our concierge will help you find the right next step.</p>
          </div>
          <div className="rounded-2xl border border-line bg-card px-6 py-5 md:min-w-56">
            <p className="text-xs uppercase tracking-wider text-mute">Collection overview</p>
            <p className="mt-2 font-serif text-3xl text-ink">420 homes</p>
            <p className="mt-1 text-xs text-mute">Across two developments</p>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-y border-line py-4 text-sm text-mute">
          <span>2 and 3 BHK residences</span><span className="hidden text-line sm:inline">/</span>
          <span>Ahmedabad</span><span className="hidden text-line sm:inline">/</span>
          <span>₹65 lakh – ₹1.2 crore portfolio range*</span>
        </div>

        {isBriefOnly && <p className="mt-5 max-w-3xl text-xs leading-relaxed text-mute">Project-specific brochures, addresses, RERA registrations and floor plans are not yet available. These cards summarise only the portfolio information supplied; imagery is illustrative.</p>}

        <div className="mt-9 grid gap-7 md:grid-cols-2">
          {projects.map((p, i) => (
            <article key={p.id} className="group overflow-hidden rounded-[28px] border border-line bg-card transition hover:-translate-y-1 hover:shadow-[0_24px_70px_-34px_rgba(27,41,39,.32)]">
              <div className="relative h-72 overflow-hidden md:h-[340px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={projectPhoto(p.slug)} alt="Illustrative residential architecture" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                <span className="absolute left-5 top-5 rounded-full bg-paper/95 px-4 py-2 text-[11px] uppercase tracking-wider text-ink">Ahmedabad · {String(i + 1).padStart(2, '0')}</span>
                <span className="absolute bottom-5 right-5 rounded-full bg-ink/85 px-4 py-2 text-[11px] text-white">Illustrative image</span>
              </div>
              <div className="p-7 md:p-8">
                <p className="text-xs uppercase tracking-[0.2em] text-moss">Residential development</p>
                <h2 className="mt-3 font-serif text-4xl font-medium tracking-tight">{p.name}</h2>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-mute">{p.tagline || 'A residential address in the HOMIQ collection.'}</p>
                <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
                  <div><p className="text-xs text-mute">Indicative portfolio range*</p><p className="font-serif text-2xl text-moss">{formatLakh(65)} – {formatLakh(120)}</p></div>
                  <div className="flex gap-2">{(p.configurations as string[] | undefined)?.map((c) => <span key={c} className="rounded-full bg-moss-soft px-3 py-1.5 text-xs text-moss">{c} BHK</span>)}</div>
                </div>
                <p className="mt-4 text-xs leading-relaxed text-mute">Project-specific pricing, registration and site details are confirmed by a sales advisor.</p>
                <Link href="/chat" className="btn-grad mt-6 inline-flex rounded-full px-6 py-3 text-sm font-medium text-white">Ask about this residence <span aria-hidden="true" className="ml-2">↗</span></Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 grid gap-6 rounded-3xl bg-moss-soft p-7 md:grid-cols-[1fr_auto] md:items-center md:p-10">
          <div><p className="text-xs uppercase tracking-[0.2em] text-moss">A more personal conversation</p><h2 className="mt-3 font-serif text-3xl md:text-4xl">The right home starts with the right questions.</h2><p className="mt-3 max-w-2xl text-sm leading-relaxed text-mute">Tell us your preferred configuration, budget and timing. HOMIQ can help in English, Hindi or Gujarati, and connect you with a sales advisor whenever you wish.</p></div>
          <Link href="/chat" className="btn-grad inline-flex justify-center rounded-full px-7 py-3.5 text-sm font-medium text-white">Talk to HOMIQ</Link>
        </div>
        <p className="mt-5 text-[11px] leading-relaxed text-mute">*The ₹65 lakh–₹1.2 crore range is the overall portfolio range stated in the brief, not a confirmed price for either individual development. Final pricing and all statutory project information must be confirmed by Company A.</p>
      </main>
      <SiteFooter />
    </>
  )
}
