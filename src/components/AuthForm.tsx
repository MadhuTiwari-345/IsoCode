'use client'

import { useActionState, useState } from 'react'
import { loginAction, signupAction, type AuthState } from '@/app/(frontend)/auth/actions'

const field = 'w-full rounded-xl border border-line bg-card px-4 py-3 text-[15px] outline-none transition placeholder:text-mute/70 focus:border-ink'
const label = 'mb-1.5 block text-sm font-medium'

export default function AuthForm({ mode, next }: { mode: 'login' | 'signup'; next?: string }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(mode === 'login' ? loginAction : signupAction, {})
  const [show, setShow] = useState(false)
  return (
    <form action={action} className="space-y-5" noValidate>
      {next && <input type="hidden" name="next" value={next} />}
      {mode === 'signup' && (
        <div><label className={label} htmlFor="name">Full name</label><input id="name" name="name" autoComplete="name" defaultValue={state.name} className={field} placeholder="As you would like us to address you" /></div>
      )}
      <div><label className={label} htmlFor="email">Email</label><input id="email" name="email" type="email" autoComplete="email" defaultValue={state.email} className={field} placeholder="you@example.com" /></div>
      {mode === 'signup' && (
        <div><label className={label} htmlFor="phone">Mobile number <span className="font-normal text-mute">(optional)</span></label><input id="phone" name="phone" inputMode="tel" autoComplete="tel" className={field} placeholder="98250 12345" /></div>
      )}
      <div>
        <label className={label} htmlFor="password">Password</label>
        <div className="relative">
          <input id="password" name="password" type={show ? 'text' : 'password'} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} className={`${field} pr-16`} placeholder={mode === 'signup' ? 'At least 8 characters' : 'Your password'} />
          <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-mute hover:text-ink" aria-pressed={show}>{show ? 'Hide' : 'Show'}</button>
        </div>
      </div>
      {mode === 'signup' && (
        <label className="flex gap-3 text-[13px] leading-snug text-mute"><input type="checkbox" name="consent" className="mt-0.5 accent-[#b9522f]" />I agree that Company A may store my details to manage my enquiries and visits, as described in the privacy notice (DPDP Act 2023). I can withdraw at any time.</label>
      )}
      {state.error && <p role="alert" className="rounded-lg border border-[#ecc8c0] bg-[#fbeeea] px-4 py-3 text-sm text-clay">{state.error}</p>}
      <button disabled={pending} className="btn-grad w-full rounded-xl px-6 py-3.5 text-sm font-medium text-white disabled:opacity-60">{pending ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}</button>
    </form>
  )
}
