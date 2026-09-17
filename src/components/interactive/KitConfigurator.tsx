import { useState } from 'react'
import { TeeIllustration, CrewIllustration, HoodieIllustration } from '../illustrations/Garments'

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const
const garments = [
  { key: 'tee', label: 'Tee' },
  { key: 'sweater', label: 'Crewneck' },
  { key: 'sweatshirt', label: 'Hoodie' },
] as const
const regions = ['United States', 'Canada', 'United Kingdom', 'European Union', 'Rest of world'] as const
const colorways = ['black', 'cream'] as const

type Garment = (typeof garments)[number]['key']
type Colorway = (typeof colorways)[number]

const illustrationFor: Record<Garment, typeof TeeIllustration> = {
  tee: TeeIllustration,
  sweater: CrewIllustration,
  sweatshirt: HoodieIllustration,
}

export function KitConfigurator() {
  const [size, setSize] = useState<(typeof sizes)[number]>('M')
  const [garment, setGarment] = useState<Garment>('tee')
  const [region, setRegion] = useState<(typeof regions)[number]>('United States')
  const [colorway, setColorway] = useState<Colorway>('black')

  const Illustration = illustrationFor[garment]

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="hairline flex flex-col items-center justify-center glass-card p-8">
        <Illustration colorway={colorway} className="w-full max-w-[280px]" />
        <p className="label-mono mt-6 text-[0.68rem] text-cream-wash">
          {garments.find((g) => g.key === garment)?.label} · {size} · {colorway === 'black' ? 'Black' : 'Cream'}
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <p className="label-mono text-[0.68rem] text-cream-wash">Garment</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {garments.map((g) => (
              <button
                key={g.key}
                type="button"
                onClick={() => setGarment(g.key)}
                aria-pressed={garment === g.key}
                className={`label-mono border px-4 py-2 text-[0.68rem] transition-colors ${
                  garment === g.key ? 'border-cream bg-cream text-ink' : 'border-cream/25 text-cream-3 hover:border-cream/60'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="label-mono text-[0.68rem] text-cream-wash">Colorway</p>
          <div className="mt-3 flex gap-2">
            {colorways.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColorway(c)}
                aria-pressed={colorway === c}
                className={`label-mono flex items-center gap-2 border px-4 py-2 text-[0.68rem] transition-colors ${
                  colorway === c ? 'border-cream bg-cream text-ink' : 'border-cream/25 text-cream-3 hover:border-cream/60'
                }`}
              >
                <span
                  className={`h-3 w-3 rounded-full border border-cream-3/50 ${c === 'black' ? 'bg-[#141414]' : 'bg-[#F3EDE3]'}`}
                />
                {c === 'black' ? 'Black' : 'Cream'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="size" className="label-mono text-[0.68rem] text-cream-wash">
            Size
          </label>
          <div className="mt-3 flex flex-wrap gap-2" id="size">
            {sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                aria-pressed={size === s}
                className={`label-mono h-10 w-12 border text-[0.7rem] transition-colors ${
                  size === s ? 'border-cream bg-cream text-ink' : 'border-cream/25 text-cream-3 hover:border-cream/60'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="region" className="label-mono text-[0.68rem] text-cream-wash">
            Shipping region
          </label>
          <select
            id="region"
            value={region}
            onChange={(e) => setRegion(e.target.value as (typeof regions)[number])}
            className="hairline mt-3 w-full bg-surface px-4 py-3 text-sm text-cream focus-visible:outline-cream"
          >
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <p className="text-xs leading-relaxed text-cream-wash/80">
          Issued from your application form. Other kit items may be included with a given drop,
          not guaranteed beyond the core piece above.
        </p>
      </div>
    </div>
  )
}
