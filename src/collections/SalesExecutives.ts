import type { CollectionConfig } from 'payload'
import { isStaff } from './access'

export const SalesExecutives: CollectionConfig = {
  slug: 'sales-executives',
  labels: { singular: 'Sales executive', plural: 'Sales executives' },
  admin: { useAsTitle: 'name', group: 'Sales' },
  access: { read: isStaff, create: isStaff, update: isStaff, delete: isStaff },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'phone', type: 'text', required: true },
    { name: 'languages', type: 'select', hasMany: true, required: true, options: ['en', 'hi', 'gu'] },
    { name: 'projects', type: 'relationship', relationTo: 'projects', hasMany: true },
    { name: 'active', type: 'checkbox', defaultValue: true },
  ],
}
