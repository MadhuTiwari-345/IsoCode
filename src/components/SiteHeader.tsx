import Link from 'next/link'
import AuthMenu from './AuthMenu'

const links = [
  ['/projects', 'Residences'],
  ['/#visit', 'The visit'],
  ['/#faq', 'FAQs'],
  ['/sales-team', 'Sales team'],
]

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-5 px-5 md:px-8">
        <Link href="/" aria-label="HOMIQ home" className="group flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-ink text-sm font-semibold tracking-tight text-white">H</span>
          <span className="leading-none">
            <span className="block text-[17px] font-semibold tracking-[0.16em]">HOMIQ</span>
            <span className="mt-1 block text-[9px] uppercase tracking-[0.24em] text-mute">Thoughtful living · Ahmedabad</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-9 text-[13px] font-medium text-mute md:flex" aria-label="Main">
          {links.map(([href, label]) => <Link key={href} href={href} className="transition hover:text-moss">{label}</Link>)}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/chat" className="hidden rounded-full border border-line px-4 py-2.5 text-xs font-medium text-ink transition hover:border-moss hover:bg-moss-soft sm:inline-flex">Ask a question</Link>
          <AuthMenu />
        </div>
      </div>
    </header>
  )
}
