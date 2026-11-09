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


/**
 * Pick a deterministic seat key for a slot. The unique database index on
 * Bookings.claimKey is the concurrency primitive: concurrent requests may
 * calculate the same key, but MongoDB can commit only one of them.
 * Legacy active bookings without keys are conservatively assigned the first
 * unclaimed seat numbers before new reservations are considered.
 */
export function nextSeatClaimKey(
  slotId: string,
  capacity: number,
  bookings: Array<CapacityBooking & { claimKey?: string | null }>,
): string | null {
  if (!Number.isInteger(capacity) || capacity < 1) return null
  const active = bookings.filter((booking) => booking.status === 'booked' || booking.status === 'attended')
  if (active.length >= capacity) return null

  const prefix = `${slotId}:`
  const occupied = new Set<number>()
  let legacy = 0
  for (const booking of active) {
    const key = booking.claimKey
    if (typeof key === 'string' && key.startsWith(prefix)) {
      const seat = Number(key.slice(prefix.length))
      if (Number.isInteger(seat) && seat >= 0 && seat < capacity) occupied.add(seat)
      else legacy += 1
    } else {
      legacy += 1
    }
  }
  for (let seat = 0; seat < capacity && legacy > 0; seat += 1) {
    if (!occupied.has(seat)) {
      occupied.add(seat)
      legacy -= 1
    }
  }
  for (let seat = 0; seat < capacity; seat += 1) {
    if (!occupied.has(seat)) return `${prefix}${seat}`
  }
  return null
}
