'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logoutAction } from '@/app/(frontend)/auth/actions'

const nav = [
  ['/staff', 'Dashboard'],
  ['/staff/leads', 'Leads'],
  ['/staff/visits', 'Site visits'],
  ['/staff/fact-sheet', 'Fact sheet and slots'],
]

export default function StaffNav() {
  const path = usePathname()
  const active = (href: string) => (href === '/staff' ? path === '/staff' : path.startsWith(href))
  const cls = (on: boolean) => `whitespace-nowrap rounded-xl px-4 py-2.5 transition ${on ? 'bg-ink text-white' : 'text-mute hover:bg-moss-soft hover:text-ink'}`
  return (
    <nav className="mt-6 flex gap-2 overflow-x-auto text-sm lg:flex-col" aria-label="Sales console">
      {nav.map(([href, label]) => <Link key={href} href={href} aria-current={active(href) ? 'page' : undefined} className={cls(active(href))}>{label}</Link>)}
      <Link href="/" className="whitespace-nowrap rounded-xl px-4 py-2.5 text-mute transition hover:bg-moss-soft hover:text-ink">← Back to website</Link>
      <form action={logoutAction}><button className="w-full whitespace-nowrap rounded-xl px-4 py-2.5 text-left text-mute transition hover:bg-moss-soft hover:text-ink">Sign out</button></form>
    </nav>
  )
}
