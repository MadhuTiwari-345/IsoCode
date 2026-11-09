'use server'

import { redirect } from 'next/navigation'
import { appAuth, isStaffRole } from '@/lib/app-auth'
import { getPayloadClient } from '@/lib/payload'

export type AuthState = { error?: string; email?: string; name?: string }

const safeNext = (n: unknown, fallback: string) => (typeof n === 'string' && n.startsWith('/') && !n.startsWith('//') ? n : fallback)
const str = (v: FormDataEntryValue | null, max = 200) => String(v ?? '').trim().slice(0, max)

export async function loginAction(_: AuthState, form: FormData): Promise<AuthState> {
  const email = str(form.get('email')).normalize('NFKC').replace(/[\\u200B-\\u200D\\uFEFF]/g, '').toLowerCase()
  const password = String(form.get('password') ?? '')
  if (!/^\S+@\S+\.\S+$/.test(email)) return { error: 'Enter a valid email address.', email }
  if (!password) return { error: 'Enter your password.', email }
  let staff = false
  try {
    const user = await appAuth.login(email, password)
    staff = isStaffRole(user)
  } catch {
    return { error: 'That email and password do not match. Please try again.', email }
  }
  const next = safeNext(form.get('next'), '')
  redirect(next || (staff ? '/staff' : '/account'))
}

export async function signupAction(_: AuthState, form: FormData): Promise<AuthState> {
  const name = str(form.get('name'), 80)
  const email = str(form.get('email')).normalize('NFKC').replace(/[\u200B-\u200D\uFEFF]/g, '').toLowerCase()
  const phone = str(form.get('phone'), 20).replace(/[^\d+ ]/g, '')
  const password = String(form.get('password') ?? '')
  const keep = { name, email }
  if (name.length < 2) return { error: 'Enter your full name.', ...keep }
  if (!/^\S+@\S+\.\S+$/.test(email)) return { error: 'Enter a valid email address.', ...keep }
  if (password.length < 8) return { error: 'Choose a password of at least 8 characters.', ...keep }
  if (form.get('consent') !== 'on') return { error: 'Please accept the privacy notice to create an account.', ...keep }
  const payload = await getPayloadClient()
  try {
    // Public sign-up: role is not accepted from the form, so every new account is a buyer.
    // The role is deliberately fixed server-side. Bypass the role field's staff-only
    // write guard only for this server-controlled buyer value; never accept a role
    // from the public form.
    await payload.create({ collection: 'users', data: { name, email, phone, password, role: 'buyer' }, overrideAccess: true })
  } catch (e) {
    const err = e as { name?: string; message?: string; data?: { errors?: Array<{ field?: string; message?: string }> } }
    const message = String(err.message ?? '')
    const fieldErrors = Array.isArray(err.data?.errors) ? err.data.errors.map((item) => ({ field: item.field, message: item.message })) : []
    // Keep server diagnostics useful without logging the buyer's email or password.
    console.error('[HOMIQ signup] buyer account creation failed', { name: err.name ?? 'Error', message: message.replaceAll(email, '[redacted email]'), fieldErrors })
    if (/unique|already|duplicate|E11000/i.test(message)) return { error: 'An account with this email already exists. Sign in instead.', ...keep }
    const emailError = fieldErrors.find((item) => item.field === 'email')
    if (emailError) return { error: 'That email address was rejected. Check the spelling and try another address if it is already registered.', ...keep }
    if (fieldErrors.length) return { error: fieldErrors[0].message || 'Please check the highlighted details and try again.', ...keep }
    return { error: 'We could not create your account. Please try again in a moment.', ...keep }
  }
  try { await appAuth.login(email, password) } catch { return { error: 'Account created. Please sign in.', ...keep } }
  redirect(safeNext(form.get('next'), '/account'))
}

export async function logoutAction() {
  await appAuth.logout()
  redirect('/')
}
