import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import { getProjects, formatLakh, projectPhoto, PHOTOS } from '@/lib/catalog'

const steps = [
  ['Ask in your language', 'Chat in English, हिन्दी or ગુજરાતી. Answers use only facts supplied in the interview brief; missing details go to a human advisor.'],
  ['Share what you need', 'Home size and budget. We match you to the right project.'],
  ['Choose an available time', 'See published visit slots and request a booking.'],
  ['Meet your advisor', 'Your conversation summary is shared with the assigned sales advisor.'],
]
const faqs = [
  ['How quickly will I get a reply?', 'The assistant answers straight away, at any hour. A sales advisor follows up personally once you book a visit or ask for a person.'],
  ['Can I talk to a real person?', 'Yes, at any point. Choose “Talk to a person” in the chat and an advisor will contact you with your conversation already in hand.'],
  ['Is the price final?', 'Prices shown are indicative. Your sales advisor confirms the final price in writing. The assistant does not quote final prices or discounts.'],
  ['What happens to my phone number?', 'It is used only to arrange your visit, under the DPDP Act 2023. We message on WhatsApp only if you opt in, and you can withdraw consent at any time.'],
  ['How do reminders work?', 'Your booking stores reminders for one day and two hours before the visit. Delivery is enabled only through a configured messaging provider and opt-in.'],
]

