import Link from 'next/link'
import { redirect } from 'next/navigation'
import AuthForm from '@/components/AuthForm'
import SiteHeader from '@/components/SiteHeader'
import { appAuth, isStaffRole } from '@/lib/app-auth'

export const metadata = { title: 'Sign in | Company A' }

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams
  const user = await appAuth.currentUser()
  if (user) redirect(isStaffRole(user) ? '/staff' : '/account')
  const staffNext = next?.startsWith('/staff')
  return (
    <>
      <SiteHeader />
      <main className="mx-auto grid min-h-[calc(100dvh-4rem)] max-w-6xl items-center gap-12 px-6 py-12 lg:grid-cols-2">
        <section className="mx-auto w-full max-w-md">
          <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-mute hover:text-ink"><span aria-hidden>←</span>Back to website</Link>
          <h1 className="font-serif text-5xl font-medium leading-none tracking-tight">{staffNext ? 'Sales team sign in' : 'Welcome back'}</h1>
          <p className="mt-4 text-mute">{staffNext ? 'Sign in with your work email to open the sales console.' : 'Sign in to see your site visits and continue your conversation.'}</p>
          <div className="mt-8"><AuthForm mode="login" next={next} /></div>
          <p className="mt-6 text-sm text-mute">New here? <Link href={next ? `/signup?next=${encodeURIComponent(next)}` : '/signup'} className="text-ink underline underline-offset-4">Create an account</Link></p>
          <p className="mt-2 text-xs text-mute">Sales staff accounts are created by the sales head.</p>
        </section>
        <aside className="hidden overflow-hidden rounded-[32px] lg:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://images.unsplash.com/photo-1724582586529-62622e50c0b3?auto=format&fit=crop&q=80&w=1400" alt="Bright living room with a large window" className="h-[620px] w-full object-cover" />
        </aside>
      </main>
    </>
  )
}
