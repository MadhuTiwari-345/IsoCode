import type { CollectionConfig } from 'payload'
import { isStaff } from './access'
import { nextSeatClaimKey } from '../lib/booking-capacity'

const HOUR = 3600_000

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  admin: { useAsTitle: 'code', group: 'Sales', defaultColumns: ['code', 'lead', 'slot', 'status'] },
  access: {
    read: ({ req }) => (req.user?.collection === 'admins' ? true : req.user?.collection === 'users' ? { 'lead.user': { equals: req.user.id } } : false),
    create: isStaff, update: isStaff, delete: isStaff,
  },
  hooks: {
    beforeValidate: [
      async ({ data, operation, req }) => {
        if (!data || operation !== 'create') return data
        const slot = await req.payload.findByID({ collection: 'visit-slots', id: data.slot, depth: 0, req, overrideAccess: true })
        if (!slot.isOpen) throw new Error('This slot is closed.')
        const start = new Date(slot.startsAt).getTime()
        if (start < Date.now()) throw new Error('This slot is in the past.')
        data.project = typeof slot.project === 'object' ? (slot.project as any).id : slot.project
        data.code = data.code || `SV-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
        data.status = 'booked'

        // This read chooses a candidate seat. The unique claimKey index below
        // is what makes the reservation race-safe, not this read itself.
        const active = await req.payload.find({
          collection: 'bookings', req, overrideAccess: true, depth: 0,
          where: { and: [{ slot: { equals: slot.id } }, { status: { in: ['booked', 'attended'] } }] },
          limit: 1000, pagination: false,
        })
        const claimKey = nextSeatClaimKey(slot.id, slot.capacity, active.docs)
        if (!claimKey) throw new Error('SLOT_FULL')
        data.claimKey = claimKey
        data.reminderDayBefore = new Date(start - 24 * HOUR).toISOString()
        data.reminderTwoHours = new Date(start - 2 * HOUR).toISOString()
        return data
      },
    ],

