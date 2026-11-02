import Link from 'next/link'
import AuthMenu from './AuthMenu'

const links = [
  ['/projects', 'Projects'],
  ['/#visit', 'Visit'],
  ['/#faq', 'Questions'],
]

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-6">
        <Link href="/" className="font-serif text-3xl font-semibold tracking-tight">Company A</Link>
        <nav className="hidden items-center gap-8 text-sm text-mute md:flex" aria-label="Main">
          {links.map(([h, l]) => <Link key={h} href={h} className="transition hover:text-ink">{l}</Link>)}
        </nav>
        <AuthMenu />
      </div>
    </header>
  )
}
