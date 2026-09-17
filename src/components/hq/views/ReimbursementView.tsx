import { useState, type FormEvent } from 'react'
import { Button } from '../../ui/Button'

export function ReimbursementView() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="hairline bg-ink p-8 text-center md:p-12" role="status">
        <p className="label-mono text-[0.68rem] text-gold">Request received</p>
        <p className="mt-4 font-display text-2xl text-cream md:text-3xl">
          Sent for approval.
        </p>
        <p className="mt-3 text-sm text-cream-3">Track its status under My Expenses.</p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="label-mono mt-6 text-[0.65rem] text-cream-wash underline underline-offset-4 hover:text-cream"
        >
          Submit another
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="hairline glass-card p-6 md:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="reimb-item" className="label-mono text-[0.68rem] text-cream-wash">
            Expense
          </label>
          <input
            id="reimb-item"
            required
            placeholder="e.g. Ground transport"
            className="hairline mt-2 w-full bg-ink px-4 py-3 text-sm text-cream placeholder:text-cream-wash/40 focus-visible:outline-cream"
          />
        </div>
        <div>
          <label htmlFor="reimb-amount" className="label-mono text-[0.68rem] text-cream-wash">
            Amount
          </label>
          <input
            id="reimb-amount"
            type="number"
            step="0.01"
            required
            placeholder="0.00"
            className="hairline mt-2 w-full bg-ink px-4 py-3 text-sm text-cream placeholder:text-cream-wash/40 focus-visible:outline-cream"
          />
        </div>
      </div>
      <div className="mt-5">
        <label htmlFor="reimb-notes" className="label-mono text-[0.68rem] text-cream-wash">
          Notes
        </label>
        <textarea
          id="reimb-notes"
          rows={3}
          placeholder="What it was for, which event it ties to"
          className="hairline mt-2 w-full resize-none bg-ink px-4 py-3 text-sm text-cream placeholder:text-cream-wash/40 focus-visible:outline-cream"
        />
      </div>
      <p className="mt-4 text-xs leading-relaxed text-cream-wash/70">
        Attach receipts once you&rsquo;re in. This preview skips the upload step.
      </p>
      <Button type="submit" variant="solid" className="mt-6">
        Submit for reimbursement
      </Button>
    </form>
  )
}
