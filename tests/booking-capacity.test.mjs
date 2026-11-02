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
