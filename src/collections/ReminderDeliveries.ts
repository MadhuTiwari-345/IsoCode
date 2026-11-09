import type { CollectionConfig } from 'payload'
import { isStaff } from './access'

export const ReminderDeliveries: CollectionConfig = {
  slug: 'reminder-deliveries',
  labels: { singular: 'Reminder delivery', plural: 'Reminder deliveries' },
  admin: { useAsTitle: 'deliveryKey', group: 'Sales', defaultColumns: ['deliveryKey', 'status', 'channel', 'scheduledFor'] },
  access: { read: isStaff, create: () => false, update: () => false, delete: isStaff },
  fields: [
    { name: 'deliveryKey', type: 'text', required: true, unique: true, index: true },
    { name: 'booking', type: 'relationship', relationTo: 'bookings', required: true, index: true },
    { name: 'lead', type: 'relationship', relationTo: 'leads', required: true, index: true },
    { name: 'kind', type: 'select', required: true, options: [{ label: '24 hours before', value: 'day_before' }, { label: '2 hours before', value: 'two_hours' }] },
    { name: 'channel', type: 'select', required: true, defaultValue: 'mock', options: [{ label: 'Mock delivery', value: 'mock' }] },
    { name: 'status', type: 'select', required: true, options: [{ label: 'Sent (mock)', value: 'sent' }, { label: 'Skipped: no consent', value: 'skipped_no_consent' }, { label: 'Skipped: opted out', value: 'skipped_opt_out' }] },
    { name: 'scheduledFor', type: 'date', required: true },
    { name: 'deliveredAt', type: 'date' },
    { name: 'body', type: 'textarea', required: true },
  ],
}
