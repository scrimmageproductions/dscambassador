import { useState, type FormEvent } from 'react'
import { Modal } from '../ui/Modal'

export function RejectReasonModal({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean
  onClose: () => void
  onConfirm: (reason: string) => void
}) {
  const [reason, setReason] = useState('')

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    onConfirm(reason)
    setReason('')
  }

  function handleClose() {
    setReason('')
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} labelledBy="reject-modal-title">
      <h2 id="reject-modal-title" className="font-display text-2xl text-cream">
        Reject request
      </h2>
      <form onSubmit={handleSubmit} className="mt-6">
        <label htmlFor="reject-reason" className="label-mono text-[0.68rem] text-cream-wash">
          Reason (visible to the ambassador)
        </label>
        <textarea
          id="reject-reason"
          required
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Why this request doesn't clear right now"
          className="hairline mt-2 w-full resize-none bg-ink px-4 py-3 text-sm text-cream placeholder:text-cream-wash/40 focus-visible:outline-cream"
        />
        <button
          type="submit"
          className="label-mono mt-5 w-full border border-cream/35 px-6 py-3 text-[0.7rem] text-cream transition-colors hover:border-cream hover:bg-cream/5"
        >
          Confirm rejection
        </button>
      </form>
    </Modal>
  )
}
