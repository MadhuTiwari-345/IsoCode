import type { CollectionConfig } from 'payload'
import { isStaff } from './access'
import { normalizePhone } from '../lib/phone'

export const SOURCES = [
  { label: 'Property portal', value: 'property_portal' },
  { label: '99acres', value: 'portal_99acres' },
  { label: 'MagicBricks', value: 'portal_magicbricks' },
  { label: 'Social media ads', value: 'social_ads' },
  { label: 'Website', value: 'website' },
  { label: 'Hoarding number', value: 'hoarding' },
]

export const Leads: CollectionConfig = {
  slug: 'leads',
  admin: { useAsTitle: 'name', group: 'Sales', defaultColumns: ['leadCode', 'name', 'source', 'project', 'stage', 'assignedTo'] },
  access: {
    // Buyers can read only the lead created from their own account; staff use the console, which checks role server-side.
    read: ({ req }) => (req.user?.collection === 'admins' ? true : req.user?.collection === 'users' ? { user: { equals: req.user.id } } : false),
    create: isStaff, update: isStaff, delete: isStaff,
  },
  hooks: {
    beforeValidate: [
      async ({ data, operation, req }) => {
        if (!data) return data
        if (data.phone) data.phoneNormalized = normalizePhone(data.phone)
        if (operation === 'create') {
          if (!data.leadCode) {
            // Avoid countDocuments inside Payload's Mongo transaction.
            data.leadCode = `LD-${Date.now().toString().slice(-9)}${Math.random().toString(36).slice(2, 5).toUpperCase()}`
          }
          if (!data.enquiredAt) data.enquiredAt = new Date().toISOString()
          // Duplicate detection: same normalised phone or email as an earlier lead.
          const or: any[] = []
          if (data.phoneNormalized) or.push({ phoneNormalized: { equals: data.phoneNormalized } })
          if (data.email) or.push({ email: { equals: String(data.email).toLowerCase() } })
          if (or.length) {
            const found = await req.payload.find({
              collection: 'leads', where: { and: [{ or }, { isDuplicate: { not_equals: true } }] },
              sort: 'enquiredAt', limit: 1, pagination: false, depth: 0, req, overrideAccess: true,
            })
            if (found.docs[0]) {
              data.isDuplicate = true
              data.duplicateOf = found.docs[0].id
            }
          }
        }
        if (data.email) data.email = String(data.email).toLowerCase()
        return data
      },
    ],
  },
  fields: [
    { name: 'leadCode', type: 'text', unique: true, index: true, admin: { readOnly: true } },
    { name: 'name', type: 'text', required: true },
    { name: 'phone', type: 'text', required: true },
    { name: 'phoneNormalized', type: 'text', index: true, admin: { readOnly: true } },
    { name: 'email', type: 'email', index: true },
    { name: 'language', type: 'select', defaultValue: 'en', options: [{ label: 'English', value: 'en' }, { label: 'Hindi', value: 'hi' }, { label: 'Gujarati', value: 'gu' }] },
    { name: 'source', type: 'select', required: true, index: true, options: SOURCES },
    { name: 'project', type: 'relationship', relationTo: 'projects' },
    { name: 'bhk', type: 'select', options: [{ label: '2 BHK', value: '2' }, { label: '3 BHK', value: '3' }] },
    { name: 'budgetMinLakh', type: 'number' },
    { name: 'budgetMaxLakh', type: 'number' },
    { name: 'preferences', type: 'textarea' },
    {
      name: 'stage', type: 'select', defaultValue: 'new', index: true,
      options: [
        { label: 'New', value: 'new' }, { label: 'Engaged', value: 'engaged' }, { label: 'Qualified', value: 'qualified' },
        { label: 'Visit booked', value: 'visit_booked' }, { label: 'Visited', value: 'visited' }, { label: 'Lost', value: 'lost' },
      ],
    },
    { name: 'assignedTo', type: 'relationship', relationTo: 'sales-executives' },
    { name: 'enquiredAt', type: 'date', required: true, index: true },
    { name: 'firstResponseAt', type: 'date', index: true, admin: { description: 'Timestamp when the first assistant or staff response was recorded.' } },
    { name: 'firstResponseMinutes', type: 'number', admin: { description: 'Minutes from enquiry to first response. Empty = not yet contacted.' } },
    { name: 'isDuplicate', type: 'checkbox', defaultValue: false, index: true },
    { name: 'duplicateOf', type: 'relationship', relationTo: 'leads' },
    { name: 'consentDpdp', type: 'checkbox', defaultValue: false, admin: { description: 'DPDP Act 2023: explicit consent to process personal data.' } },
    { name: 'consentAt', type: 'date' },
    { name: 'whatsappOptIn', type: 'checkbox', defaultValue: false, admin: { description: 'Required before any WhatsApp Business message is sent.' } },
    { name: 'doNotContact', type: 'checkbox', defaultValue: false, index: true, admin: { description: 'Opt-out flag. Must be checked before any outbound contact.' } },
    { name: 'optedOutAt', type: 'date', admin: { description: 'When the buyer opted out of contact.' } },
    { name: 'user', type: 'relationship', relationTo: 'users', index: true, admin: { description: 'Website account that created this lead, if signed in.' } },
    { name: 'flagged', type: 'checkbox', defaultValue: false, index: true, admin: { description: 'Chat needs the sales head to review (unanswered question, request for a person, discount ask).' } },
    { name: 'flagReason', type: 'text' },
    { name: 'summary', type: 'textarea', admin: { description: 'Chat summary generated at handoff.' } },
    { name: 'handedOffAt', type: 'date' },
  ],
}
