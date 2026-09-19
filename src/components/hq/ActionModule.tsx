import { useState, type FormEvent } from 'react'
import { Button } from '../ui/Button'
import { myEvents } from '../../data/dashboard'

function referralCode(name: string) {
  const base = name.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 6) || 'DSC'
  let hash = 0
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) % 9973
  return `${base}-${String(hash).padStart(4, '0')}`
}

const TABS = [
  { key: 'event-report', label: 'Submit Event Report' },
  { key: 'merch', label: 'Request Merch Restock' },
  { key: 'community', label: 'Community & Links' },
] as const

type TabKey = (typeof TABS)[number]['key']

function EventReportForm() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div role="status">
        <p className="font-display text-xl text-cream">Report submitted for review.</p>
        <p className="mt-2 text-sm text-cream-3">
          It&rsquo;ll show up in Event Reports once your lead signs off.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="label-mono mt-4 text-[0.65rem] text-cream-wash underline underline-offset-4 hover:text-cream"
        >
          Submit another
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
      <div>
        <label htmlFor="report-event" className="label-mono text-[0.62rem] text-cream-wash">
          Event
        </label>
        <select
          id="report-event"
          required
          className="mt-2 w-full rounded-lg bg-white/[0.04] px-4 py-3 text-sm text-cream focus-visible:outline-cream"
          defaultValue=""
        >
          <option value="" disabled>
            Select an event
          </option>
          {myEvents.map((e) => (
            <option key={e.title} value={e.title}>
              {e.title}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="report-notes" className="label-mono text-[0.62rem] text-cream-wash">
          Notes
        </label>
        <textarea
          id="report-notes"
          required
          rows={3}
          placeholder="Turnout, cards handed out, what worked"
          className="mt-2 w-full resize-none rounded-lg bg-white/[0.04] px-4 py-3 text-sm text-cream placeholder:text-cream-wash/40 focus-visible:outline-cream"
        />
      </div>
      <Button type="submit" variant="ghost" className="!px-6">
        Submit report
      </Button>
    </form>
  )
}

const merchOptions = ['Membership cards', 'Flyers', 'Banners', 'Signage']

function MerchDropForm() {
  const [submitted, setSubmitted] = useState(false)
  const [selected, setSelected] = useState<string[]>([])

  function toggle(item: string) {
    setSelected((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]))
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (selected.length === 0) return
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div role="status">
        <p className="font-display text-xl text-cream">Request sent.</p>
        <p className="mt-2 text-sm text-cream-3">
          Restock ships within 5&ndash;7 days to your address on file.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false)
            setSelected([])
          }}
          className="label-mono mt-4 text-[0.65rem] text-cream-wash underline underline-offset-4 hover:text-cream"
        >
          Request more
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl">
      <div className="grid grid-cols-2 gap-2">
        {merchOptions.map((item) => (
          <label
            key={item}
            className="flex items-center gap-2.5 rounded-lg bg-white/[0.04] px-4 py-3 text-sm text-cream-2 transition-colors hover:bg-white/[0.07]"
          >
            <input
              type="checkbox"
              checked={selected.includes(item)}
              onChange={() => toggle(item)}
              className="h-3.5 w-3.5 accent-[#F3EDE3]"
            />
            {item}
          </label>
        ))}
      </div>
      <Button type="submit" variant="ghost" className="!px-6 mt-5" disabled={selected.length === 0}>
        Request restock
      </Button>
    </form>
  )
}

const channels = [
  { key: 'telegram', label: 'Telegram group' },
  { key: 'discord', label: 'Discord voice channel' },
  { key: 'sync', label: 'Monthly SYNC call' },
] as const

function CommunityLinks({ name }: { name: string }) {
  const [requested, setRequested] = useState<Record<string, boolean>>({})
  const [copied, setCopied] = useState(false)
  const code = referralCode(name)
  const link = `spenders.club/join?ref=${code}`

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(`https://${link}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard unavailable, link is still selectable/visible below
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div>
        <p className="label-mono text-[0.68rem] text-gold">Private channels</p>
        <p className="mt-2 text-sm text-cream-3">Request an invite. It lands in your email within minutes.</p>
        <div className="mt-4 space-y-2">
          {channels.map((c) => (
            <button
              key={c.key}
              type="button"
              disabled={requested[c.key]}
              onClick={() => setRequested((prev) => ({ ...prev, [c.key]: true }))}
              className={`label-mono flex w-full items-center justify-between rounded-lg px-4 py-3 text-[0.65rem] transition-colors ${
                requested[c.key]
                  ? 'cursor-default bg-white/[0.04] text-gold'
                  : 'bg-white/[0.04] text-cream-3 hover:bg-white/[0.08] hover:text-cream'
              }`}
            >
              {c.label}
              <span>{requested[c.key] ? 'Requested ✓' : 'Join'}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="label-mono text-[0.68rem] text-gold">Your referral link</p>
        <p className="mt-2 text-sm text-cream-3">
          Every member who joins through this link counts toward your onboarding total.
        </p>
        <div className="mt-4 flex items-center justify-between gap-3 rounded-lg bg-white/[0.04] px-4 py-3.5">
          <span className="label-mono truncate text-[0.68rem] text-cream">{link}</span>
          <button
            type="button"
            onClick={handleCopy}
            className="label-mono shrink-0 text-[0.62rem] text-cream-wash underline underline-offset-4 hover:text-cream"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  )
}

export function ActionModule({ name }: { name: string }) {
  const [tab, setTab] = useState<TabKey>('event-report')

  return (
    <div>
      <div className="inline-flex flex-wrap gap-1 rounded-full bg-white/[0.04] p-1" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={`label-mono rounded-full px-4 py-2 text-[0.65rem] transition-colors ${
              tab === t.key ? 'bg-cream text-ink' : 'text-cream-3 hover:text-cream'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="hairline glass-card mt-5 rounded-2xl p-8 md:p-10">
        {tab === 'event-report' && <EventReportForm />}
        {tab === 'merch' && <MerchDropForm />}
        {tab === 'community' && <CommunityLinks name={name} />}
      </div>
    </div>
  )
}
