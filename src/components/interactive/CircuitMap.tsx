import { useEffect, useState } from 'react'
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps'
import countries from 'world-atlas/countries-110m.json'
import type { GeoJsonObject } from 'geojson'
import {
  events,
  sourceBadge,
  resolveCoordinates,
  locationCountry,
  type CircuitEvent,
  type EventSource,
} from '../../data/events'
import { LinkButton, Button } from '../ui/Button'
import { useAmbassadorSession } from '../../context/useAmbassadorSession'
import { SignInModal } from '../hq/SignInModal'

/** Local, in-person chapter activity. Rendered as a solid cream dot. */
const GRASSROOTS_SOURCES: EventSource[] = ['Stand With Crypto', 'Campus']
/** Conference / hub circuit. Rendered as a hollow gold ring. */
const CIRCUIT_SOURCES: EventSource[] = ['Lu.ma Crypto', 'Team1', 'Plan.wtf']

/** Open-ocean anchor point for events with no single fixed location (virtual, TBD, rotating). */
const GLOBAL_MARKER_COORDINATES: [number, number] = [-150, 15]

type CircuitPin = {
  id: string
  location: string
  coordinates: [number, number]
  events: CircuitEvent[]
}

type Selection = { kind: 'pin'; id: string } | { kind: 'country'; name: string } | { kind: 'global' } | null

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

