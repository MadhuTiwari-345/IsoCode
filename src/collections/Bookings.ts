import type { CollectionConfig } from 'payload'
import { isStaff } from './access'

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
        data.reminderDayBefore = new Date(start - 24 * HOUR).toISOString()
        data.reminderTwoHours = new Date(start - 2 * HOUR).toISOString()
        return data
      },
    ],
    // Double-booking guard: re-counts after insert and removes the booking if the slot is over capacity.
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== 'create') return doc
        // Re-read: the doc passed to hooks may be a partial `select` projection.
        const full = await req.payload.findByID({ collection: 'bookings', id: doc.id, depth: 0, req, overrideAccess: true })
        const slotId = full.slot as string
        const slot = await req.payload.findByID({ collection: 'visit-slots', id: slotId, depth: 0, req, overrideAccess: true })
        const { totalDocs } = await req.payload.count({
          collection: 'bookings', req, overrideAccess: true,
          where: { and: [{ slot: { equals: slotId } }, { status: { in: ['booked', 'attended'] } }] },
        })
        if (totalDocs > slot.capacity) {
          // Compensate explicitly: do not rely on transaction support. If two
          // requests race, both may back out, but capacity is never exceeded.
          await req.payload.delete({ collection: 'bookings', id: doc.id, req, overrideAccess: true })
          throw new Error('SLOT_FULL')
        }
        return doc
      },
    ],
  },
  fields: [
    { name: 'code', type: 'text', unique: true, index: true, admin: { readOnly: true } },
    { name: 'lead', type: 'relationship', relationTo: 'leads', required: true, index: true },
    { name: 'slot', type: 'relationship', relationTo: 'visit-slots', required: true, index: true },
    { name: 'project', type: 'relationship', relationTo: 'projects', index: true },
    { name: 'visitors', type: 'number', defaultValue: 2, min: 1, max: 8 },
    { name: 'status', type: 'select', defaultValue: 'booked', index: true, options: [{ label: 'Booked', value: 'booked' }, { label: 'Attended', value: 'attended' }, { label: 'No-show', value: 'no_show' }, { label: 'Cancelled', value: 'cancelled' }] },
    { name: 'reminderDayBefore', type: 'date' },
    { name: 'reminderTwoHours', type: 'date' },
  ],
}
