import { appAuth, isStaffRole } from './app-auth'

/** Signed-in sales executive or sales head. Returns null for everyone else. */
export async function getStaff() {
  const user = await appAuth.currentUser()
  return user && isStaffRole(user) ? user : null
}

export const IST = 'Asia/Kolkata'
export const fmtDateTime = (iso: string | Date) =>
  new Intl.DateTimeFormat('en-IN', { timeZone: IST, weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }).format(new Date(iso))
export const fmtDate = (iso: string | Date) =>
  new Intl.DateTimeFormat('en-IN', { timeZone: IST, day: 'numeric', month: 'short' }).format(new Date(iso))
export const fmtDay = (iso: string | Date) =>
  new Intl.DateTimeFormat('en-IN', { timeZone: IST, weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(iso))
export const fmtTime = (iso: string | Date) =>
  new Intl.DateTimeFormat('en-IN', { timeZone: IST, hour: 'numeric', minute: '2-digit' }).format(new Date(iso))

export const SOURCE_LABEL: Record<string, string> = {
  portal_99acres: '99acres', portal_magicbricks: 'MagicBricks', social_ads: 'Social ads', website: 'Website', hoarding: 'Hoarding',
}
export const STAGE_LABEL: Record<string, string> = {
  new: 'New', engaged: 'Engaged', qualified: 'Qualified', visit_booked: 'Visit booked', visited: 'Visited', lost: 'Lost',
}
