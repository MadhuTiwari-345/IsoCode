import { getPayload } from 'payload'
import config from '../payload.config'

type Role = 'executive' | 'head'

const specs: Array<{ role: Role; prefix: string; defaultName: string }> = [
  { role: 'executive', prefix: 'HOMIQ_REVIEWER_EXECUTIVE', defaultName: 'HOMIQ Executive Reviewer' },
  { role: 'head', prefix: 'HOMIQ_REVIEWER_HEAD', defaultName: 'HOMIQ Sales Head Reviewer' },
]

function required(key: string): string {
  const value = process.env[key]?.trim()
  if (!value) throw new Error(`Missing required environment variable: ${key}`)
  return value
}

const payload = await getPayload({ config })

try {
  for (const spec of specs) {
    const email = required(`${spec.prefix}_EMAIL`).toLowerCase()
    const password = required(`${spec.prefix}_PASSWORD`)
    const name = process.env[`${spec.prefix}_NAME`]?.trim() || spec.defaultName

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error(`Invalid email for ${spec.role}`)
    if (password.length < 14) throw new Error(`${spec.prefix}_PASSWORD must be at least 14 characters`)

    let executiveId: string | undefined
    if (spec.role === 'executive') {
      const phone = required('HOMIQ_REVIEWER_EXECUTIVE_PHONE')
      const projects = await payload.find({ collection: 'projects', limit: 100, depth: 0, overrideAccess: true })
      const roster = await payload.find({
        collection: 'sales-executives',
        where: { name: { equals: name } },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      })
      const rosterData = { name, phone, languages: ['en', 'hi', 'gu'], projects: projects.docs.map((p) => p.id), active: true }
      const rosterRecord = roster.docs[0]
        ? await payload.update({ collection: 'sales-executives', id: roster.docs[0].id, data: rosterData, overrideAccess: true })
        : await payload.create({ collection: 'sales-executives', data: rosterData, overrideAccess: true })
      executiveId = rosterRecord.id
    }

    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })

    if (existing.docs[0]) {
      await payload.update({
        collection: 'users',
        id: existing.docs[0].id,
        data: { name, password, role: spec.role, ...(executiveId ? { executive: executiveId } : {}) } as any,
        overrideAccess: true,
      })
      payload.logger.info(`Updated reviewer account: ${email} (${spec.role})`)
    } else {
      await payload.create({
        collection: 'users',
        data: { name, email, password, role: spec.role, ...(executiveId ? { executive: executiveId } : {}) } as any,
        overrideAccess: true,
      })
      payload.logger.info(`Created reviewer account: ${email} (${spec.role})`)
    }
  }
  payload.logger.info('Reviewer accounts provisioned. Password values were not logged.')
} finally {
  await payload.destroy()
}
