import { useState } from 'react'
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps'
import countries from 'world-atlas/countries-110m.json'
import type { GeoJsonObject } from 'geojson'

type CircuitPin = {
  id: string
  city: string
  region: string
  coordinates: [number, number]
  kind: 'swc' | 'conference'
  nextEvent: string
  nextEventDate: string
  action: 'IRL Onboarding' | 'Panel Presence' | 'Local Chapter Activation'
}

const pins: CircuitPin[] = [
  {
    id: 'nyc',
    city: 'New York',
    region: 'United States',
    coordinates: [-74.006, 40.7128],
    kind: 'swc',
    nextEvent: 'Local SWC chapter meetup',
    nextEventDate: 'Ongoing, monthly',
    action: 'Local Chapter Activation',
  },
  {
    id: 'denver',
    city: 'Denver',
    region: 'United States',
    coordinates: [-104.9903, 39.7392],
    kind: 'conference',
    nextEvent: 'ETHDenver builder week',
    nextEventDate: 'February 2026',
    action: 'IRL Onboarding',
  },
  {
    id: 'sf',
    city: 'San Francisco',
    region: 'United States',
    coordinates: [-122.4194, 37.7749],
    kind: 'swc',
    nextEvent: 'SWC regional meetup',
    nextEventDate: 'Ongoing, monthly',
    action: 'Local Chapter Activation',
  },
  {
    id: 'london',
    city: 'London',
    region: 'United Kingdom',
    coordinates: [-0.1278, 51.5074],
    kind: 'conference',
    nextEvent: 'European builder circuit',
    nextEventDate: 'Ongoing',
    action: 'Panel Presence',
  },
  {
    id: 'paris',
    city: 'Paris',
    region: 'France',
    coordinates: [2.3522, 48.8566],
    kind: 'conference',
    nextEvent: 'European conference season',
    nextEventDate: 'Q2 2026',
    action: 'Panel Presence',
  },
  {
    id: 'dubai',
    city: 'Dubai',
    region: 'United Arab Emirates',
    coordinates: [55.2708, 25.2048],
    kind: 'conference',
    nextEvent: 'Token & infrastructure summit circuit',
    nextEventDate: 'Q1 2026',
    action: 'IRL Onboarding',
  },
  {
    id: 'singapore',
    city: 'Singapore',
    region: 'Singapore',
    coordinates: [103.8198, 1.3521],
    kind: 'conference',
    nextEvent: 'Token2049',
    nextEventDate: 'Q3 2026',
    action: 'Panel Presence',
  },
  {
    id: 'tokyo',
    city: 'Tokyo',
    region: 'Japan',
    coordinates: [139.6503, 35.6762],
    kind: 'conference',
    nextEvent: 'Asia builder week',
    nextEventDate: 'Ongoing',
    action: 'IRL Onboarding',
  },
  {
    id: 'seoul',
    city: 'Seoul',
    region: 'South Korea',
    coordinates: [126.978, 37.5665],
    kind: 'conference',
    nextEvent: 'Korea Blockchain Week',
    nextEventDate: 'Ongoing',
    action: 'Panel Presence',
  },
]

function CircuitPinMarker({
  pin,
  isActive,
  onSelect,
}: {
  pin: CircuitPin
  isActive: boolean
  onSelect: () => void
}) {
  const ringColor = pin.kind === 'swc' ? '#F3EDE3' : '#C4A574'

  return (
    <Marker
      coordinates={pin.coordinates}
      onClick={onSelect}
      tabIndex={0}
      role="button"
      aria-pressed={isActive}
      aria-label={`${pin.city} circuit pin`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect()
        }
      }}
      className="group cursor-pointer outline-none"
    >
      <circle r={3} fill="none" stroke={ringColor} strokeWidth={1} opacity={0.6}>
        <animate attributeName="r" values="3;9" dur="1.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.55;0" dur="1.8s" repeatCount="indefinite" />
      </circle>
      <circle
        r={3.2}
        fill={pin.kind === 'swc' ? '#F3EDE3' : '#0A0A0A'}
        stroke={pin.kind === 'conference' ? '#C4A574' : 'none'}
        strokeWidth={pin.kind === 'conference' ? 1.4 : 0}
      />
      {isActive && <circle r={7.5} fill="none" stroke="#F3EDE3" strokeWidth={1} />}
      <text
        textAnchor="middle"
        y={-10}
        fontSize={9}
        fontFamily="'JetBrains Mono', ui-monospace, monospace"
        fill="#C4B8A4"
        className="pointer-events-none opacity-0 transition-opacity duration-150 group-hover:opacity-100"
      >
        {pin.city}
      </text>
    </Marker>
  )
}

export function CircuitMap() {
  const [active, setActive] = useState<CircuitPin | null>(null)

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
              isActive={active?.id === pin.id}
              onSelect={() => setActive(pin)}
            />
          ))}
        </ComposableMap>
      </div>

      <div className="mt-6 min-h-[7rem] hairline bg-ink p-5">
        {active ? (
          <div className="animate-tick flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-lg text-cream">{active.city}</p>
              <p className="label-mono text-[0.62rem] text-cream-wash">{active.region}</p>
              <p className="mt-2 text-sm text-cream-3">
                {active.nextEvent} — {active.nextEventDate}
              </p>
            </div>
            <span className="label-mono inline-block w-fit shrink-0 border border-gold/40 px-3 py-1.5 text-[0.62rem] text-gold">
              {active.action}
            </span>
          </div>
        ) : (
          <p className="text-sm text-cream-wash/70">Click a pin to see how ambassadors show up there.</p>
        )}
      </div>
    </div>
  )
}
