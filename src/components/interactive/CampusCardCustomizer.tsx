import { useState } from 'react'
import { TiltCard } from '../motion/TiltCard'

export function CampusCardCustomizer() {
  const [name, setName] = useState('')

  return (
    <div className="grid items-center gap-10 md:grid-cols-2">
      <div>
        <p className="label-mono text-[0.68rem] text-gold">Card customizer</p>
        <h3 className="mt-3 font-display text-2xl text-cream">See your chapter card.</h3>
        <p className="mt-3 text-sm leading-relaxed text-cream-3">
          Type your school or club name and preview the co-branded card your members will tap to
          get in.
        </p>
        <div className="mt-6">
          <label htmlFor="chapter-name" className="label-mono text-[0.68rem] text-cream-wash">
            Enter Your School / Club Name
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
      </div>

      <TiltCard maxTilt={10} className="mx-auto w-full max-w-sm rounded-2xl">
        <div className="hairline relative aspect-[8/5] w-full overflow-hidden rounded-2xl bg-ink">
          <img
            src="/spendersclubcard.jpeg"
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-ink/70" />
          <div className="relative flex h-full flex-col justify-between p-6">
            <div className="flex items-center justify-between">
              <span className="font-display text-lg text-cream">DSC</span>
              <span className="label-mono text-[0.55rem] text-gold">Chapter Card</span>
            </div>
            <div className="min-w-0">
              <p className="label-mono text-[0.6rem] text-cream-wash">Digital Spenders Club</p>
              <p className="mt-1 truncate font-display text-2xl text-cream">
                {name.trim() || 'Your School / Club'}
              </p>
            </div>
          </div>
        </div>
      </TiltCard>
    </div>
  )
}
