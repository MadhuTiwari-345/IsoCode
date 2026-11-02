import Link from 'next/link'
import { redirect } from 'next/navigation'
import AuthForm from '@/components/AuthForm'
import SiteHeader from '@/components/SiteHeader'
import { appAuth } from '@/lib/app-auth'

export const metadata = { title: 'Create account | Company A' }

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams
  if (await appAuth.currentUser()) redirect('/account')
  return (
    <>
      <SiteHeader />
      <main className="mx-auto grid min-h-[calc(100dvh-4rem)] max-w-6xl items-center gap-12 px-6 py-12 lg:grid-cols-2">
        <section className="mx-auto w-full max-w-md">
          <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-mute hover:text-ink"><span aria-hidden>←</span>Back to website</Link>
          <h1 className="font-serif text-5xl font-medium leading-none tracking-tight">Create your account</h1>
          <p className="mt-4 text-mute">Keep your visits and conversation in one place. It takes under a minute.</p>
          <div className="mt-8"><AuthForm mode="signup" next={next} /></div>
          <p className="mt-6 text-sm text-mute">Already registered? <Link href="/login" className="text-ink underline underline-offset-4">Sign in</Link></p>
        </section>
        <aside className="hidden overflow-hidden rounded-[32px] lg:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://images.unsplash.com/photo-1624204386084-dd8c05e32226?auto=format&fit=crop&q=80&w=1400" alt="Apartment building at dusk" className="h-[620px] w-full object-cover" />
        </aside>
      </main>
    </>
  )
}
