import { unstable_cache } from 'next/cache'
import { getPayloadClient } from './payload'

/** Clearly labelled launch placeholders: never imply unverified project facts. */
const launchProjects = [
  {
    id: 'launch-project-01', name: 'Project 01', slug: 'project-01',
    locality: 'Ahmedabad', tagline: 'A considered 2 and 3 BHK residential address.',
    address: '', latitude: null, longitude: null, reraNumber: '',
    possession: 'Confirm with advisor', priceFromLakh: 65, priceToLakh: 120,
    configurations: ['2', '3'], isLaunchPlaceholder: true,
  },
  {
    id: 'launch-project-02', name: 'Project 02', slug: 'project-02',
    locality: 'Ahmedabad', tagline: 'A second residential development to explore.',
    address: '', latitude: null, longitude: null, reraNumber: '',
    possession: 'Confirm with advisor', priceFromLakh: 65, priceToLakh: 120,
    configurations: ['2', '3'], isLaunchPlaceholder: true,
  },
]

/** Public, editor-managed data. Cached; invalidated by collection hooks via tags. */
export const getProjects = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    const res = await payload.find({ collection: 'projects', limit: 20, sort: 'name', depth: 0, overrideAccess: false })
    return (res.docs.length ? res.docs : launchProjects) as any[]
  },
  ['projects-list'],
  { tags: ['projects'] },
)

export const formatLakh = (l: number) => (l >= 100 ? `₹${+(l / 100).toFixed(2)} crore` : `₹${l} lakh`)

export const getProjectBySlug = (slug: string) =>
  unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const res = await payload.find({ collection: 'projects', where: { slug: { equals: slug } }, limit: 1, depth: 0, overrideAccess: false })
      return (res.docs[0] ?? launchProjects.find((p) => p.slug === slug) ?? null) as any
    },
    ['project', slug],
    { tags: ['projects'] },
  )()

export const getFacts = (projectId: string) =>
  unstable_cache(
    async () => {
      if (projectId.startsWith('launch-project-')) return []
      const payload = await getPayloadClient()
      const res = await payload.find({ collection: 'fact-sheet', where: { project: { equals: projectId } }, limit: 50, depth: 0, overrideAccess: false })
      return res.docs
    },
    ['facts', projectId],
    { tags: ['facts'] },
  )()

const U = (id: string, w = 1600) => `https://images.unsplash.com/${id}?auto=format&fit=crop&q=80&w=${w}`
export const PHOTOS = {
  hero: U('photo-1624204386084-dd8c05e32226', 2000),
  interior: U('photo-1724582586529-62622e50c0b3', 1600),
  tower: U('photo-1545324418-cc1a3fa10c00', 1200),
  river: U('photo-1775721338164-3759f87e64e1', 1400),
}
export const projectPhoto = (slug: string) => (slug === 'sabarmati-residences' || slug === 'project-02' ? PHOTOS.river : PHOTOS.tower)
