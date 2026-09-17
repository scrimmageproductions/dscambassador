import { useState, type FormEvent } from 'react'
import { Button } from '../../ui/Button'

export function MailingAddressView() {
  const [saved, setSaved] = useState(false)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <form onSubmit={handleSubmit} className="hairline max-w-xl glass-card p-6 md:p-8">
      <p className="text-sm leading-relaxed text-cream-3">
        Where kit drops and membership card restocks ship.
      </p>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="addr-line1" className="label-mono text-[0.68rem] text-cream-wash">
            Street address
          </label>
          <input
            id="addr-line1"
            required
            className="hairline mt-2 w-full bg-ink px-4 py-3 text-sm text-cream focus-visible:outline-cream"
          />
        </div>
        <div>
          <label htmlFor="addr-city" className="label-mono text-[0.68rem] text-cream-wash">
            City
          </label>
          <input
            id="addr-city"
            required
            className="hairline mt-2 w-full bg-ink px-4 py-3 text-sm text-cream focus-visible:outline-cream"
          />
        </div>
        <div>
          <label htmlFor="addr-postal" className="label-mono text-[0.68rem] text-cream-wash">
            Postal code
          </label>
          <input
            id="addr-postal"
            required
            className="hairline mt-2 w-full bg-ink px-4 py-3 text-sm text-cream focus-visible:outline-cream"
          />
        </div>
      </div>
      <div className="mt-6 flex items-center gap-4">
        <Button type="submit" variant="solid">
          Save address
        </Button>
        {saved ? <p className="label-mono text-[0.65rem] text-gold">Saved ✓</p> : null}
      </div>
    </form>
  )
}
