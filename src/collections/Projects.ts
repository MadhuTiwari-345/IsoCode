import type { CollectionConfig } from 'payload'
import { anyone, isStaff } from './access'
import { revalidateTagsAfterChange, revalidateTagsAfterDelete } from '../lib/revalidate'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: { useAsTitle: 'name', group: 'Sales', defaultColumns: ['name', 'locality', 'reraNumber'] },
  access: { read: anyone, create: isStaff, update: isStaff, delete: isStaff },
  hooks: { afterChange: [revalidateTagsAfterChange('projects')], afterDelete: [revalidateTagsAfterDelete('projects')] },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'locality', type: 'text', required: true },
    { name: 'tagline', type: 'text' },
    { name: 'address', type: 'text', required: true },
    { name: 'latitude', type: 'number', required: true },
    { name: 'longitude', type: 'number', required: true },
    { name: 'reraNumber', type: 'text', required: true, admin: { description: 'Must be shown on all buyer-facing material (RERA).' } },
    { name: 'possession', type: 'text' },
    { name: 'priceFromLakh', type: 'number', required: true },
    { name: 'priceToLakh', type: 'number', required: true },
    { name: 'configurations', type: 'select', hasMany: true, options: ['2', '3'].map((v) => ({ label: `${v} BHK`, value: v })) },
  ],
}
