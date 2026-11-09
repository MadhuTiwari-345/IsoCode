import type { CollectionConfig } from 'payload'
import { anyone, isStaff } from './access'

export const VisitSlots: CollectionConfig = {
  slug: 'visit-slots',
  labels: { singular: 'Visit slot', plural: 'Visit slots' },
  admin: { useAsTitle: 'startsAt', group: 'Sales', defaultColumns: ['project', 'startsAt', 'capacity', 'isOpen', 'demoOnly'] },
  access: { read: anyone, create: isStaff, update: isStaff, delete: isStaff },
  fields: [
    { name: 'project', type: 'relationship', relationTo: 'projects', required: true, index: true },
    { name: 'startsAt', type: 'date', required: true, index: true, admin: { date: { pickerAppearance: 'dayAndTime' } } },
    { name: 'durationMinutes', type: 'number', defaultValue: 60, required: true },
    { name: 'capacity', type: 'number', defaultValue: 2, required: true, min: 1, admin: { description: 'Max parties that can book this slot. Enforced on the server.' } },
    { name: 'isOpen', type: 'checkbox', defaultValue: true },
    { name: 'demoOnly', type: 'checkbox', defaultValue: false, index: true, admin: { description: 'Simulated availability for prototype testing. Not a client-confirmed appointment slot.' } },
    { name: 'demoOnly', type: 'checkbox', defaultValue: false, index: true, admin: { description: 'Simulated availability for the prototype. Not a client-confirmed appointment slot.' } },
  ],
}
