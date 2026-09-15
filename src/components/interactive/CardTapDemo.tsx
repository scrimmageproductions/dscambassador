import { useEffect, useRef, useState } from 'react'
import { MembershipCardIllustration } from '../illustrations/Garments'
import { LinkButton } from '../ui/Button'

type Stage = 'idle' | 'tapping' | 'verified' | 'app'

export function CardTapDemo() {
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
    timers.current.push(setTimeout(() => setStage('verified'), 650))
    timers.current.push(setTimeout(() => setStage('app'), 1400))
  }

  function reset() {
    timers.current.forEach(clearTimeout)
    setStage('idle')
  }

  const unlocked = stage === 'verified' || stage === 'app'

  return (
    <div className="hairline bg-surface/40 p-6 md:p-10">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div className="relative flex items-center justify-center py-6">
          <div
            className={`relative z-10 w-44 transition-transform duration-500 ease-out ${
              stage === 'idle' ? '-translate-x-8' : 'translate-x-6'
            } ${stage === 'tapping' ? 'scale-95' : ''}`}
          >
            <MembershipCardIllustration className="w-full drop-shadow-[0_0_30px_rgba(196,165,116,0.08)]" />
          </div>

          <div
            className={`relative z-0 -ml-4 flex h-56 w-28 flex-col items-center justify-center gap-1 overflow-hidden rounded-[1.4rem] border px-3 transition-colors ${
              unlocked ? 'border-gold' : 'border-cream/25'
            } bg-ink`}
          >
            {stage === 'app' ? (
              <div className="w-full animate-tick text-center">
                <p className="label-mono text-[0.55rem] text-cream-wash">DSC</p>
                <p className="font-display text-sm text-cream">Burner</p>
                <div className="mx-auto mt-2 h-px w-8 bg-cream/20" />
                <p className="label-mono mt-2 text-[0.45rem] text-gold">Verified</p>
                <div className="mt-3 space-y-1.5">
                  <div className="h-1 w-full rounded-full bg-cream/15" />
                  <div className="h-1 w-3/4 rounded-full bg-cream/15" />
                  <div className="h-1 w-5/6 rounded-full bg-cream/15" />
                </div>
              </div>
            ) : (
              <span className="label-mono rotate-90 whitespace-nowrap text-[0.6rem] text-cream-wash">
                phone
              </span>
            )}
            {unlocked && (
              <span className="pointer-events-none absolute inset-0 animate-pulse rounded-[1.4rem] border border-gold/40" />
            )}
          </div>

          {stage === 'tapping' && (
            <span className="absolute h-24 w-24 animate-ping rounded-full border border-cream/30" />
          )}
        </div>

        <div>
          {stage === 'idle' && (
            <>
              <p className="label-mono text-[0.68rem] text-cream-wash">Membership card</p>
              <h3 className="mt-3 font-display text-2xl text-cream">Tap in to open Burner.</h3>
              <p className="mt-3 text-sm leading-relaxed text-cream-3">
                Every member taps their DSC Membership Card to their phone to unlock the Burner
                app — that&rsquo;s the access model, no separate login. Ambassadors trigger the
                same moment for someone new at an event.
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
              <p className="label-mono text-[0.68rem] text-gold">Reading card…</p>
              <p className="mt-3 font-display text-2xl text-cream">Verifying</p>
            </div>
          )}

          {stage === 'verified' && (
            <div className="animate-tick">
              <p className="label-mono text-[0.68rem] text-gold">Card verified</p>
              <p className="mt-3 font-display text-2xl text-cream">Welcome to Digital Spenders Club</p>
            </div>
          )}

          {stage === 'app' && (
            <div className="animate-tick space-y-4">
              <p className="label-mono text-[0.68rem] text-gold">Burner unlocked</p>
              <p className="font-display text-2xl text-cream">You&rsquo;re in.</p>
              <p className="text-sm leading-relaxed text-cream-3">
                This is what opens every time — for a member checking the SYNC agenda, or someone
                tapping in for the first time at a conference booth.
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
