import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import { getProjects, formatLakh, projectPhoto } from '@/lib/catalog'

export const metadata = { title: 'Residences | HOMIQ' }

export default async function ProjectsPage() {
  const projects = await getProjects()
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 pb-20 pt-10 md:px-6 md:pt-14">
        <nav className="text-sm text-mute" aria-label="Breadcrumb"><Link href="/" className="hover:text-ink">Home</Link> <span className="mx-1">/</span> <span className="text-ink">Residences</span></nav>
        <div className="mt-10 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.3em] text-moss">The HOMIQ collection · Ahmedabad</p>
          <h1 className="mt-4 font-serif text-6xl font-medium leading-[0.95] tracking-tight md:text-7xl">Find a place that feels like yours.</h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-mute">Two residential developments. Thoughtful 2 and 3 BHK homes. This prototype uses only the interview brief; speak with an advisor for project-specific details that have not been supplied.</p>
          <p className="mt-4 font-serif text-2xl text-ink">₹65 lakh – ₹1.2 crore <span className="font-sans text-xs text-mute">indicative portfolio range, not a project quote</span></p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {projects.map((p, i) => (
            <Link key={p.id} href={`/projects/${p.slug}`} className="group overflow-hidden rounded-[28px] border border-line bg-card transition hover:-translate-y-1 hover:shadow-[0_24px_70px_-34px_rgba(27,41,39,.32)]">
              <div className="relative h-72 overflow-hidden md:h-80">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={projectPhoto(p.slug)} alt="Illustrative residential architecture" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                <span className="absolute left-5 top-5 rounded-full bg-paper/95 px-4 py-2 text-[11px] uppercase tracking-wider text-ink">Ahmedabad · {String(i + 1).padStart(2, '0')}</span>
                <span className="absolute bottom-5 right-5 rounded-full bg-ink/85 px-4 py-2 text-[11px] text-white">Illustrative image</span>
              </div>
              <div className="p-7 md:p-8">
                <p className="text-xs uppercase tracking-[0.2em] text-moss">Residential development</p>
                <h2 className="mt-3 font-serif text-4xl font-medium tracking-tight">{p.name}</h2>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-mute">{p.tagline}</p>
                <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
                  <div><p className="text-xs text-mute">Portfolio price range</p><p className="font-serif text-2xl text-moss">{formatLakh(65)} – {formatLakh(120)}</p></div>
                  <span className="text-sm underline underline-offset-4">Explore overview ↗</span>
                </div>
                <p className="mt-4 text-xs text-mute">2 and 3 BHK · Project-specific price, RERA and address confirmed by the sales team.</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-12 rounded-3xl bg-moss-soft p-7 md:p-9">
          <p className="font-serif text-3xl">A question before you visit?</p>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-mute">Our concierge can help in English, Hindi or Gujarati and connect you to a named advisor whenever you need one.</p>
          <Link href="/chat" className="btn-grad mt-6 inline-flex rounded-full px-7 py-3.5 text-sm font-medium text-white">Talk to HOMIQ</Link>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
