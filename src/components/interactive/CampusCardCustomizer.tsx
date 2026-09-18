import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { TiltCard } from '../motion/TiltCard'

const SWATCHES = [
  { name: 'Crimson', hex: '#B91C2C' },
  { name: 'Royal Blue', hex: '#2149C4' },
  { name: 'Gold', hex: '#C4A574' },
  { name: 'Emerald', hex: '#0F7A52' },
  { name: 'Purple', hex: '#6B3FA0' },
  { name: 'Ivory', hex: '#F3EDE3' },
]

/** Approximate width-to-length fit so long names shrink instead of overflowing the card. */
function fitFontSize(text: string) {
  const len = Math.max(text.length, 1)
  const size = Math.min(28, Math.max(13, 360 / len))
  return `${size}px`
}

function withAlpha(hex: string, alpha: string) {
  return /^#[0-9a-fA-F]{6}$/.test(hex) ? `${hex}${alpha}` : hex
}

function CrestPlaceholder({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" style={{ color }} aria-hidden="true">
      <path
        d="M32 4 L58 14 V32 C58 46 47 56 32 60 C17 56 6 46 6 32 V14 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.8"
      />
      <path
        d="M32 16 L44 22 V32 C44 40 38 46 32 48 C26 46 20 40 20 32 V22 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.5"
      />
      <circle cx="32" cy="32" r="3" fill="currentColor" opacity="0.7" />
    </svg>
  )
}

export function CampusCardCustomizer() {
  const [name, setName] = useState('')
  const [accent, setAccent] = useState(SWATCHES[2].hex)
  const [crestUrl, setCrestUrl] = useState<string | null>(null)
  const objectUrlRef = useRef<string | null>(null)

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    }
  }, [])

  function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    const url = URL.createObjectURL(file)
    objectUrlRef.current = url
    setCrestUrl(url)
  }

  function clearCrest() {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    objectUrlRef.current = null
    setCrestUrl(null)
  }

  return (
    <div>
      <p className="label-mono text-[0.68rem] text-gold">Card customizer</p>
      <h3 className="mt-3 font-display text-2xl text-cream">See your chapter card.</h3>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-cream-3">
        Type your school or club name, drop in a crest, and pick an accent color. This is the
        co-branded card your members will tap to get in.
      </p>

      <div className="mt-8 grid items-start gap-10 md:grid-cols-2">
        <div className="relative mx-auto w-full max-w-sm">
          <div
            className="pointer-events-none absolute -inset-6 rounded-[2rem] blur-2xl transition-colors duration-500"
            style={{ background: `radial-gradient(circle, ${withAlpha(accent, '3d')} 0%, transparent 70%)` }}
            aria-hidden="true"
          />
          <TiltCard maxTilt={10} className="relative w-full rounded-2xl">
            <div
              className="relative aspect-[8/5] w-full overflow-hidden rounded-2xl transition-colors duration-500"
              style={{
                backgroundColor: '#0D0D0D',
                border: `1px solid ${withAlpha(accent, '66')}`,
              }}
            >
              <div className="relative flex h-full flex-col justify-between p-6">
                <div className="flex items-start justify-between">
                  <span className="font-display text-sm font-semibold tracking-wide text-cream-wash">
                    DSC
                  </span>
                  <span
                    className="label-mono text-[0.55rem] transition-colors duration-500"
                    style={{ color: accent }}
                  >
                    Chapter Edition // 01
                  </span>
                </div>

                <div className="flex flex-1 items-center justify-end py-2">
                  <div className="h-16 w-16 shrink-0 bg-transparent">
                    {crestUrl ? (
                      <img
                        src={crestUrl}
                        alt="Uploaded club crest"
                        className="h-full w-full rounded-full bg-transparent object-contain"
                        style={{ backgroundColor: 'transparent' }}
                      />
                    ) : (
                      <CrestPlaceholder color={accent} />
                    )}
                  </div>
                </div>

                <div className="min-w-0 max-w-[70%]">
                  <p className="label-mono text-[0.55rem] text-cream-wash/70">
                    Digital Spenders Club
                  </p>
                  <p
                    className="mt-1 truncate font-display text-cream"
                    style={{
                      fontSize: fitFontSize(name.trim() || 'Your School / Club'),
                      textShadow: '0 1px 0 rgba(255,255,255,0.12), 0 -1px 1px rgba(0,0,0,0.7)',
                    }}
                  >
                    {name.trim() || 'Your School / Club'}
                  </p>
                </div>
              </div>
            </div>
          </TiltCard>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="chapter-name" className="label-mono text-[0.68rem] text-cream-wash">
              School / Club Name
            </label>
            <input
              id="chapter-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. ASU Blockchain Club"
              maxLength={40}
              className="hairline mt-2 w-full bg-surface px-4 py-3 text-sm text-cream placeholder:text-cream-wash/40 focus-visible:outline-cream"
            />
          </div>

          <div>
            <p className="label-mono text-[0.68rem] text-cream-wash">Accent color</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              {SWATCHES.map((s) => (
                <button
                  key={s.hex}
                  type="button"
                  onClick={() => setAccent(s.hex)}
                  aria-label={s.name}
                  aria-pressed={accent === s.hex}
                  title={s.name}
                  className="h-8 w-8 rounded-full transition-transform hover:scale-110"
                  style={{
                    backgroundColor: s.hex,
                    boxShadow: accent === s.hex ? `0 0 0 2px #0A0A0A, 0 0 0 4px ${s.hex}` : '0 0 0 1px rgba(243,237,227,0.2)',
                  }}
                />
              ))}
              <label
                className="relative h-8 w-8 cursor-pointer overflow-hidden rounded-full"
                title="Custom color"
                style={{ boxShadow: '0 0 0 1px rgba(243,237,227,0.2)' }}
              >
                <input
                  type="color"
                  value={accent}
                  onChange={(e) => setAccent(e.target.value)}
                  className="absolute -left-1 -top-1 h-10 w-10 cursor-pointer border-none p-0"
                  aria-label="Custom accent color"
                />
                <span
                  className="pointer-events-none absolute inset-0 flex items-center justify-center bg-ink/35 text-[0.6rem] text-cream"
                  aria-hidden="true"
                >
                  +
                </span>
              </label>
            </div>
          </div>

          <div>
            <p className="label-mono text-[0.68rem] text-cream-wash">
              Upload Club Crest <span className="text-cream-wash/60">(optional)</span>
            </p>
            <div className="mt-2 flex items-center gap-3">
              <label className="hairline label-mono inline-flex cursor-pointer items-center gap-2 px-4 py-2.5 text-[0.65rem] text-cream-3 transition-colors hover:border-cream hover:text-cream">
                Choose file
                <input type="file" accept="image/*" onChange={handleUpload} className="sr-only" />
              </label>
              {crestUrl ? (
                <button
                  type="button"
                  onClick={clearCrest}
                  className="label-mono text-[0.62rem] text-cream-wash underline underline-offset-4 hover:text-cream"
                >
                  Remove
                </button>
              ) : (
                <span className="text-xs text-cream-wash/60">No crest yet. Using the default mark.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
