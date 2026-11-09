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
  throw new Error('Seed requires the two Project 01 / Project 02 records. Create those demo catalogue records in Admin before seeding.')
}

const [project1, project2] = projects.docs

// Only facts explicitly present in the interview brief are seeded. These project
// records and future visit slots are explicitly demo-only.
for (const project of [project1, project2]) {
  await payload.update({
    collection: 'projects', id: project.id,
    data: {
      demoOnly: true,
      approvedForPublic: true,
      address: 'Illustrative demo location, Ahmedabad (not a real project address)',
      latitude: project.latitude || 23.0225,
      longitude: project.longitude || 72.5714,
      reraNumber: 'DEMO ONLY · NOT A RERA REGISTRATION',
      possession: 'Demo data · confirm with advisor',
    } as any,
    overrideAccess: true,
  })
  const facts = [
    { topic: 'price', answerEn: 'The client brief gives a combined portfolio price range of ₹65 lakh to ₹1.2 crore across both projects. It does not provide a project-specific price or final offer. A sales advisor must confirm the current price. HOMIQ never quotes final prices or discounts.', answerHi: 'क्लाइंट के ब्रीफ के अनुसार, दोनों परियोजनाओं की संयुक्त मूल्य सीमा ₹65 लाख से ₹1.2 करोड़ है। किसी एक परियोजना की अलग कीमत या अंतिम ऑफ़र नहीं दिया गया है। वर्तमान कीमत की पुष्टि बिक्री सलाहकार करेंगे। HOMIQ अंतिम कीमत या छूट नहीं बताता।', answerGu: 'ક્લાયન્ટના બ્રીફ મુજબ, બંને પ્રોજેક્ટની સંયુક્ત કિંમતની રેન્જ ₹65 લાખથી ₹1.2 કરોડ છે. કોઈ એક પ્રોજેક્ટની અલગ કિંમત અથવા અંતિમ ઓફર આપવામાં આવી નથી. હાલની કિંમતની પુષ્ટિ સેલ્સ સલાહકાર કરશે. HOMIQ અંતિમ કિંમત અથવા ડિસ્કાઉન્ટ જણાવતું નથી.' },
    { topic: 'configs', answerEn: 'The client brief states that the developer has two live residential projects with 2 BHK and 3 BHK homes, and 420 apartments in total. It does not specify project-wise inventory or availability. A sales advisor must confirm those details.', answerHi: 'क्लाइंट के ब्रीफ के अनुसार, डेवलपर के दो चालू आवासीय प्रोजेक्ट हैं जिनमें 2 BHK और 3 BHK घर हैं और कुल 420 अपार्टमेंट हैं। प्रत्येक प्रोजेक्ट का अलग इन्वेंटरी या उपलब्धता विवरण नहीं दिया गया है। बिक्री सलाहकार इसकी पुष्टि करेंगे।', answerGu: 'ક્લાયન્ટના બ્રીફ મુજબ, ડેવલપરના બે ચાલુ રહેણાંક પ્રોજેક્ટ છે જેમાં 2 BHK અને 3 BHK ઘરો છે અને કુલ 420 એપાર્ટમેન્ટ છે. દરેક પ્રોજેક્ટની અલગ ઇન્વેન્ટરી અથવા ઉપલબ્ધતાની માહિતી આપવામાં આવી નથી. સેલ્સ સલાહકાર તેની પુષ્ટિ કરશે.' },
    { topic: 'location', answerEn: 'Company A is based in Ahmedabad. The exact address and verified map pin for this project were not included in the interview brief. A sales advisor must confirm the location before a real visit.', answerHi: 'Company A अहमदाबाद में स्थित है। इंटरव्यू ब्रीफ में इस प्रोजेक्ट का सटीक पता और सत्यापित मैप पिन नहीं दिया गया है। वास्तविक विज़िट से पहले बिक्री सलाहकार स्थान की पुष्टि करेंगे।', answerGu: 'Company A અમદાવાદમાં સ્થિત છે. ઇન્ટરવ્યૂ બ્રીફમાં આ પ્રોજેક્ટનું ચોક્કસ સરનામું અને ચકાસાયેલો મેપ પિન આપવામાં આવ્યો નથી. વાસ્તવિક મુલાકાત પહેલાં સેલ્સ સલાહકાર સ્થાનની પુષ્ટિ કરશે.' },
  ] as const
  for (const fact of facts) {
    const existing = await payload.find({ collection: 'fact-sheet', where: { and: [{ project: { equals: project.id } }, { topic: { equals: fact.topic } }] }, limit: 1, depth: 0, overrideAccess: true })
    if (!existing.docs.length) await payload.create({ collection: 'fact-sheet', data: { project: project.id, ...fact } as any, overrideAccess: true })
  }
}


const sampleLeads = [
  {
    leadCode: 'LD-58210',
    name: 'Hardik Patel',
    source: 'property_portal',
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
      isOpen: true,
      demoOnly: true,
    } as any,
    overrideAccess: true,
  })
  await payload.create({
    collection: 'bookings',
    data: { lead: hardikId, slot: slot.id, visitors: 2, status: 'booked' },
    context: { allowHistoricalDemo: true },
    overrideAccess: true,
  })
  await payload.update({ collection: 'visit-slots', id: slot.id, data: { isOpen: false }, overrideAccess: true })
}

// Future availability is simulated reviewer data, not Company A's operating calendar.
const nowIST = new Date(Date.now() + 330 * 60_000)
const todayIST = Date.UTC(nowIST.getUTCFullYear(), nowIST.getUTCMonth(), nowIST.getUTCDate())
for (const project of [project1, project2]) {
  for (const dayOffset of [2, 3, 4]) {
    const day = new Date(todayIST + dayOffset * 24 * 60 * 60_000)
    const date = [day.getUTCFullYear(), String(day.getUTCMonth() + 1).padStart(2, '0'), String(day.getUTCDate()).padStart(2, '0')].join('-')
    for (const time of ['11:00', '15:00']) {
      const startsAt = new Date(date + 'T' + time + ':00+05:30').toISOString()
      const existingSlot = await payload.find({ collection: 'visit-slots', where: { and: [{ project: { equals: project.id } }, { startsAt: { equals: startsAt } }] }, limit: 1, depth: 0, overrideAccess: true })
      if (!existingSlot.docs.length) await payload.create({ collection: 'visit-slots', data: { project: project.id, startsAt, durationMinutes: 60, capacity: 1, isOpen: true, demoOnly: true } as any, overrideAccess: true })
    }
  }
}

payload.logger.info('HOMIQ demo seed complete.')
payload.logger.info(`Project 1 mapped to existing project: ${project1.name} (${project1.id})`)
payload.logger.info(`Project 2 mapped to existing project: ${project2.name} (${project2.id})`)
payload.logger.info('Seeded LD-58210, LD-58211 and LD-58224 plus clearly labelled reviewer-only demo availability. Placeholder phones are non-contactable; consent and WhatsApp opt-in are false.')
process.exit(0)
