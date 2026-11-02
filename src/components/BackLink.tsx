import Link from 'next/link'

export default function BackLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link href={href} className="mb-6 inline-flex items-center gap-2 text-sm text-mute transition hover:text-ink"><span aria-hidden>←</span>{children}</Link>
}
