import { useState } from 'react'
import { useDraft } from './useDraft'
import { ProgressBar } from './ProgressBar'
import { StepIdentity } from './StepIdentity'
import { StepPresence } from './StepPresence'
import { StepFit } from './StepFit'
import { StepAgreement } from './StepAgreement'
import { Button } from '../ui/Button'

function validateStep(step: number, draft: ReturnType<typeof useDraft>['draft']): string | null {
  if (step === 0) {
    if (!draft.name.trim()) return 'Add your name.'
    if (!draft.city.trim()) return 'Add your city or region.'
    if (!draft.isAdult) return 'You must confirm you are 18 or older.'
    if (!draft.membership) return 'Let us know your membership status.'
  }
  if (step === 1) {
    if (!draft.instagramHandle && !draft.tiktokHandle && !draft.xHandle) {
      return 'Add at least one handle.'
    }
    if (!draft.conflictingAmbassadorship) return 'Answer the conflicting ambassadorship question.'
  }
  if (step === 2) {
    if (!draft.size) return 'Pick a clothing size.'
    if (!draft.region.trim()) return 'Add a shipping region.'
    if (!draft.garmentPreference) return 'Pick a garment preference.'
  }
  if (step === 3) {
    if (!draft.agreed) return 'You must accept the guidelines to submit.'
  }
  return null
}

export function ApplyWizard() {
  const { draft, update, clear } = useDraft()
  const [step, setStep] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [submittedAt, setSubmittedAt] = useState<string | null>(null)

  function goNext() {
    const err = validateStep(step, draft)
    if (err) {
      setError(err)
      return
    }
    setError(null)
    if (step === 3) {
      setSubmittedAt(new Date().toLocaleString())
      clear()
      return
    }
    setStep((s) => Math.min(s + 1, 3))
  }

  function goBack() {
    setError(null)
    setStep((s) => Math.max(s - 1, 0))
  }

  if (submittedAt) {
    return (
      <div className="hairline bg-ink p-8 text-center md:p-16" role="status">
        <p className="label-mono text-[0.68rem] text-gold">Application received · {submittedAt}</p>
        <p className="mt-5 font-display text-3xl text-cream md:text-5xl">We&rsquo;ll be in touch.</p>
        <p className="mt-3 font-display text-xl text-cream-wash md:text-2xl">Spenders move.</p>
        <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-cream-3">
          Applications are reviewed on a rolling basis. If you&rsquo;re approved, you&rsquo;ll hear
          from the team with next steps for the private Telegram HQ and your kit.
        </p>
      </div>
    )
  }

  return (
    <div>
      <ProgressBar step={step} />

      <div className="mt-10 hairline bg-surface/30 p-6 md:p-10">
        {step === 0 && <StepIdentity draft={draft} update={update} />}
        {step === 1 && <StepPresence draft={draft} update={update} />}
        {step === 2 && <StepFit draft={draft} update={update} />}
        {step === 3 && <StepAgreement draft={draft} update={update} />}

        {error ? <p className="mt-6 text-sm text-gold">{error}</p> : null}

        <div className="mt-8 flex items-center justify-between hairline-t pt-6">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 0}
            className="label-mono text-[0.68rem] text-cream-wash underline underline-offset-4 hover:text-cream disabled:opacity-30 disabled:no-underline"
          >
            Back
          </button>
          <Button type="button" onClick={goNext} variant="solid">
            {step === 3 ? 'Submit application' : 'Continue'}
          </Button>
        </div>
      </div>

      <p className="label-mono mt-4 text-[0.6rem] text-cream-wash/60">
        Your progress saves automatically on this device.
      </p>
    </div>
  )
}
