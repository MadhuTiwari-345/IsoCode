import { appAuth, isStaffRole } from './app-auth'

/** Signed-in sales executive or sales head. Returns null for everyone else. */
export async function getStaff() {
  const user = await appAuth.currentUser()
  return user && isStaffRole(user) ? user : null
}

export const IST = 'Asia/Kolkata'
const safeDate = (value: string | Date) => { const d = new Date(value); return Number.isNaN(d.getTime()) ? null : d }
const formatDate = (value: string | Date, options: Intl.DateTimeFormatOptions) => { const d = safeDate(value); return d ? new Intl.DateTimeFormat('en-IN', { timeZone: IST, ...options }).format(d) : 'Date to be confirmed' }
export const fmtDateTime = (iso: string | Date) => formatDate(iso, { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })
export const fmtDate = (iso: string | Date) => formatDate(iso, { day: 'numeric', month: 'short' })
export const fmtDay = (iso: string | Date) => formatDate(iso, { weekday: 'long', day: 'numeric', month: 'long' })
export const fmtTime = (iso: string | Date) => formatDate(iso, { hour: 'numeric', minute: '2-digit' })

export const SOURCE_LABEL: Record<string, string> = {
  property_portal: 'Property portal', portal_99acres: '99acres', portal_magicbricks: 'MagicBricks', social_ads: 'Social ads', website: 'Website', hoarding: 'Hoarding',
}
export const STAGE_LABEL: Record<string, string> = {
  new: 'New', engaged: 'Engaged', qualified: 'Qualified', visit_booked: 'Visit booked', visited: 'Visited', lost: 'Lost',
}
