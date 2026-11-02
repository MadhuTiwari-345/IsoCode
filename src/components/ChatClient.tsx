'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import Link from 'next/link'
import { useSession } from './AuthMenu'
import { LANGS, t, type Lang } from '@/lib/chat-i18n'
import { askQuestion, bookVisit, chooseOption, registerBuyer, type Chip, type Ctx, type Reply, type SlotOption } from '@/app/(frontend)/chat/actions'

type Msg = { role: 'assistant' | 'buyer'; text: string }
type Step = 'lang' | 'register' | 'flow'

export default function ChatClient() {
  const me = useSession()
  const [msgs, setMsgs] = useState<Msg[]>([{ role: 'assistant', text: t('en', 'greet') }])
  const [ctx, setCtx] = useState<Ctx>({ lang: 'en' })
  const [step, setStep] = useState<Step>('lang')
  const [chips, setChips] = useState<Chip[]>([])
  const [slots, setSlots] = useState<SlotOption[]>([])
  const [code, setCode] = useState<string>()
  const [error, setError] = useState<string>()
  const [text, setText] = useState('')
  const [form, setForm] = useState({ name: '', phone: '', consent: false, wa: false })
  const [pending, start] = useTransition()
  const end = useRef<HTMLDivElement>(null)
  const lang = ctx.lang

  useEffect(() => { if (me && !me.staff) setForm((f) => ({ ...f, name: f.name || me.name, phone: f.phone || me.phone })) }, [me])
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }) }, [msgs, chips, slots, step, code])

  const apply = (r: Reply, buyer?: string) => {
    if (!r.ok) { setError(r.error); return }
    setError(undefined)
    setCtx(r.ctx)
    setMsgs((m) => [...m, ...(buyer ? [{ role: 'buyer' as const, text: buyer }] : []), ...r.messages.map((x) => ({ role: 'assistant' as const, text: x }))])
    setChips(r.chips ?? [])
    setSlots(r.slots ?? [])
    if (r.bookingCode) setCode(r.bookingCode)
  }

  const pickLang = (l: Lang, label: string) => {
    setCtx({ lang: l })
    setMsgs((m) => [...m, { role: 'buyer', text: label }, { role: 'assistant', text: t(l, 'askRegister') }])
    setStep('register')
  }

  const submitRegister = (e: React.FormEvent) => {
    e.preventDefault()
    const src = new URLSearchParams(window.location.search).get('src') ?? undefined
    start(async () => {
      const r = await registerBuyer({ ctx, name: form.name, phone: form.phone, consent: form.consent, whatsapp: form.wa, source: src })
      if (r.ok) setStep('flow')
      apply(r, r.ok ? `${form.name} · ${form.phone}` : undefined)
    })
  }

  const choose = (c: Chip) => start(async () => apply(await chooseOption({ ctx, action: c.action, value: c.value, label: c.label }), c.label || undefined))
  const book = (s: SlotOption) => start(async () => { const r = await bookVisit({ ctx, slotId: s.id, label: s.label }); apply(r, r.ok ? s.label : undefined) })
  const ask = (e: React.FormEvent) => {
    e.preventDefault()
    const q = text.trim()
    if (!q) return
    setText('')
    start(async () => apply(await askQuestion({ ctx, text: q }), q))
  }

  const chipCls = 'rounded-full border border-line bg-card px-4 py-2 text-sm text-ink transition hover:border-moss hover:bg-moss-soft disabled:opacity-50'
  const input = 'w-full rounded-xl border border-line bg-card px-4 py-3 text-[15px] outline-none transition focus:border-moss'

  return (
    <div className="mx-auto flex h-[calc(100dvh-10rem)] min-h-[480px] max-w-2xl flex-col px-3 pb-[env(safe-area-inset-bottom)] sm:px-4">
      <div className="mt-4 flex items-center justify-between rounded-2xl border border-line bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-ink text-sm font-semibold text-white">H</span>
          <div><p className="text-sm font-semibold tracking-wide">HOMIQ concierge</p><p className="mt-0.5 text-[11px] text-mute">Verified project information · Ahmedabad</p></div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-moss-soft px-3 py-1.5 text-[10px] font-medium text-moss"><span className="h-1.5 w-1.5 rounded-full bg-moss" /> Here to help</span>
      </div>
      <div className="flex-1 space-y-5 overflow-y-auto overscroll-contain py-6 sm:py-8">
        {msgs.map((m, i) => (
          <div key={i} className={`rise flex ${m.role === 'buyer' ? 'justify-end' : 'justify-start'}`}>
            <p className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-3.5 text-[14px] leading-relaxed shadow-[0_2px_10px_rgba(27,41,39,0.04)] sm:px-5 sm:text-[15px] ${m.role === 'buyer' ? 'bg-moss text-white' : 'border border-line bg-card text-ink'}`}>{m.text}</p>
          </div>
        ))}

        {step === 'lang' && (
          <div className="rise flex flex-wrap gap-2">
            {LANGS.map((l) => <button key={l.code} className={chipCls} onClick={() => pickLang(l.code, l.label)}>{l.label}</button>)}
          </div>
        )}

        {step === 'register' && (
          <form onSubmit={submitRegister} className="rise space-y-3 rounded-2xl border border-line bg-white p-4 shadow-sm sm:p-5">
            <input className={input} placeholder={t(lang, 'name')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" aria-label={t(lang, 'name')} />
            <input className={input} placeholder={t(lang, 'phone')} inputMode="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} autoComplete="tel" aria-label={t(lang, 'phone')} />
            <label className="flex gap-3 text-[13px] leading-snug text-mute"><input type="checkbox" className="mt-0.5 accent-[#6d5efc]" checked={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.checked })} />{t(lang, 'consent')}</label>
            <label className="flex gap-3 text-[13px] leading-snug text-mute"><input type="checkbox" className="mt-0.5 accent-[#6d5efc]" checked={form.wa} onChange={(e) => setForm({ ...form, wa: e.target.checked })} />{t(lang, 'wa')}</label>
            {error && <p role="alert" className="text-sm text-clay">{error}</p>}
            <button type="button" onClick={() => { setMsgs((m) => m.slice(0, -2)); setStep('lang'); setError(undefined) }} className="w-full text-center text-sm text-mute underline underline-offset-4 hover:text-ink">← Change language</button>
            <button disabled={pending} className="w-full rounded-xl btn-grad py-3 text-sm font-medium text-white transition hover:brightness-110 disabled:opacity-60">{t(lang, 'start')}</button>
          </form>
        )}

        {slots.length > 0 && !code && (
          <div className="rise space-y-4">
            {Object.entries(slots.reduce<Record<string, SlotOption[]>>((acc, x) => { (acc[x.day] ??= []).push(x); return acc }, {})).map(([day, list]) => (
              <div key={day}>
                <p className="mb-2 text-xs uppercase tracking-wider text-mute">{day}</p>
                <div className="flex flex-wrap gap-2">
                  {list.map((x) => <button key={x.id} disabled={pending} onClick={() => book(x)} className="rounded-xl border border-line bg-card px-4 py-2.5 text-sm transition hover:border-moss hover:bg-moss-soft disabled:opacity-50">{x.time}</button>)}
                </div>
              </div>
            ))}
            <button disabled={pending} onClick={() => choose({ label: '', action: 'back' })} className="text-sm text-mute underline underline-offset-4 hover:text-ink">← Back to options</button>
          </div>
        )}

        {chips.length > 0 && !code && (
          <div className="rise flex flex-wrap gap-2">{chips.map((c) => <button key={c.label} disabled={pending} className={c.action === 'human' ? 'px-2 py-2 text-sm text-mute underline underline-offset-4 hover:text-ink' : chipCls} onClick={() => choose(c)}>{c.label}</button>)}</div>
        )}

        {code && (
          <Link href={`/visit/${code}`} className="rise inline-block rounded-xl btn-grad px-5 py-3 text-sm font-medium text-white hover:brightness-110">View confirmation and site pin</Link>
        )}
        {pending && <p className="text-sm text-mute" aria-live="polite">…</p>}
        {error && step !== 'register' && <p role="alert" className="text-sm text-clay">{error}</p>}
        <div ref={end} />
      </div>

      {step === 'flow' && !code && (
        <form onSubmit={ask} className="sticky bottom-0 flex gap-2 border-t border-line bg-paper/95 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur">
          <input className={`${input} min-w-0 bg-white`} value={text} onChange={(e) => setText(e.target.value)} placeholder={t(lang, 'inputPh')} aria-label={t(lang, 'inputPh')} />
          <button disabled={pending} className="rounded-xl bg-ink px-5 text-sm font-medium text-white transition hover:bg-moss disabled:opacity-60">{t(lang, 'send')}</button>
        </form>
      )}
    </div>
  )
}
