import { useState, type FormEvent } from 'react'
import { HairlineCard } from '../ui/HairlineCard'
import { Button } from '../ui/Button'
import { myEvents } from '../../data/dashboard'

function referralCode(name: string) {
  const base = name.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 6) || 'DSC'
  let hash = 0
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) % 9973
  return `${base}-${String(hash).padStart(4, '0')}`
}

function EventReportCard() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <HairlineCard>
      <p className="label-mono text-[0.68rem] text-gold">Event report</p>
      {submitted ? (
        <div role="status">
          <p className="mt-4 font-display text-lg text-cream">Report submitted for review.</p>
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
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label htmlFor="report-event" className="label-mono text-[0.62rem] text-cream-wash">
              Event
            </label>
            <select
              id="report-event"
              required
              className="hairline mt-1.5 w-full bg-ink px-3 py-2.5 text-sm text-cream focus-visible:outline-cream"
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
              rows={2}
              placeholder="Turnout, cards handed out, what worked"
              className="hairline mt-1.5 w-full resize-none bg-ink px-3 py-2.5 text-sm text-cream placeholder:text-cream-wash/40 focus-visible:outline-cream"
            />
          </div>
          <Button type="submit" variant="ghost" className="!px-5 !py-2.5 w-full">
            Submit report
          </Button>
        </form>
      )}
    </HairlineCard>
  )
}

const merchOptions = ['Membership cards', 'Flyers', 'Banners', 'Signage']

function MerchDropCard() {
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

  return (
    <HairlineCard>
      <p className="label-mono text-[0.68rem] text-gold">Merch drop</p>
      {submitted ? (
        <div role="status">
          <p className="mt-4 font-display text-lg text-cream">Request sent.</p>
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
      ) : (
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="grid grid-cols-2 gap-2">
            {merchOptions.map((item) => (
              <label
                key={item}
                className="hairline flex items-center gap-2 px-3 py-2.5 text-xs text-cream-2"
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
          <Button type="submit" variant="ghost" className="!px-5 !py-2.5 mt-4 w-full" disabled={selected.length === 0}>
            Request restock
          </Button>
        </form>
      )}
    </HairlineCard>
  )
}

const channels = [
  { key: 'telegram', label: 'Telegram group' },
  { key: 'discord', label: 'Discord voice channel' },
  { key: 'sync', label: 'Monthly SYNC call' },
] as const

function ChannelsCard() {
  const [requested, setRequested] = useState<Record<string, boolean>>({})

  return (
    <HairlineCard>
      <p className="label-mono text-[0.68rem] text-gold">Private channels</p>
      <p className="mt-2 text-sm text-cream-3">Request an invite — it lands in your email within minutes.</p>
      <div className="mt-4 space-y-2">
        {channels.map((c) => (
          <button
            key={c.key}
            type="button"
            disabled={requested[c.key]}
            onClick={() => setRequested((prev) => ({ ...prev, [c.key]: true }))}
            className={`label-mono flex w-full items-center justify-between border px-4 py-2.5 text-[0.65rem] transition-colors ${
              requested[c.key]
                ? 'cursor-default border-gold/40 text-gold'
                : 'border-cream/25 text-cream-3 hover:border-cream hover:text-cream'
            }`}
          >
            {c.label}
            <span>{requested[c.key] ? 'Requested ✓' : 'Join'}</span>
          </button>
        ))}
      </div>
    </HairlineCard>
  )
}

function ReferralLinkCard({ name }: { name: string }) {
  const [copied, setCopied] = useState(false)
  const code = referralCode(name)
  const link = `spenders.club/join?ref=${code}`

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(`https://${link}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard unavailable — link is still selectable/visible below
    }
  }

  return (
    <HairlineCard>
      <p className="label-mono text-[0.68rem] text-gold">Your referral link</p>
      <p className="mt-2 text-sm text-cream-3">
        Every member who joins through this link counts toward your onboarding total.
      </p>
      <div className="hairline mt-4 flex items-center justify-between gap-3 bg-ink px-4 py-3">
        <span className="label-mono truncate text-[0.68rem] text-cream">{link}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="label-mono shrink-0 text-[0.62rem] text-cream-wash underline underline-offset-4 hover:text-cream"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </HairlineCard>
  )
}

export function ActionModule({ name }: { name: string }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <EventReportCard />
      <MerchDropCard />
      <ChannelsCard />
      <ReferralLinkCard name={name} />
    </div>
  )
}
