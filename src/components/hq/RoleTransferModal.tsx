import { useState, type FormEvent } from 'react'
import { Modal } from '../ui/Modal'
import { useAmbassadorSession } from '../../context/useAmbassadorSession'
import { useHQStore } from '../../context/useHQStore'

export function RoleTransferModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { session } = useAmbassadorSession()
  const { coAmbassador, initiateTransfer } = useHQStore()
  const [reason, setReason] = useState('')

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    initiateTransfer(session?.name ?? 'Ambassador', coAmbassador, reason)
    setReason('')
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} labelledBy="transfer-modal-title">
      <p className="label-mono text-[0.65rem] text-cream-wash">Node governance</p>
      <h2 id="transfer-modal-title" className="mt-2 font-display text-2xl text-cream">
        Transfer primary role
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-cream-3">
        Stepping away or pivoting? Transfer your Primary Ambassador role to your designated
        Co-Ambassador. This will hand over node management, card inventory tracking, and HQ
        privileges upon approval.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 hairline-t pt-6">
        <p className="label-mono text-[0.68rem] text-cream-wash">Designated co-ambassador</p>
        <p className="mt-2 font-display text-xl text-cream">{coAmbassador}</p>

        <div className="mt-5">
          <label htmlFor="transfer-reason" className="label-mono text-[0.68rem] text-cream-wash">
            Transition reason / notes to HQ
          </label>
          <textarea
            id="transfer-reason"
            required
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Why now, and anything HQ should know"
            className="hairline mt-2 w-full resize-none bg-ink px-4 py-3 text-sm text-cream placeholder:text-cream-wash/40 focus-visible:outline-cream"
          />
        </div>

        <button
          type="submit"
          className="label-mono mt-6 w-full border border-cream/35 px-6 py-3.5 text-[0.7rem] text-cream transition-colors hover:border-cream hover:bg-cream/5"
        >
          Confirm handover request
        </button>
      </form>
    </Modal>
  )
}
