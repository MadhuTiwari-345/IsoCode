'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logoutAction } from '@/app/(frontend)/auth/actions'

const nav = [
  ['/staff', 'Overview'],
  ['/staff/leads', 'Lead inbox'],
  ['/staff/visits', 'Site visits'],
  ['/staff/fact-sheet', 'Fact sheet & slots'],
]

export default function StaffNav() {
  const path = usePathname()
  const active = (href: string) => (href === '/staff' ? path === '/staff' : path.startsWith(href))
  const cls = (on: boolean) => `flex items-center gap-3 rounded-xl px-4 py-3 text-[13px] font-medium transition ${on ? 'bg-ink text-white shadow-sm' : 'text-mute hover:bg-moss-soft hover:text-ink'}`
  return (
    <nav className="mt-7 flex gap-2 overflow-x-auto lg:flex-col" aria-label="Sales console">
      {nav.map(([href, label], index) => <Link key={href} href={href} aria-current={active(href) ? 'page' : undefined} className={cls(active(href))}>
        <span className={`grid h-6 w-6 place-items-center rounded-lg text-[10px] ${active(href) ? 'bg-white/15 text-white' : 'bg-subtle text-mute'}`}>{String(index + 1).padStart(2, '0')}</span>
        {label}
      </Link>)}
      <div className="my-2 hidden border-t border-line lg:block" />
      <Link href="/" className="whitespace-nowrap rounded-xl px-4 py-3 text-[13px] text-mute transition hover:bg-moss-soft hover:text-ink">← View website</Link>
      <form action={logoutAction}><button className="w-full whitespace-nowrap rounded-xl px-4 py-3 text-left text-[13px] text-mute transition hover:bg-moss-soft hover:text-ink">Sign out</button></form>
    </nav>
  )
}
