'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { logoutAction } from '@/app/(frontend)/auth/actions'

type Me = { name: string; phone: string; staff: boolean } | null

export function useSession() {
  const [me, setMe] = useState<Me | undefined>(undefined)
  useEffect(() => {
    let live = true
    fetch('/session', { cache: 'no-store' }).then((r) => r.json()).then((d) => live && setMe(d.user)).catch(() => live && setMe(null))
    return () => { live = false }
  }, [])
  return me
}

export default function AuthMenu() {
  const me = useSession()
  return (
    <div className="flex items-center gap-2 text-sm">
      {me === undefined ? (
        <span className="h-9 w-24" aria-hidden />
      ) : me ? (
        <>
          <Link href={me.staff ? '/staff' : '/account'} className="hidden rounded-full px-4 py-2 transition hover:bg-moss-soft sm:block">{me.staff ? 'Sales console' : 'My account'}</Link>
          <form action={logoutAction}><button className="rounded-full border border-line px-4 py-2 text-mute transition hover:border-ink hover:text-ink">Sign out</button></form>
        </>
      ) : (
        <>
          <Link href="/login" className="rounded-full px-4 py-2 transition hover:bg-moss-soft">Sign in</Link>
          <Link href="/signup" className="hidden rounded-full border border-line px-4 py-2 transition hover:border-ink sm:block">Create account</Link>
        </>
      )}
      <Link href="/chat" className="btn-grad rounded-full px-5 py-2 font-medium text-white">Chat now</Link>
    </div>
  )
}
