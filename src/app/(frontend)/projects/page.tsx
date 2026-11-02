import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import { getProjects, formatLakh, projectPhoto } from '@/lib/catalog'

export const metadata = { title: 'Projects | Company A' }

export default async function ProjectsPage() {
  const projects = await getProjects()
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 pt-10">
        <nav className="text-sm text-mute" aria-label="Breadcrumb"><Link href="/" className="hover:text-ink">Home</Link> <span className="mx-1">/</span> <span className="text-ink">Projects</span></nav>
        <h1 className="mt-6 font-serif text-6xl font-medium leading-none tracking-tight">Our projects</h1>
        <p className="mt-4 max-w-xl text-mute">Two live developments in Ahmedabad with 2 and 3 BHK apartments. Open a project for facts, location and to book a visit.</p>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {projects.map((p) => (
            <Link key={p.id} href={`/projects/${p.slug}`} className="group overflow-hidden rounded-[28px] border border-line bg-card transition hover:shadow-[0_20px_50px_-30px_rgba(22,33,58,0.5)]">
              <div className="h-72 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={projectPhoto(p.slug)} alt={`${p.name}, ${p.locality}`} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <div className="p-7">
                <p className="text-xs uppercase tracking-[0.2em] text-moss">{p.locality}</p>
                <h2 className="mt-2 font-serif text-4xl font-semibold tracking-tight">{p.name}</h2>
                <p className="mt-1 text-mute">{p.tagline}</p>
                <div className="mt-6 flex items-end justify-between border-t border-line pt-5">
                  <div><p className="text-xs text-mute">Starting from</p><p className="font-serif text-3xl font-semibold text-moss">{formatLakh(p.priceFromLakh)}</p></div>
                  <span className="text-sm text-ink underline underline-offset-4">View project →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
