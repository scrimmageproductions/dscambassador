import { useState, type FormEvent } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { useAmbassadorSession } from '../../context/useAmbassadorSession'

type Method = 'card' | 'wallet' | 'email'

const methods: { key: Method; label: string; detail: string }[] = [
  {
    key: 'card',
    label: 'Membership Card',
    detail: 'Tap your DSC Membership Card to your phone, same as unlocking Burner at an event.',
  },
  {
    key: 'wallet',
    label: 'Wallet',
    detail: 'Connect the wallet linked to your approved ambassador profile.',
  },
  {
    key: 'email',
    label: 'Email',
    detail: 'Use the email address on file from your application.',
  },
]

export function SignInModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { signIn } = useAmbassadorSession()
  const [method, setMethod] = useState<Method>('card')
  const [name, setName] = useState('')

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    signIn(name)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} labelledBy="signin-modal-title">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="label-mono text-[0.65rem] text-cream-wash">Ambassador HQ</p>
          <h2 id="signin-modal-title" className="mt-2 font-display text-2xl text-cream">
            Sign in
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="label-mono shrink-0 border border-cream/25 px-3 py-1.5 text-[0.65rem] text-cream-wash transition-colors hover:border-cream hover:text-cream"
        >
          Esc
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Sign-in method">
        {methods.map((m) => (
          <button
            key={m.key}
            type="button"
            onClick={() => setMethod(m.key)}
            aria-pressed={method === m.key}
            className={`label-mono border px-4 py-2 text-[0.65rem] transition-colors ${
              method === m.key
                ? 'border-cream bg-cream text-ink'
                : 'border-cream/25 text-cream-3 hover:border-cream/60'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <p className="mt-4 text-sm leading-relaxed text-cream-3">
        {methods.find((m) => m.key === method)?.detail}
      </p>

      <form onSubmit={handleSubmit} className="mt-6 hairline-t pt-6">
        <label htmlFor="preview-name" className="label-mono text-[0.68rem] text-cream-wash">
          Preview as <span className="text-cream-wash/60">(optional)</span>
        </label>
        <input
          id="preview-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          maxLength={40}
          className="hairline mt-2 w-full bg-ink px-4 py-3 text-sm text-cream placeholder:text-cream-wash/40 focus-visible:outline-cream"
        />

        <Button type="submit" variant="solid" className="mt-6 w-full">
          Preview / Demo Sign-In
        </Button>

        <p className="mt-4 text-xs leading-relaxed text-cream-wash/70">
          Demo mode — no real account needed. This drops you straight into a full preview of what
          opens inside HQ once your application is approved.
        </p>
      </form>
    </Modal>
  )
}
