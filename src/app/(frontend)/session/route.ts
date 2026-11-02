import { appAuth, isStaffRole } from '@/lib/app-auth'

/** Who is signed in? Lets static pages show the right header without becoming dynamic. */
export async function GET() {
  const user = await appAuth.currentUser()
  const body = user ? { user: { name: user.name, phone: user.phone ?? '', staff: isStaffRole(user) } } : { user: null }
  return Response.json(body, { headers: { 'Cache-Control': 'no-store' } })
}
