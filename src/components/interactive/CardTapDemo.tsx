import { useEffect, useRef, useState } from 'react'
import { MembershipCardIllustration } from '../illustrations/Garments'
import { LinkButton } from '../ui/Button'
import { TiltCard } from '../motion/TiltCard'

type StepKey = 'init' | 'authorize' | 'execute' | 'settle'

const STEPS: {
  key: StepKey
  dot: string
  eyebrow: string
  heading: string
  log: string
}[] = [
  { key: 'init', dot: '01 INIT', eyebrow: 'Membership card', heading: 'Tap in to open Burner.', log: '> awaiting nfc.tap()' },
  { key: 'authorize', dot: '02 AUTHORIZE', eyebrow: 'Reading card…', heading: 'Verifying', log: '> auth.verify(signature) …' },
  {
    key: 'execute',
    dot: '03 EXECUTE',
    eyebrow: 'Card verified',
    heading: 'Welcome to Digital Spenders Club',
    log: '> membership.grant(card_id) OK',
  },
  { key: 'settle', dot: '04 SETTLE', eyebrow: 'Burner unlocked', heading: 'You’re in.', log: '> session.settled — access: member' },
]

// Auto-run pacing, 2x the original 650ms/750ms beats, so the terminal log
// and each step's status actually has time to read before advancing.
const AUTHORIZE_MS = 1300
const EXECUTE_MS = 1500

export function CardTapDemo() {
  const [stepIndex, setStepIndex] = useState(0)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout)
    }
  }, [])

  function clearTimers() {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  function runTap() {
    if (stepIndex !== 0) return
    clearTimers()
    setStepIndex(1)
    timers.current.push(
      setTimeout(() => {
        setStepIndex(2)
        timers.current.push(setTimeout(() => setStepIndex(3), EXECUTE_MS))
      }, AUTHORIZE_MS),
    )
  }

  // Manual step dots: jump straight to any step, at the viewer's own pace,
  // cancelling whatever auto-run timers were still pending.
  function goToStep(index: number) {
    clearTimers()
    setStepIndex(index)
  }

  function reset() {
    clearTimers()
    setStepIndex(0)
  }

  const step = STEPS[stepIndex].key
  const unlocked = step === 'execute' || step === 'settle'

  return (
    <div className="hairline glass-card p-6 md:p-10">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div className="relative flex items-center justify-center py-6">
          <div
            className={`relative z-10 w-44 transition-transform duration-500 ease-out ${
              step === 'init' ? '-translate-x-8 translate-y-4' : '-translate-y-14 translate-x-6'
            } ${step === 'authorize' ? 'scale-95' : ''}`}
          >
            <TiltCard maxTilt={10} className="rounded-2xl">
              <MembershipCardIllustration className="w-full drop-shadow-[0_0_30px_rgba(196,165,116,0.08)]" />
            </TiltCard>
          </div>

          <div
            className={`relative z-0 -ml-4 flex h-56 w-28 flex-col items-center justify-center gap-1 overflow-hidden rounded-[1.4rem] border px-3 transition-colors ${
              unlocked ? 'border-gold' : 'border-cream/25'
            } bg-ink`}
          >
            {/* NFC antenna zone: upper-rear of the phone, where real hardware sits */}
            <span
              className={`pointer-events-none absolute left-1/2 top-9 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-colors ${
                unlocked ? 'border-gold/50' : 'border-cream/15'
              }`}
              aria-hidden="true"
            />

            {step === 'authorize' && (
              <>
                <span
                  className="pointer-events-none absolute left-1/2 top-9 h-3 w-3 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-cream [animation-duration:0.6s]"
                  aria-hidden="true"
                />
                <span
                  className="pointer-events-none absolute left-1/2 top-9 h-16 w-16 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full border border-cream/40"
                  aria-hidden="true"
                />
              </>
            )}

            {step === 'settle' ? (
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
        </div>

        <div>
          <div key={step} className="animate-tick">
            <p className={`label-mono text-[0.68rem] ${step === 'init' ? 'text-cream-wash' : 'text-gold'}`}>
              {STEPS[stepIndex].eyebrow}
            </p>
            <h3 className="mt-3 font-display text-2xl text-cream">{STEPS[stepIndex].heading}</h3>

            {step === 'init' && (
              <p className="mt-3 text-sm leading-relaxed text-cream-3">
                Every member taps their DSC Membership Card to their phone to unlock the Burner
                app. That&rsquo;s the access model, no separate login. Ambassadors trigger the
                same moment for someone new at an event.
              </p>
            )}

            {step === 'settle' && (
              <p className="mt-3 text-sm leading-relaxed text-cream-3">
                This is what opens every time, for a member checking the SYNC agenda, or someone
                tapping in for the first time at a conference booth.
              </p>
            )}

            {/* Terminal-style transaction log: one running line per step, so
                the underlying status is legible, not just the headline. */}
            <p className="label-mono mt-4 text-[0.62rem] text-cream-wash/80">{STEPS[stepIndex].log}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              {step === 'init' && (
                <button
                  type="button"
                  onClick={runTap}
                  className="label-mono border border-cream/35 px-6 py-3 text-[0.7rem] text-cream transition-colors hover:border-cream hover:bg-cream/5"
                >
                  Simulate a tap
                </button>
              )}
              {step === 'settle' && (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Step dots: click any step, or step through them one at a time, at
          your own pace -- independent of the auto-run timers above. */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2 border-t border-cream/10 pt-6">
        {STEPS.map((s, i) => (
          <button
            key={s.key}
            type="button"
            onClick={() => goToStep(i)}
            aria-current={i === stepIndex ? 'step' : undefined}
            className={`label-mono rounded-full border px-3 py-1.5 text-[0.6rem] transition-colors ${
              i === stepIndex
                ? 'border-gold bg-gold/10 text-gold'
                : 'border-cream/20 text-cream-wash hover:border-cream/40 hover:text-cream'
            }`}
          >
            {s.dot}
          </button>
        ))}
      </div>
    </div>
  )
}
