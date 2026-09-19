import { useState } from 'react'
import { LinkButton } from '../ui/Button'

type Answer = 'yes' | 'no' | null

type Question = {
  key: string
  prompt: string
}

const questions: Question[] = [
  { key: 'member', prompt: 'Are you a Digital Spenders Club member?' },
  { key: 'adult', prompt: 'Are you 18 years old or older?' },
  { key: 'followers', prompt: 'Do you have 500+ followers on Instagram, TikTok, or X?' },
  { key: 'conflict', prompt: 'Do you hold a conflicting ambassadorship right now?' },
]

type Result = {
  headline: string
  body: string
  tone: 'ready' | 'wait' | 'talk'
}

function evaluate(answers: Record<string, Answer>): Result | null {
  if (Object.values(answers).some((a) => a === null)) return null

  if (answers.member === 'no') {
    return {
      headline: 'Not yet',
      body: 'Ambassadors are genuine Digital Spenders Club members first. Join the club, then come back.',
      tone: 'wait',
    }
  }
  if (answers.adult === 'no') {
    return {
      headline: 'Not yet',
      body: 'The program is open to members 18 and older.',
      tone: 'wait',
    }
  }
  if (answers.conflict === 'yes') {
    return {
      headline: 'Talk to us',
      body: 'A conflicting ambassadorship needs a conversation before you apply. DM @YoungScrimmage first.',
      tone: 'talk',
    }
  }
  if (answers.followers === 'no') {
    return {
      headline: 'Talk to us',
      body: 'Below the 500-follower minimum is reviewed case by case. Apply anyway and note your platform.',
      tone: 'talk',
    }
  }
  return {
    headline: 'Ready to apply',
    body: 'You meet the baseline. Bring your handles, your size, and the events already on your calendar.',
    tone: 'ready',
  }
}

export function EligibilityChecker() {
  const [answers, setAnswers] = useState<Record<string, Answer>>({
    member: null,
    adult: null,
    followers: null,
    conflict: null,
  })

  const result = evaluate(answers)

  function reset() {
    setAnswers({ member: null, adult: null, followers: null, conflict: null })
  }

  return (
    <div className="hairline glass-card p-6 md:p-8">
      <p className="label-mono text-[0.7rem] text-cream-wash">Eligibility check</p>
      <p className="mt-2 text-sm text-cream-3">Four questions. No account needed.</p>

      <div className="mt-6 space-y-5">
        {questions.map((q) => (
          <fieldset key={q.key} className="hairline-b pb-5">
            <legend className="mb-3 text-sm text-cream">{q.prompt}</legend>
            <div className="flex gap-3">
              {(['yes', 'no'] as const).map((val) => (
                <label
                  key={val}
                  className={`label-mono cursor-pointer rounded-lg border px-4 py-2 text-[0.68rem] transition-colors ${
                    answers[q.key] === val
                      ? 'border-cream bg-cream text-ink'
                      : 'border-cream/25 text-cream-3 hover:border-cream/60'
                  }`}
                >
                  <input
                    type="radio"
                    name={q.key}
                    value={val}
                    checked={answers[q.key] === val}
                    onChange={() => setAnswers((a) => ({ ...a, [q.key]: val }))}
                    className="sr-only"
                  />
                  {val === 'yes' ? 'Yes' : 'No'}
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>

      {result ? (
        <div className="mt-6 rounded-lg hairline bg-ink p-6" role="status">
          <p
            className={`font-display text-2xl ${
              result.tone === 'ready' ? 'text-cream' : result.tone === 'talk' ? 'text-gold' : 'text-cream-wash'
            }`}
          >
            {result.headline}
          </p>
          <p className="mt-2 text-sm text-cream-3">{result.body}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {result.tone === 'ready' ? (
              <LinkButton to="/apply" variant="solid">
                Start application
              </LinkButton>
            ) : (
              <LinkButton to="/guidelines" variant="ghost">
                Read guidelines
              </LinkButton>
            )}
            <button type="button" onClick={reset} className="label-mono text-[0.68rem] text-cream-wash underline underline-offset-4 hover:text-cream">
              Reset
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
