import { useState } from 'react'

type Pin = {
  id: string
  x: number
  y: number
  label: string
  kind: 'swc' | 'conference'
  note: string
}

const pins: Pin[] = [
  { id: 'nyc', x: 27, y: 34, label: 'New York', kind: 'swc', note: 'Weekly SWC gatherings and founder meetups across the boroughs.' },
  { id: 'austin', x: 19, y: 47, label: 'Austin', kind: 'swc', note: 'Grassroots SWC circuit with a heavy builder and hackathon presence.' },
  { id: 'sf', x: 8, y: 38, label: 'San Francisco', kind: 'swc', note: 'SWC chapter activity alongside major builder conferences.' },
  { id: 'miami', x: 26, y: 55, label: 'Miami', kind: 'conference', note: 'Conference-heavy circuit — high tourist and delegate density.' },
  { id: 'denver', x: 18, y: 39, label: 'Denver', kind: 'conference', note: 'Home turf for ETHDenver and adjacent builder week activity.' },
  { id: 'dc', x: 29, y: 40, label: 'Washington, D.C.', kind: 'swc', note: 'Where SWC meets legislators, policy teams, and advocacy groups.' },
  { id: 'london', x: 47, y: 30, label: 'London', kind: 'conference', note: 'European conference circuit anchor, high ambassador coverage.' },
  { id: 'dubai', x: 61, y: 46, label: 'Dubai', kind: 'conference', note: 'Regional hub for token and infrastructure conferences.' },
  { id: 'singapore', x: 78, y: 62, label: 'Singapore', kind: 'conference', note: 'Token2049-adjacent circuit, strong builder-club density.' },
]

export function SWCHeatMap() {
  const [active, setActive] = useState<Pin | null>(null)

  return (
    <div className="hairline bg-surface/40 p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="label-mono text-[0.68rem] text-cream-wash">Circuit map</p>
        <div className="flex gap-4 text-xs text-cream-3">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cream" /> Local SWC
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full border border-gold" /> Conference circuit
          </span>
        </div>
      </div>

      <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden hairline bg-ink">
        <svg viewBox="0 0 100 56.25" className="absolute inset-0 h-full w-full opacity-40">
          <defs>
            <pattern id="dots" width="2.6" height="2.6" patternUnits="userSpaceOnUse">
              <circle cx="0.5" cy="0.5" r="0.35" fill="#F3EDE3" opacity="0.35" />
            </pattern>
          </defs>
          <rect width="100" height="56.25" fill="url(#dots)" />
        </svg>

        {pins.map((pin) => (
          <button
            key={pin.id}
            type="button"
            style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
            onClick={() => setActive(pin)}
            aria-pressed={active?.id === pin.id}
            className="group absolute -translate-x-1/2 -translate-y-1/2"
          >
            <span
              className={`block h-2.5 w-2.5 rounded-full transition-transform group-hover:scale-125 ${
                pin.kind === 'swc' ? 'bg-cream' : 'border border-gold bg-ink'
              } ${active?.id === pin.id ? 'ring-2 ring-cream ring-offset-2 ring-offset-ink' : ''}`}
            />
            <span className="label-mono pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap text-[0.55rem] text-cream-wash opacity-0 transition-opacity group-hover:opacity-100">
              {pin.label}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-6 min-h-[4.5rem] hairline bg-ink p-5">
        {active ? (
          <div className="animate-tick">
            <p className="font-display text-lg text-cream">{active.label}</p>
            <p className="mt-1 text-sm text-cream-3">{active.note}</p>
            <p className="label-mono mt-2 text-[0.65rem] text-cream-wash">
              Ambassadors near this circuit represent the club and onboard IRL.
            </p>
          </div>
        ) : (
          <p className="text-sm text-cream-wash/70">Click a pin to see how ambassadors show up there.</p>
        )}
      </div>
    </div>
  )
}
