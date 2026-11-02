import path from 'path'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { mcpPlugin } from '@payloadcms/plugin-mcp'
import { en as adminLanguage } from '@payloadcms/translations/languages/en'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import { Admins } from './collections/Admins'
import { Media } from './collections/Media'
import { Folders } from './collections/Folders'
import { Tags } from './collections/Tags'
import { Users } from './collections/Users'
import { Projects } from './collections/Projects'
import { FactSheet } from './collections/FactSheet'
import { SalesExecutives } from './collections/SalesExecutives'
import { VisitSlots } from './collections/VisitSlots'
import { Leads } from './collections/Leads'
import { ChatMessages } from './collections/ChatMessages'
import { Bookings } from './collections/Bookings'
import { SourceSpend } from './collections/SourceSpend'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

if (process.env.NODE_ENV === 'production') {
  if (!process.env.PAYLOAD_SECRET) {
    throw new Error('PAYLOAD_SECRET is required in production.')
  }
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required in production.')
  }
}

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || 'local-development-secret-change-before-deploy',
  serverURL: process.env.NEXT_PUBLIC_SITE_URL,
  admin: {
    user: Admins.slug,
    constrainWidth: true,
    dashboard: {
      widgets: [],
      defaultLayout: [
        { widgetSlug: 'activity', width: 'full' },
        { widgetSlug: 'collections', width: 'full' },
      ],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  i18n: {
    fallbackLanguage: 'en',
    supportedLanguages: { en: adminLanguage },
  },
  collections: [Admins, Media, Folders, Tags, Users, Projects, FactSheet, SalesExecutives, VisitSlots, Leads, ChatMessages, Bookings, SourceSpend],
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/homiq',
    // The deployed Atlas-compatible Mongo endpoint does not support Payload's
    // multi-document transactions. Disable them explicitly rather than letting
    // buyer registration fail while Payload starts a transaction.
    transactionOptions: false,
  }),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  localization: {
    locales: [{ code: 'en', label: 'English' }],
    fallback: true,
    defaultLocale: 'en',
  },
  plugins: [mcpPlugin({})],
})
