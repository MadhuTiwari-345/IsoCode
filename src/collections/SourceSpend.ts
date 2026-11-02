import type { CollectionConfig } from 'payload'
import { isStaff } from './access'
import { SOURCES } from './Leads'

export const SourceSpend: CollectionConfig = {
  slug: 'source-spend',
  labels: { singular: 'Source spend', plural: 'Source spend' },
  admin: { useAsTitle: 'source', group: 'Sales' },
  access: { read: isStaff, create: isStaff, update: isStaff, delete: isStaff },
  fields: [
    { name: 'source', type: 'select', required: true, unique: true, options: SOURCES },
    { name: 'spendInr', type: 'number', required: true, admin: { description: 'Spend for the reporting period, in rupees.' } },
  ],
}
