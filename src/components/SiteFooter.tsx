import Link from 'next/link'

export default function SiteFooter() {
  return (
    <footer className="mt-28 bg-ink text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div><p className="font-serif text-4xl font-semibold">HOMIQ</p><p className="mt-3 max-w-xs text-sm text-white/60">Thoughtful residences in Ahmedabad. Explore 2 and 3 BHK homes and book a visit in your language.</p></div>
        <div className="text-sm"><p className="text-white/50">Explore</p><ul className="mt-4 space-y-2"><li><Link href="/projects">Projects</Link></li><li><Link href="/chat">Chat with us</Link></li><li><Link href="/#faq">Questions</Link></li></ul></div>
        <div className="text-sm"><p className="text-white/50">Account</p><ul className="mt-4 space-y-2"><li><Link href="/login">Sign in</Link></li><li><Link href="/signup">Create account</Link></li><li><Link href="/sales-team">Sales team</Link></li></ul></div>
        <div className="text-sm"><p className="text-white/50">Your data</p><p className="mt-4 text-xs leading-relaxed text-white/60">We process personal data under the DPDP Act, 2023, contact you only with your consent, and message on WhatsApp only if you opt in. Verify project registration on GujRERA. Prices are indicative.</p></div>
      </div>
    </footer>
  )
}
