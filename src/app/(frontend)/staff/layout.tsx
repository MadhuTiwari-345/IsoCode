import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getStaff } from '@/lib/staff'

import StaffNav from '@/components/StaffNav'

export default async function StaffLayout({ children }: { children: React.ReactNode }) {
  const user = await getStaff()
  if (!user) redirect('/login?next=/staff')
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="border-b border-line bg-card/60 p-5 backdrop-blur lg:sticky lg:top-0 lg:h-dvh lg:border-b-0 lg:border-r">
        <Link href="/" className="font-serif text-2xl font-semibold tracking-tight">Company A</Link>
        <p className="mt-1 text-xs text-mute">Sales console</p>
        <p className="mt-4 rounded-xl bg-moss-soft px-3 py-2 text-xs"><span className="block font-medium">{user.name}</span><span className="text-mute">{user.role === 'head' ? 'Sales head' : 'Sales executive'}</span></p>
        <StaffNav />
      </aside>
      <main className="mx-auto w-full max-w-6xl px-6 py-10">{children}</main>
    </div>
  )
}
