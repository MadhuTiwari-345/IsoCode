import type { CollectionConfig } from 'payload'
import { isStaff } from './access'

export const ChatMessages: CollectionConfig = {
  slug: 'chat-messages',
  labels: { singular: 'Chat message', plural: 'Chat messages' },
  admin: { useAsTitle: 'text', group: 'Sales', defaultColumns: ['lead', 'role', 'text', 'createdAt'] },
  access: { read: isStaff, create: isStaff, update: isStaff, delete: isStaff },
  fields: [
    { name: 'lead', type: 'relationship', relationTo: 'leads', required: true, index: true },
    { name: 'role', type: 'select', required: true, options: ['buyer', 'assistant'] },
    { name: 'text', type: 'textarea', required: true },
  ],
}
