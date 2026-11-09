import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  const authorization = request.headers.get('authorization')
  if (!secret || authorization !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await getPayloadClient()
  const now = new Date()
  const jobs = [
    { kind: 'day_before' as const, dueField: 'reminderDayBefore' as const, sentField: 'reminderDayBeforeSentAt' as const },
    { kind: 'two_hours' as const, dueField: 'reminderTwoHours' as const, sentField: 'reminderTwoHoursSentAt' as const },
  ]
  let processed = 0
  let sent = 0
  let skipped = 0

  for (const job of jobs) {
    const due = await payload.find({
      collection: 'bookings',
      depth: 0,
      limit: 100,
      pagination: false,
      overrideAccess: true,
      where: {
        and: [
          { status: { equals: 'booked' } },
          { [job.dueField]: { less_than_equal: now.toISOString() } },
          { [job.sentField]: { exists: false } },
        ],
      },
    })

    for (const booking of due.docs) {
      processed += 1
      const key = `${booking.id}:${job.kind}`
      const leadId = typeof booking.lead === 'string' ? booking.lead : booking.lead.id
      const lead = await payload.findByID({ collection: 'leads', id: leadId, depth: 0, overrideAccess: true })
      const slotId = typeof booking.slot === 'string' ? booking.slot : booking.slot.id
      const slot = await payload.findByID({ collection: 'visit-slots', id: slotId, depth: 0, overrideAccess: true })
      const projectId = typeof slot.project === 'string' ? slot.project : slot.project.id
      const project = await payload.findByID({ collection: 'projects', id: projectId, depth: 0, overrideAccess: true })
      const allowed = lead.consentDpdp === true && lead.doNotContact !== true
      const status = allowed ? 'sent' : lead.doNotContact ? 'skipped_opt_out' : 'skipped_no_consent'
      const when = new Date(slot.startsAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' })
      const body = allowed
        ? `HOMIQ visit reminder: ${lead.name}, your site visit at ${project.name} is scheduled for ${when}. This is a simulated delivery for product testing; no SMS or WhatsApp was sent.`
        : `Reminder not sent for ${lead.name}: ${status}. Contact permissions must be respected.`

      const scheduledForValue = job.dueField === 'reminderDayBefore' ? booking.reminderDayBefore : booking.reminderTwoHours
      if (typeof scheduledForValue !== 'string') {
        skipped += 1
        continue
      }

      try {
        await payload.create({
          collection: 'reminder-deliveries',
          draft: true,
          overrideAccess: true,
          data: {
            deliveryKey: key,
            booking: booking.id,
            lead: lead.id,
            kind: job.kind,
            channel: 'mock',
            status,
            scheduledFor: scheduledForValue,
            deliveredAt: allowed ? now.toISOString() : undefined,
            body,
          },
        })
      } catch (error) {
        if (!/duplicate key|E11000/i.test(error instanceof Error ? error.message : String(error))) throw error
      }
      await payload.update({
        collection: 'bookings',
        id: booking.id,
        overrideAccess: true,
        data: { [job.sentField]: now.toISOString() },
      })
      if (allowed) sent += 1
      else skipped += 1
    }
  }

  return NextResponse.json({ ok: true, processed, sentMock: sent, skipped, note: 'Mock delivery only. No external message provider is connected.' })
}