/** Distinct dashed-diamond marker for virtual / TBD / rotating-city events that have no single fixed point. */
function GlobalPinMarker({ count, isActive, onSelect }: { count: number; isActive: boolean; onSelect: () => void }) {
  return (
    <Marker
      coordinates={GLOBAL_MARKER_COORDINATES}
      onClick={onSelect}
      tabIndex={0}
      role="button"
      aria-pressed={isActive}
      aria-label={`Global and virtual events: ${count} event${count > 1 ? 's' : ''}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect()
        }
      }}
      className="group cursor-pointer outline-none"
    >
      {/* Invisible filled hit-target: an unfilled shape only hit-tests along its stroke, and this outline is too thin/hollow to reliably catch a center click otherwise. */}
      <circle r={6} fill="transparent" />
      <rect x={-4} y={-4} width={8} height={8} fill="none" stroke="#F3EDE3" strokeWidth={1} strokeDasharray="2,1.5" transform="rotate(45)" />
      {isActive && <rect x={-7} y={-7} width={14} height={14} fill="none" stroke="#F3EDE3" strokeWidth={1} transform="rotate(45)" />}
      <text
        textAnchor="middle"
        y={-12}
        fontSize={9}
        fontFamily="'JetBrains Mono', ui-monospace, monospace"
        fill="#C4B8A4"
        className="pointer-events-none opacity-0 transition-opacity duration-150 group-hover:opacity-100"
      >
        Global / Virtual ({count})
      </text>
    </Marker>
  )
}

type CircuitMapProps = {
  active: EventSource | 'All'
  onSelectEvents: (ids: string[]) => void
}

export function CircuitMap({ active, onSelectEvents }: CircuitMapProps) {
  const [selection, setSelection] = useState<Selection>(null)
  const [requestedIds, setRequestedIds] = useState<Set<string>>(new Set())
  const [signInOpen, setSignInOpen] = useState(false)
  const { session } = useAmbassadorSession()

  const filteredEvents = active === 'All' ? events : events.filter((e) => e.source === active)
  const pins = buildPins(filteredEvents)
  const globalEvents = filteredEvents.filter((e) => !resolveCoordinates(e.location))

  // Filter changed out from under a pin selection, clear it.
  useEffect(() => {
    if (selection?.kind === 'pin' && !pins.some((p) => p.id === selection.id)) {
      setSelection(null)
      onSelectEvents([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  let selectedEvents: CircuitEvent[] = []
  let selectedLabel = ''
  let emptySelectionMessage = "Click a pin, marker, or country to see who's showing up there."
  if (selection?.kind === 'pin') {
    const pin = pins.find((p) => p.id === selection.id)
    selectedEvents = pin?.events ?? []
    selectedLabel = pin?.location ?? ''
  } else if (selection?.kind === 'country') {
    selectedEvents = filteredEvents.filter((e) => locationCountry[e.location] === selection.name)
    selectedLabel = selection.name
    emptySelectionMessage = `No plotted activations in ${selection.name} for this filter yet.`
  } else if (selection?.kind === 'global') {
    selectedEvents = globalEvents
    selectedLabel = 'Global / Virtual'
  }

  function selectPin(pin: CircuitPin) {
    setSelection({ kind: 'pin', id: pin.id })
    onSelectEvents(pin.events.map((e) => e.id))
  }

  function selectCountry(name: string | undefined) {
    if (!name) return
    const ids = filteredEvents.filter((e) => locationCountry[e.location] === name).map((e) => e.id)
    setSelection({ kind: 'country', name })
    onSelectEvents(ids)
  }

  function selectGlobal() {
    setSelection({ kind: 'global' })
    onSelectEvents(globalEvents.map((e) => e.id))
  }

  function handleRequestToAttend(eventId: string) {
    if (!session) {
      setSignInOpen(true)
      return
    }
    setRequestedIds((prev) => new Set(prev).add(eventId))
  }

  return (
    <div className="hairline glass-card p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="label-mono text-[0.68rem] text-cream-wash">Circuit map</p>
        <div className="flex flex-wrap gap-4 text-xs text-cream-3">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cream" /> Grassroots (SWC / Campus)
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full border border-gold" /> Circuit (Lu.ma / Team1)
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rotate-45 border border-cream" style={{ borderStyle: 'dashed' }} /> Global / virtual
          </span>
        </div>
      </div>

      <div className="relative mt-6 aspect-[2/1] w-full overflow-hidden rounded-xl hairline bg-bg">
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
                  onClick={() => selectCountry(geo.properties?.name)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Show events in ${geo.properties?.name ?? 'this country'}`}
                  className="cursor-pointer fill-surface-2 stroke-cream/15 outline-none transition-colors duration-200 hover:fill-[#1f1f1f]"
                />
              ))
            }
          </Geographies>

          {pins.map((pin) => (
            <CircuitPinMarker
              key={pin.id}
              pin={pin}
              isActive={selection?.kind === 'pin' && selection.id === pin.id}
              onSelect={() => selectPin(pin)}
            />
          ))}

          {globalEvents.length > 0 && (
            <GlobalPinMarker
              count={globalEvents.length}
              isActive={selection?.kind === 'global'}
              onSelect={selectGlobal}
            />
          )}
        </ComposableMap>
      </div>

      <div className="mt-6 min-h-[7rem] rounded-xl hairline bg-ink p-5">
        {selectedEvents.length > 0 ? (
          <div className="animate-tick flex flex-col gap-5">
            {selectedLabel && (
              <p className="label-mono text-[0.6rem] text-cream-wash/70">
                {selectedEvents.length} event{selectedEvents.length > 1 ? 's' : ''} &middot; {selectedLabel}
              </p>
            )}
            {selectedEvents.map((e) => (
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
                <div className="flex shrink-0 flex-wrap gap-2">
                  <LinkButton to={e.link} variant="ghost" className="!px-5 !py-2.5 whitespace-nowrap">
                    RSVP / Onboard
                  </LinkButton>
                  <Button
                    type="button"
                    variant={requestedIds.has(e.id) ? 'ghost' : 'solid'}
                    disabled={requestedIds.has(e.id)}
                    onClick={() => handleRequestToAttend(e.id)}
                    className="!px-5 !py-2.5 whitespace-nowrap"
                  >
                    {requestedIds.has(e.id) ? 'Requested ✓' : 'Request to Attend'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-cream-wash/70">{emptySelectionMessage}</p>
        )}
      </div>

      <SignInModal open={signInOpen} onClose={() => setSignInOpen(false)} />
    </div>
  )
}
