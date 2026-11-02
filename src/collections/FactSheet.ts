import type { CollectionConfig } from 'payload'
import { anyone, isStaff } from './access'
import { revalidateTagsAfterChange, revalidateTagsAfterDelete } from '../lib/revalidate'

/** The only source of truth the chat assistant may quote. */
export const FactSheet: CollectionConfig = {
  slug: 'fact-sheet',
  labels: { singular: 'Fact', plural: 'Fact sheet' },
  admin: { useAsTitle: 'topic', group: 'Sales', defaultColumns: ['topic', 'project', 'updatedAt'] },
  access: { read: anyone, create: isStaff, update: isStaff, delete: isStaff },
  hooks: { afterChange: [revalidateTagsAfterChange('facts')], afterDelete: [revalidateTagsAfterDelete('facts')] },
  fields: [
    { name: 'project', type: 'relationship', relationTo: 'projects', required: true },
    {
      name: 'topic',
      type: 'select',
      required: true,
      options: [
        { label: 'Price', value: 'price' },
        { label: 'Configurations and sizes', value: 'configs' },
        { label: 'Possession', value: 'possession' },
        { label: 'Amenities', value: 'amenities' },
        { label: 'Location and connectivity', value: 'location' },
        { label: 'RERA and approvals', value: 'rera' },
        { label: 'Payment plan and loans', value: 'payment' },
        { label: 'Parking', value: 'parking' },
      ],
    },
    { name: 'answerEn', type: 'textarea', required: true, label: 'Answer (English)' },
    { name: 'answerHi', type: 'textarea', label: 'Answer (Hindi)' },
    { name: 'answerGu', type: 'textarea', label: 'Answer (Gujarati)' },
  ],
}