export default async function HomePage() {
  const projects = await getProjects()
  return (
    <>
      <SiteHeader />
      <main>
        <section className="px-3 pt-3 md:px-5 md:pt-5">
          <div className="relative isolate overflow-hidden rounded-[28px] md:rounded-[40px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={PHOTOS.hero} alt="Modern apartment building with glass balconies at dusk" className="absolute inset-0 -z-10 h-full w-full object-cover" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#10251f]/88 via-[#10251f]/48 to-transparent" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#10251f]/65 via-transparent to-transparent" />
            <div className="mx-auto max-w-6xl px-6 pb-48 pt-24 text-white md:px-10 md:pb-56 md:pt-36">
              <p className="text-xs uppercase tracking-[0.3em] text-white/70">Ahmedabad · 2 and 3 BHK residences</p>
              <h1 className="mt-6 max-w-3xl font-serif text-6xl font-medium leading-[0.95] tracking-tight md:text-8xl">Homes made for the way you live.</h1>
              <p className="mt-7 max-w-md text-lg leading-relaxed text-white/80">Ask us anything, in the language you think in. Then pick a time to walk through your future home.</p>
            </div>
          </div>
          <div className="relative mx-auto -mt-28 max-w-4xl px-3 md:-mt-32">
            <div className="rounded-3xl border border-line bg-card p-5 shadow-[0_30px_80px_-30px_rgba(27,41,39,0.28)] md:p-7">
              <div className="grid items-center gap-5 md:grid-cols-[1fr_auto]">
                <div><p className="font-serif text-3xl font-semibold leading-tight">A better way to find your next home</p><p className="mt-1 text-sm text-mute">Start a conversation in English, हिन्दी or ગુજરાતી. No pressure, just clear answers.</p></div>
                <div className="flex flex-wrap gap-2">
                  {['English', 'हिन्दी', 'ગુજરાતી'].map((l) => <Link key={l} href="/chat" className="rounded-full border border-line px-5 py-3 text-sm transition hover:border-moss hover:bg-moss-soft">{l}</Link>)}
                  <Link href="/chat" className="btn-grad rounded-full px-6 py-3 text-sm font-medium text-white">Book a visit</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pt-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div><p className="text-xs uppercase tracking-[0.3em] text-moss">Current projects</p><h2 className="mt-3 max-w-xl font-serif text-5xl font-medium leading-none tracking-tight md:text-6xl">Two developments. Room to find your own rhythm.</h2></div>
            <Link href="/projects" className="text-sm underline underline-offset-4">All projects →</Link>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {projects.length === 0 && <div className="rounded-2xl border border-line bg-card p-8 md:col-span-2"><p className="text-xs uppercase tracking-[0.2em] text-moss">Project information being verified</p><h3 className="mt-3 max-w-2xl font-serif text-3xl">We will only show details that have been confirmed.</h3><p className="mt-3 max-w-xl text-sm leading-relaxed text-mute">The interview brief does not include project-specific addresses, RERA registrations or inventory. Start a conversation to share your requirements; a sales advisor can confirm the missing details.</p><Link href="/chat" className="btn-grad mt-6 inline-block rounded-full px-6 py-3 text-sm font-medium text-white">Talk to HOMIQ</Link></div>}
            {projects.map((p) => (
              <Link key={p.id} href={`/projects/${p.slug}`} className="group overflow-hidden rounded-[28px] border border-line bg-card">
                <div className="relative h-72 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={projectPhoto(p.slug)} alt="Illustrative residential architecture" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  <span className="absolute left-5 top-5 rounded-full bg-paper/95 px-4 py-1.5 text-xs text-ink">{p.locality}</span><span className="absolute bottom-4 right-4 rounded-full bg-ink/85 px-3 py-1.5 text-[10px] text-white">Illustrative image</span>
                </div>
                <div className="p-7">
                  <h3 className="font-serif text-4xl font-semibold tracking-tight">{p.name}</h3>
                  <p className="mt-1 text-mute">{p.tagline}</p>
                  <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-line pt-5">
                    <div><p className="text-xs text-mute">Portfolio price range</p><p className="font-serif text-2xl font-semibold text-moss">{formatLakh(65)} – {formatLakh(120)}</p></div>
                    <div className="flex flex-wrap gap-2 text-xs">
                      {(p.configurations as string[] | undefined)?.map((c) => <span key={c} className="rounded-full bg-moss-soft px-3 py-1.5 text-moss">{c} BHK</span>)}
                      <span className="rounded-full border border-line px-3 py-1.5 text-mute">2 and 3 BHK</span>
                    </div>
                  </div>
                  <p className="mt-4 text-[11px] text-mute">Project-specific price, address and RERA details confirmed by the sales team.</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section id="visit" className="mx-auto mt-24 grid max-w-6xl scroll-mt-24 items-center gap-10 px-6 md:grid-cols-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={PHOTOS.interior} alt="Bright living room with a large window" className="h-[420px] w-full rounded-[28px] object-cover md:h-[520px]" />
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-moss">Visit in person</p>
            <h2 className="mt-3 font-serif text-5xl font-medium leading-none tracking-tight md:text-6xl">See the light before you decide.</h2>
            <p className="mt-6 max-w-md leading-relaxed text-mute">Choose a displayed time to request a visit. Until Company A publishes its confirmed schedule, available times are for demonstration; a sales advisor will confirm the appointment and location before you travel.</p>
            <ol className="mt-8 space-y-4">
              {steps.map(([h, d], i) => <li key={h} className="flex gap-4"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-moss-soft text-sm text-moss">{i + 1}</span><div><p className="font-medium">{h}</p><p className="text-sm leading-relaxed text-mute">{d}</p></div></li>)}
            </ol>
            <Link href="/chat" className="btn-grad mt-8 inline-block rounded-full px-8 py-4 text-sm font-medium text-white">Reserve a visit</Link>
          </div>
        </section>

        <section id="faq" className="mx-auto max-w-3xl scroll-mt-24 px-6 pt-28">
          <p className="text-xs uppercase tracking-[0.3em] text-moss">Questions</p>
          <h2 className="mt-3 font-serif text-5xl font-medium leading-none tracking-tight md:text-6xl">Good to know.</h2>
          <div className="mt-10 divide-y divide-line border-y border-line">
            {faqs.map(([q, a]) => (
              <details key={q} className="group py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium">{q}<span className="text-mute transition group-open:rotate-45">+</span></summary><p className="mt-3 max-w-2xl leading-relaxed text-mute">{a}</p></details>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
