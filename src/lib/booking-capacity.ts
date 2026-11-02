/**
 * Pure booking capacity helpers shared by slot listing and server-side tests.
 * This is a read-side availability calculation, not an atomic reservation.
 */
export type CapacityBooking = { status?: string | null }

export function countActiveBookings(bookings: CapacityBooking[]): number {
  return bookings.filter((booking) => booking.status === 'booked' || booking.status === 'attended').length
}

export function remainingCapacity(capacity: number, bookings: CapacityBooking[]): number {
  if (!Number.isInteger(capacity) || capacity < 0) return 0
  return Math.max(0, capacity - countActiveBookings(bookings))
}

export function canReserveCapacity(capacity: number, bookings: CapacityBooking[]): boolean {
  return remainingCapacity(capacity, bookings) > 0
}

export function exceedsCapacity(capacity: number, bookings: CapacityBooking[]): boolean {
  return countActiveBookings(bookings) > (Number.isInteger(capacity) && capacity >= 0 ? capacity : 0)
}
