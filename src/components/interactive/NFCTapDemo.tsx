import { useEffect, useRef, useState } from 'react'
import { NFCKeychainIllustration } from '../illustrations/Garments'
import { LinkButton } from '../ui/Button'

type Stage = 'idle' | 'tapping' | 'connected' | 'onboard'

export function NFCTapDemo() {
  const [stage, setStage] = useState<Stage>('idle')
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout)
    }
  }, [])

  function runTap() {
    if (stage !== 'idle') return
    setStage('tapping')
    timers.current.push(setTimeout(() => setStage('connected'), 650))
    timers.current.push(setTimeout(() => setStage('onboard'), 1400))
  }

  function reset() {
    timers.current.forEach(clearTimeout)
    setStage('idle')
  }

  return (
    <div className="hairline bg-surface/40 p-6 md:p-10">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div className="relative flex items-center justify-center py-6">
          <div
            className={`relative z-10 w-40 transition-transform duration-500 ease-out ${
              stage === 'idle' ? '-translate-x-10' : 'translate-x-6'
            } ${stage === 'tapping' ? 'scale-95' : ''}`}
          >
            <NFCKeychainIllustration className="w-full drop-shadow-[0_0_30px_rgba(196,165,116,0.08)]" />
          </div>

          <div
            className={`relative z-0 -ml-6 flex h-56 w-28 items-center justify-center rounded-[1.4rem] border transition-colors ${
              stage === 'connected' || stage === 'onboard' ? 'border-gold' : 'border-cream/25'
            } bg-ink`}
          >
            <span className="label-mono rotate-90 whitespace-nowrap text-[0.6rem] text-cream-wash">
              phone
            </span>
            {(stage === 'connected' || stage === 'onboard') && (
              <span className="absolute inset-0 animate-pulse rounded-[1.4rem] border border-gold/40" />
            )}
          </div>

          {stage === 'tapping' && (
            <span className="absolute h-24 w-24 animate-ping rounded-full border border-cream/30" />
          )}
        </div>

        <div>
          {stage === 'idle' && (
            <>
              <p className="label-mono text-[0.68rem] text-cream-wash">NFC keychain</p>
              <h3 className="mt-3 font-display text-2xl text-cream">Tap to onboard, IRL.</h3>
              <p className="mt-3 text-sm leading-relaxed text-cream-3">
                Every approved ambassador carries one. At conferences, meetups, and club nights,
                a single tap starts someone&rsquo;s path into the club.
              </p>
              <button
                type="button"
                onClick={runTap}
                className="label-mono mt-6 border border-cream/35 px-6 py-3 text-[0.7rem] text-cream transition-colors hover:border-cream hover:bg-cream/5"
              >
                Simulate a tap
              </button>
            </>
          )}

          {stage === 'tapping' && (
            <div className="animate-tick">
              <p className="label-mono text-[0.68rem] text-gold">Reading tag…</p>
              <p className="mt-3 font-display text-2xl text-cream">Connecting</p>
            </div>
          )}

          {stage === 'connected' && (
            <div className="animate-tick">
              <p className="label-mono text-[0.68rem] text-gold">Tap detected</p>
              <p className="mt-3 font-display text-2xl text-cream">Welcome to Digital Spenders Club</p>
            </div>
          )}

          {stage === 'onboard' && (
            <div className="animate-tick space-y-4">
              <p className="label-mono text-[0.68rem] text-gold">Onboard flow</p>
              <p className="font-display text-2xl text-cream">
                Apply for membership. Follow the motion.
              </p>
              <p className="text-sm leading-relaxed text-cream-3">
                This is the exact moment ambassadors create at events — a tap, a link, a new
                member. No app to install, nothing to explain twice.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <LinkButton to="https://spenders.club" variant="ghost" className="!px-5 !py-2.5">
                  spenders.club
                </LinkButton>
                <button
                  type="button"
                  onClick={reset}
                  className="label-mono text-[0.68rem] text-cream-wash underline underline-offset-4 hover:text-cream"
                >
                  Run again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
