import test from 'node:test'
import assert from 'node:assert/strict'
import { countActiveBookings, remainingCapacity, canReserveCapacity } from '../src/lib/booking-capacity.ts'

test('only booked and attended visits consume capacity', () => {
  assert.equal(countActiveBookings([
    { status: 'booked' },
    { status: 'attended' },
    { status: 'cancelled' },
    { status: 'no_show' },
  ]), 2)
})

test('remaining capacity never becomes negative', () => {
  assert.equal(remainingCapacity(3, [{ status: 'booked' }, { status: 'booked' }]), 1)
  assert.equal(remainingCapacity(1, [{ status: 'booked' }, { status: 'attended' }]), 0)
})

test('invalid capacities are unavailable', () => {
  assert.equal(remainingCapacity(-1, []), 0)
  assert.equal(remainingCapacity(1.5, []), 0)
  assert.equal(canReserveCapacity(0, []), false)
})

test('cancelled and no-show visits release a slot', () => {
  assert.equal(remainingCapacity(1, [{ status: 'cancelled' }, { status: 'no_show' }]), 1)
})


test('seat claims choose a free seat and ignore released bookings', async () => {
  const { nextSeatClaimKey } = await import('../src/lib/booking-capacity.ts')
  assert.equal(nextSeatClaimKey('slot-a', 2, []), 'slot-a:0')
  assert.equal(nextSeatClaimKey('slot-a', 2, [{ status: 'booked', claimKey: 'slot-a:0' }]), 'slot-a:1')
  assert.equal(nextSeatClaimKey('slot-a', 2, [
    { status: 'booked', claimKey: 'slot-a:0' },
    { status: 'cancelled', claimKey: 'slot-a:1' },
  ]), 'slot-a:1')
})

test('seat claims account for legacy active bookings without claim keys', async () => {
  const { nextSeatClaimKey } = await import('../src/lib/booking-capacity.ts')
  assert.equal(nextSeatClaimKey('slot-b', 2, [{ status: 'booked' }]), 'slot-b:1')
  assert.equal(nextSeatClaimKey('slot-b', 1, [{ status: 'attended' }]), null)
})

test('seat claims refuse full or invalid capacity', async () => {
  const { nextSeatClaimKey } = await import('../src/lib/booking-capacity.ts')
  assert.equal(nextSeatClaimKey('slot-c', 1, [{ status: 'booked', claimKey: 'slot-c:0' }]), null)
  assert.equal(nextSeatClaimKey('slot-c', 0, []), null)
})
