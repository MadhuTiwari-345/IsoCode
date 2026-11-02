import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getStaff } from '@/lib/staff'
import StaffNav from '@/components/StaffNav'

export default async function StaffLayout({ children }: { children: React.ReactNode }) {
  const user = await getStaff()
  if (!user) redirect('/login?next=/staff')
  return (
    <div className="min-h-dvh bg-paper lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="border-b border-line bg-white p-5 lg:sticky lg:top-0 lg:h-dvh lg:border-b-0 lg:border-r lg:p-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-ink text-sm font-semibold text-white">H</span>
          <span><span className="block text-[16px] font-semibold tracking-[0.16em]">HOMIQ</span><span className="mt-1 block text-[9px] uppercase tracking-[0.2em] text-mute">Sales workspace</span></span>
        </Link>
        <div className="mt-8 rounded-2xl border border-line bg-paper p-4">
          <p className="text-[10px] uppercase tracking-[0.18em] text-mute">Signed in as</p>
          <p className="mt-2 text-sm font-semibold">{user.name}</p>
          <p className="mt-1 text-xs text-mute">{user.role === 'head' ? 'Sales head' : 'Sales executive'}</p>
        </div>
        <StaffNav />
        <p className="mt-10 hidden text-[10px] leading-relaxed text-mute lg:block">HOMIQ · Lead response workspace<br />Ahmedabad, Gujarat</p>
      </aside>
      <main className="mx-auto w-full max-w-[1500px] px-4 py-7 sm:px-6 lg:px-10 lg:py-10">{children}</main>
    </div>
  )
}
