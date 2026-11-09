import { getPayload } from 'payload'
import config from '../payload.config'

const payload = await getPayload({ config })
const projects = await payload.find({
  collection: 'projects',
  sort: 'name',
  limit: 2,
  depth: 0,
  overrideAccess: true,
})

if (projects.docs.length < 2) {
  throw new Error('Seed requires two existing project records. Add the client-verified projects in Admin first; the seed will not invent project facts.')
}

const [project1, project2] = projects.docs
const sampleLeads = [
  {
    leadCode: 'LD-58210',
    name: 'Hardik Patel',
    source: 'portal_99acres',
    project: project1.id,
    bhk: '3',
    stage: 'visit_booked',
  },
  {
    leadCode: 'LD-58211',
    name: 'Nidhi Shah',
    source: 'social_ads',
    project: project2.id,
    bhk: '2',
    stage: 'new',
  },
  {
    leadCode: 'LD-58224',
    name: 'Kavita Joshi',
    source: 'hoarding',
    project: project2.id,
    bhk: '2',
    stage: 'visited',
  },
] as const

const saved = new Map<string, string>()
for (const sample of sampleLeads) {
  const existing = await payload.find({
    collection: 'leads',
    where: { leadCode: { equals: sample.leadCode } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const data = {
    ...sample,
    // Deliberately non-contactable placeholders. Replace only with consented
    // test numbers before exercising any messaging integration.
    phone: '0000000000',
    phoneNormalized: '0000000000',
    language: 'en' as const,
    enquiredAt: new Date('2026-10-30T09:00:00+05:30').toISOString(),
    consentDpdp: false,
    whatsappOptIn: false,
  }
  if (existing.docs[0]) {
    await payload.update({ collection: 'leads', id: existing.docs[0].id, data, draft: false, overrideAccess: true })
  } else {
    await payload.create({ collection: 'leads', data, draft: false, overrideAccess: true })
  }
  const savedLead = await payload.find({
    collection: 'leads',
    where: { leadCode: { equals: sample.leadCode } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  if (!savedLead.docs[0]) throw new Error(`Could not save demo lead ${sample.leadCode}`)
  saved.set(sample.leadCode, String(savedLead.docs[0].id))
}

const hardikId = saved.get('LD-58210')!
const existingBooking = await payload.find({
  collection: 'bookings',
  where: { lead: { equals: hardikId } },
  limit: 1,
  depth: 0,
  overrideAccess: true,
})

if (!existingBooking.docs.length) {
  const slot = await payload.create({
    collection: 'visit-slots',
    data: {
      project: project1.id,
      startsAt: new Date('2026-11-01T11:00:00+05:30').toISOString(),
      durationMinutes: 60,
      capacity: 1,
      isOpen: false,
    },
    overrideAccess: true,
  })
  await payload.create({
    collection: 'bookings',
    data: { lead: hardikId, slot: slot.id, visitors: 2, status: 'booked' },
    context: { allowHistoricalDemo: true },
    overrideAccess: true,
  })
}

payload.logger.info('HOMIQ demo seed complete.')
payload.logger.info(`Project 1 mapped to existing project: ${project1.name} (${project1.id})`)
payload.logger.info(`Project 2 mapped to existing project: ${project2.name} (${project2.id})`)
payload.logger.info('Seeded LD-58210, LD-58211 and LD-58224. Placeholder phone values are non-contactable; consent and WhatsApp opt-in are false.')
process.exit(0)
