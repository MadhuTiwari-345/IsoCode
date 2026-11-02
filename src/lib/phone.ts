/** Last 10 digits of an Indian mobile number. */
export function normalizePhone(p: string): string {
  return String(p).replace(/\D/g, '').slice(-10)
}
