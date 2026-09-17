import { useEffect, useState } from 'react'
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps'
import countries from 'world-atlas/countries-110m.json'
import type { GeoJsonObject } from 'geojson'
import {
  events,
  sourceBadge,
  resolveCoordinates,
  type CircuitEvent,
  type EventSource,
} from '../../data/events'
import { LinkButton } from '../ui/Button'

/** Local, in-person chapter activity. Rendered as a solid cream dot. */
const GRASSROOTS_SOURCES: EventSource[] = ['Stand With Crypto', 'Campus']
/** Conference / hub circuit. Rendered as a hollow gold ring. */
const CIRCUIT_SOURCES: EventSource[] = ['Lu.ma Crypto', 'Team1', 'Plan.wtf']

type CircuitPin = {
  id: string
  location: string
  coordinates: [number, number]
  events: CircuitEvent[]
}

function buildPins(list: CircuitEvent[]): CircuitPin[] {
  const byLocation = new Map<string, CircuitPin>()
  for (const e of list) {
    const coordinates = resolveCoordinates(e.location)
    if (!coordinates) continue
    const existing = byLocation.get(e.location)
    if (existing) {
      existing.events.push(e)
    } else {
      byLocation.set(e.location, { id: e.location, location: e.location, coordinates, events: [e] })
    }
  }
  return Array.from(byLocation.values())
}

function CircuitPinMarker({
  pin,
  isActive,
  onSelect,
}: {
  pin: CircuitPin
  isActive: boolean
  onSelect: () => void
}) {
  const hasGrassroots = pin.events.some((e) => GRASSROOTS_SOURCES.includes(e.source))
  const hasCircuit = pin.events.some((e) => CIRCUIT_SOURCES.includes(e.source))
  const pulseColor = hasCircuit ? '#C4A574' : '#F3EDE3'

  return (
    <Marker
      coordinates={pin.coordinates}
      onClick={onSelect}
      tabIndex={0}
      role="button"
      aria-pressed={isActive}
      aria-label={`${pin.location}: ${pin.events.length} event${pin.events.length > 1 ? 's' : ''}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect()
        }
      }}
      className="group cursor-pointer outline-none"
    >
      <circle r={3} fill="none" stroke={pulseColor} strokeWidth={1} opacity={0.6}>
        <animate attributeName="r" values="3;9" dur="1.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.55;0" dur="1.8s" repeatCount="indefinite" />
      </circle>
      {hasCircuit && <circle r={4} fill="none" stroke="#C4A574" strokeWidth={1.4} />}
      {hasGrassroots && <circle r={hasCircuit ? 2 : 3.2} fill="#F3EDE3" />}
      {isActive && <circle r={7.5} fill="none" stroke="#F3EDE3" strokeWidth={1} />}
      <text
        textAnchor="middle"
        y={-10}
        fontSize={9}
        fontFamily="'JetBrains Mono', ui-monospace, monospace"
        fill="#C4B8A4"
        className="pointer-events-none opacity-0 transition-opacity duration-150 group-hover:opacity-100"
      >
        {pin.location}
        {pin.events.length > 1 ? ` (${pin.events.length})` : ''}
      </text>
    </Marker>
  )
}

type CircuitMapProps = {
  active: EventSource | 'All'
  onSelectEvents: (ids: string[]) => void
}

export function CircuitMap({ active, onSelectEvents }: CircuitMapProps) {
  const [activePinId, setActivePinId] = useState<string | null>(null)

  const filteredEvents = active === 'All' ? events : events.filter((e) => e.source === active)
  const pins = buildPins(filteredEvents)
  const plottedCount = pins.reduce((n, p) => n + p.events.length, 0)
  const offMapCount = filteredEvents.length - plottedCount
  const selectedPin = pins.find((p) => p.id === activePinId) ?? null

  // Filter changed out from under the current selection, clear it.
  useEffect(() => {
    if (activePinId && !pins.some((p) => p.id === activePinId)) {
      setActivePinId(null)
      onSelectEvents([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  function handleSelect(pin: CircuitPin) {
    setActivePinId(pin.id)
    onSelectEvents(pin.events.map((e) => e.id))
  }

  return (
    <div className="hairline glass-card p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="label-mono text-[0.68rem] text-cream-wash">Circuit map</p>
        <div className="flex gap-4 text-xs text-cream-3">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cream" /> Grassroots (SWC / Campus)
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full border border-gold" /> Circuit (Lu.ma / Team1)
          </span>
        </div>
      </div>

      <div className="relative mt-6 aspect-[2/1] w-full overflow-hidden hairline bg-bg">
        <ComposableMap
          projection="geoEqualEarth"
          projectionConfig={{ scale: 148 }}
          width={800}
          height={400}
          style={{ width: '100%', height: '100%' }}
        >
          <Geographies geography={countries as unknown as GeoJsonObject}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  strokeWidth={0.5}
                  className="fill-surface-2 stroke-cream/15 outline-none transition-colors duration-200 hover:fill-[#1f1f1f]"
                />
              ))
            }
          </Geographies>

          {pins.map((pin) => (
            <CircuitPinMarker
              key={pin.id}
              pin={pin}
              isActive={activePinId === pin.id}
              onSelect={() => handleSelect(pin)}
            />
          ))}
        </ComposableMap>
      </div>

      <div className="mt-6 min-h-[7rem] hairline bg-ink p-5">
        {selectedPin ? (
          <div className="animate-tick flex flex-col gap-5">
            {selectedPin.events.map((e) => (
              <div
                key={e.id}
                className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <span className="label-mono border border-cream/25 px-2 py-0.5 text-[0.6rem] text-cream-wash">
                    {sourceBadge[e.source]}
                  </span>
                  <p className="mt-2 font-display text-lg text-cream">{e.title}</p>
                  <p className="label-mono mt-1 text-[0.62rem] text-cream-wash">
                    {e.location} &mdash; {e.date}
                  </p>
                </div>
                <LinkButton
                  to={e.link}
                  variant="ghost"
                  className="!px-5 !py-2.5 shrink-0 whitespace-nowrap"
                >
                  RSVP / Onboard
                </LinkButton>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-cream-wash/70">
            Click a pin to see who&rsquo;s showing up there.
          </p>
        )}
      </div>

      {offMapCount > 0 && (
        <p className="label-mono mt-4 text-[0.6rem] text-cream-wash/60">
          +{offMapCount} {offMapCount === 1 ? 'event runs' : 'events run'} virtually or across
          rotating cities and {offMapCount === 1 ? "isn't" : "aren't"} pinned above.
        </p>
      )}
    </div>
  )
}
