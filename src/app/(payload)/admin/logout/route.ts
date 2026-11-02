import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'

// Return the Payload admin logout flow to the public HOMIQ site.
export function GET(request: NextRequest) {
  const host = request.headers.get('host')
  const viewerOrigin = host ? `${request.nextUrl.protocol}//${host}` : 'http://localhost:3000'
  const origin = process.env.NEXT_PUBLIC_SITE_URL || viewerOrigin
  const logoutRedirect = new URL('/', origin).toString()

  redirect(`/api/admins/sso/logout?redirect=${encodeURIComponent(logoutRedirect)}`)
}
