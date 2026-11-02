export type MakeSiteSettings = {
  title?: string
  description?: string
  language?: string
  robots?: { index?: boolean }
  icons?: { icon?: string }
  openGraph?: { image?: string }
  analytics?: { googleAnalyticsId?: string }
  customScripts?: {
    headStart?: string
    headEnd?: string
    bodyStart?: string
    bodyEnd?: string
  }
  accessibility?: { addBypassLinks?: boolean }
}

// Static defaults replace Figma Make's runtime-injected site.json.
// These can later be moved into a Payload Global if editable site settings are needed.
export const makeSiteSettings: MakeSiteSettings = {
  title: 'HOMIQ | Real Estate, Made Personal',
  description: 'Discover homes, explore projects, and connect with the HOMIQ sales team.',
  language: 'en',
  robots: { index: true },
  accessibility: { addBypassLinks: true },
}

export function sanitizeHtmlAttribute(value: string | undefined): string {
  return value?.replace(/[^a-zA-Z0-9_-]/g, '') || ''
}
