import type { Access, CollectionConfig } from 'payload'

const isAdmin = (req: { user?: { collection?: string } | null }) => req.user?.collection === 'admins'

/** Own record, or a Payload admin. */
const self: Access = ({ req }) => {
  if (isAdmin(req)) return true
  if (req.user?.collection === 'users') return { id: { equals: req.user.id } }
  return false
}

/**
 * Website accounts: home buyers (self sign-up) and sales staff (created by an admin).
 * Separate from `admins`, which are CMS editors only.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Website account', plural: 'Website accounts' },
  admin: { useAsTitle: 'email', group: 'Sales', defaultColumns: ['name', 'email', 'role'] },
  auth: { tokenExpiration: 60 * 60 * 24 * 7 },
  access: {
    create: () => true, // public sign-up; `role` is protected by field access below
    read: self,
    update: self,
    delete: ({ req }) => isAdmin(req),
    admin: () => false, // website accounts can never open Payload Admin
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'phone', type: 'text' },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'buyer',
      required: true,
      options: [
        { label: 'Home buyer', value: 'buyer' },
        { label: 'Sales executive', value: 'executive' },
        { label: 'Sales head', value: 'head' },
      ],
      access: {
        create: ({ req }) => isAdmin(req),
        update: ({ req }) => isAdmin(req),
      },
    },
    {
      name: 'executive',
      type: 'relationship',
      relationTo: 'sales-executives',
      admin: { description: 'Links a staff login to their sales executive record.' },
      access: { create: ({ req }) => isAdmin(req), update: ({ req }) => isAdmin(req) },
    },
  ],
}
