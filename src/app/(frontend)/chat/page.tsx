import Link from 'next/link'
import ChatClient from '@/components/ChatClient'
import SiteHeader from '@/components/SiteHeader'

export const metadata = { title: 'Chat with us | Company A' }

export default function ChatPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-[calc(100dvh-4rem)] bg-paper">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 pt-5">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-mute transition hover:text-ink"><span aria-hidden>←</span>Home</Link>
          <a href="/chat" className="text-xs text-mute underline underline-offset-4 hover:text-ink">Start over</a>
        </div>
        <ChatClient />
      </main>
    </>
  )
}
