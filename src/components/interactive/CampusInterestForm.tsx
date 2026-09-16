import { useState, type FormEvent } from 'react'
import { Button } from '../ui/Button'

export function CampusInterestForm() {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const required = ['school', 'club', 'city', 'headcount']
    const missing = required.find((key) => !String(data.get(key) ?? '').trim())
    if (missing) {
      setError('Fill in every field before submitting.')
      return
    }
    setError('')
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="hairline bg-ink p-8 text-center md:p-12" role="status">
        <p className="label-mono text-[0.68rem] text-gold">Interest received</p>
        <p className="mt-4 font-display text-2xl text-cream md:text-3xl">
          We&rsquo;ll follow up with your chapter.
        </p>
        <p className="mt-3 text-sm text-cream-3">Spenders move. Follow the motion.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="hairline bg-surface/40 p-6 md:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="School" name="school" placeholder="e.g. Arizona State University" />
        <Field label="Blockchain club" name="club" placeholder="e.g. ASU Blockchain Club" />
        <Field label="City" name="city" placeholder="e.g. Tempe, AZ" />
        <Field label="Expected headcount" name="headcount" placeholder="e.g. 40" type="number" />
      </div>

      <fieldset className="mt-6">
        <legend className="label-mono text-[0.68rem] text-cream-wash">Interested in</legend>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <label className="hairline flex flex-1 items-center gap-3 px-4 py-3 text-sm text-cream-2">
            <input type="checkbox" name="cards" className="h-4 w-4 accent-[#F3EDE3]" />
            Custom chapter membership cards
          </label>
          <label className="hairline flex flex-1 items-center gap-3 px-4 py-3 text-sm text-cream-2">
            <input type="checkbox" name="merch" className="h-4 w-4 accent-[#F3EDE3]" />
            Chapter treasury funding details
          </label>
        </div>
      </fieldset>

      {error ? <p className="mt-4 text-sm text-cream-wash">{error}</p> : null}

      <Button type="submit" variant="solid" className="mt-6">
        Submit chapter interest
      </Button>
    </form>
  )
}

function Field({
  label,
  name,
  placeholder,
  type = 'text',
}: {
  label: string
  name: string
  placeholder: string
  type?: string
}) {
  return (
    <div>
      <label htmlFor={name} className="label-mono text-[0.68rem] text-cream-wash">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className="hairline mt-2 w-full bg-surface px-4 py-3 text-sm text-cream placeholder:text-cream-wash/40 focus-visible:outline-cream"
      />
    </div>
  )
}
