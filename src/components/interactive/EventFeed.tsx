import { useState } from 'react'
import { events, sourceBadge, type EventSource, type DscStatus } from '../../data/events'
import { LinkButton } from '../ui/Button'

const filters: { label: string; value: EventSource | 'All' }[] = [
  { label: 'All', value: 'All' },
  { label: 'Lu.ma Global', value: 'Lu.ma Crypto' },
  { label: 'Team1', value: 'Team1' },
  { label: 'Side Events (Plan.wtf)', value: 'Plan.wtf' },
  { label: 'Grassroots (SWC)', value: 'Stand With Crypto' },
  { label: 'Campus', value: 'Campus' },
]

const statusStyle: Record<DscStatus, string> = {
  'Ambassadors Attending': 'text-gold',
  'Priority Circuit': 'text-cream',
  'Open Call': 'text-cream-wash',
}

export function EventFeed() {
  const [active, setActive] = useState<EventSource | 'All'>('All')

  const visible = active === 'All' ? events : events.filter((e) => e.source === active)

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter events by category">
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setActive(f.value)}
            aria-pressed={active === f.value}
            className={`label-mono border px-4 py-2 text-[0.65rem] transition-colors ${
              active === f.value
                ? 'border-cream bg-cream text-ink'
                : 'border-cream/25 text-cream-3 hover:border-cream/60'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="hairline mt-8 divide-y divide-cream/10 bg-ink">
        {visible.length === 0 ? (
          <p className="p-8 text-sm text-cream-wash/70">No events in this category right now.</p>
        ) : (
          visible.map((e) => (
            <div key={e.id} className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between md:p-8">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="label-mono border border-cream/25 px-2 py-0.5 text-[0.6rem] text-cream-wash">
                    {sourceBadge[e.source]}
                  </span>
                  <span className={`label-mono text-[0.62rem] ${statusStyle[e.dscStatus]}`}>
                    {e.dscStatus}
                  </span>
                </div>
                <h3 className="mt-2 font-display text-xl text-cream">{e.title}</h3>
                <p className="label-mono mt-2 text-[0.65rem] text-cream-3">
                  {e.date} &middot; {e.location}
                </p>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-cream-3">
                  {e.description}
                </p>
              </div>
              <div className="shrink-0">
                <LinkButton to={e.link} variant="ghost" className="!px-5 !py-2.5 whitespace-nowrap">
                  RSVP / Onboard
                </LinkButton>
              </div>
            </div>
          ))
        )}
      </div>

      <p className="label-mono mt-6 text-[0.62rem] text-cream-wash/70">
        Sample circuit — illustrative, not a live feed. Confirm dates directly at{' '}
        <a href="https://www.standwithcrypto.org" target="_blank" rel="noreferrer" className="underline decoration-cream-wash/40 underline-offset-2 hover:text-cream">
          standwithcrypto.org
        </a>
        ,{' '}
        <a href="https://plan.wtf" target="_blank" rel="noreferrer" className="underline decoration-cream-wash/40 underline-offset-2 hover:text-cream">
          plan.wtf
        </a>
        ,{' '}
        <a href="https://lu.ma/crypto" target="_blank" rel="noreferrer" className="underline decoration-cream-wash/40 underline-offset-2 hover:text-cream">
          lu.ma/crypto
        </a>
        , or{' '}
        <a href="https://lu.ma/Team1" target="_blank" rel="noreferrer" className="underline decoration-cream-wash/40 underline-offset-2 hover:text-cream">
          lu.ma/Team1
        </a>
        .
      </p>
    </div>
  )
}
