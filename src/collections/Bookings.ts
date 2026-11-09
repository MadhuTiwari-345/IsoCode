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

        // The read chooses a candidate seat. The unique claimKey index is the
        // concurrency guard: only one concurrent insert can own a seat key.
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
  },
  fields: [
    { name: 'code', type: 'text', unique: true, index: true, admin: { readOnly: true } },
    { name: 'claimKey', type: 'text', unique: true, index: true, admin: { hidden: true, description: 'Unique slot seat claim. Enforced by a MongoDB unique index.' } },
    { name: 'lead', type: 'relationship', relationTo: 'leads', required: true, index: true },
    { name: 'slot', type: 'relationship', relationTo: 'visit-slots', required: true, index: true },
    { name: 'project', type: 'relationship', relationTo: 'projects', index: true },
    { name: 'visitors', type: 'number', defaultValue: 2, min: 1, max: 8 },
    { name: 'status', type: 'select', defaultValue: 'booked', index: true, options: [{ label: 'Booked', value: 'booked' }, { label: 'Attended', value: 'attended' }, { label: 'No-show', value: 'no_show' }, { label: 'Cancelled', value: 'cancelled' }] },
    { name: 'reminderDayBefore', type: 'date' },
    { name: 'reminderTwoHours', type: 'date' },
  ],
}
