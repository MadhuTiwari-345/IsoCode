import { cookies } from 'next/headers'
import { JWTAuthentication } from 'payload'
import type { User } from '@/payload-types'
import { getPayloadClient } from './payload'

const COOKIE = 'app-session'
const MAX_AGE = 60 * 60 * 24 * 7
// The preview runs in a cross-site iframe, which needs SameSite=None; Secure.
const secure = [process.env.FIGMA_PUBLIC_URL, process.env.NEXT_PUBLIC_SITE_URL].some((u) => u?.startsWith('https'))

/**
 * Website login for the given auth collection. It uses its own `app-session` cookie, so it is
 * independent of the CMS (Payload Admin) session.
 */
export function createAppAuth(collection: 'users') {
  return {
    async currentUser(): Promise<User | null> {
      const token = (await cookies()).get(COOKIE)?.value
      if (!token) return null
      const payload = await getPayloadClient()
      try {
        // Only the app token is passed, so an admin cookie can never be mistaken for an app user.
        // Payload's own JWT strategy, called directly so it works no matter which strategies the
        // CMS (admin) collection registers on the running instance.
        const { user } = await JWTAuthentication({ headers: new Headers({ Cookie: `payload-token=${token}` }), payload })
        if (!user || user.collection !== collection) return null
        return user as unknown as User
      } catch {
        return null
      }
    },
    async login(email: string, password: string): Promise<User> {
      const payload = await getPayloadClient()
      const res = await payload.login({ collection, data: { email, password } })
      if (!res.token) throw new Error('Login failed')
      ;(await cookies()).set(COOKIE, res.token, { httpOnly: true, sameSite: secure ? 'none' : 'lax', secure, path: '/', maxAge: MAX_AGE })
      return res.user as unknown as User
    },
    async logout() {
      ;(await cookies()).delete({ name: COOKIE, path: '/' })
    },
  }
}

export const appAuth = createAppAuth('users')
export const isStaffRole = (u: { role?: string | null } | null | undefined) => u?.role === 'executive' || u?.role === 'head'
