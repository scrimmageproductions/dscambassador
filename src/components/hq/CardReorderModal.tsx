import { useState, type FormEvent } from 'react'
import { Modal } from '../ui/Modal'

export function CardReorderModal({
  open,
  onClose,
  batchDefault,
  onSubmitted,
}: {
  open: boolean
  onClose: () => void
  batchDefault: number
  onSubmitted: () => void
}) {
  const [batchSize, setBatchSize] = useState(batchDefault)
  const [address, setAddress] = useState('')
  const [coAmbassadorConfirmed, setCoAmbassadorConfirmed] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitted(true)
    onSubmitted()
  }

  function handleClose() {
    onClose()
    // Reset after the close animation finishes so the form doesn't visibly
    // flicker back to its initial state while it's still fading out.
    setTimeout(() => {
      setSubmitted(false)
      setAddress('')
      setCoAmbassadorConfirmed(false)
      setBatchSize(batchDefault)
    }, 300)
  }

  return (
    <Modal open={open} onClose={handleClose} labelledBy="reorder-modal-title">
      {submitted ? (
        <div role="status">
          <p className="label-mono text-[0.65rem] text-gold">[ Pending admin approval ]</p>
          <h2 className="mt-3 font-display text-2xl text-cream">Shipment requested.</h2>
          <p className="mt-2 text-sm leading-relaxed text-cream-3">
            Your regional node lead will confirm the batch and shipping window from here.
          </p>
          <p className="label-mono mt-4 text-[0.62rem] text-cream-wash/80">
            &gt; reorder.request(batch={batchSize}) &mdash; status: pending_admin_approval
          </p>
          <button
            type="button"
            onClick={handleClose}
            className="label-mono mt-6 border border-cream/35 px-6 py-3 text-[0.7rem] text-cream transition-colors hover:border-cream hover:bg-cream/5"
          >
            Done
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <p className="label-mono text-[0.65rem] text-cream-wash">Regional logistics</p>
            <h2 id="reorder-modal-title" className="mt-2 font-display text-2xl text-cream">
              Request card shipment
            </h2>
          </div>

          <div className="mt-6">
            <label htmlFor="reorder-batch" className="label-mono text-[0.68rem] text-cream-wash">
              Batch size
            </label>
            <input
              id="reorder-batch"
              type="number"
              min={1}
              required
              value={batchSize}
              onChange={(e) => setBatchSize(Number(e.target.value))}
              className="hairline mt-2 w-full bg-ink px-4 py-3 text-sm text-cream focus-visible:outline-cream"
            />
          </div>

          <div className="mt-5">
            <label htmlFor="reorder-address" className="label-mono text-[0.68rem] text-cream-wash">
              Shipping address (regional node)
            </label>
            <p className="mt-1.5 text-xs leading-relaxed text-cream-wash/60">
              Confirm this still matches your address on file, or update it for this shipment.
            </p>
            <textarea
              id="reorder-address"
              required
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Street, city, postal code"
              className="hairline mt-2 w-full resize-none bg-ink px-4 py-3 text-sm text-cream placeholder:text-cream-wash/40 focus-visible:outline-cream"
            />
          </div>

          <label className="mt-5 flex items-start gap-2.5 text-sm text-cream-2">
            <input
              type="checkbox"
              required
              checked={coAmbassadorConfirmed}
              onChange={(e) => setCoAmbassadorConfirmed(e.target.checked)}
              className="mt-0.5 h-3.5 w-3.5 accent-[#E8E4D9]"
            />
            My Co-Ambassador (secondary node) is aware and can receive this shipment if I&rsquo;m
            offline.
          </label>

          <button
            type="submit"
            className="label-mono mt-6 w-full bg-[#E8E4D9] px-6 py-3.5 text-[0.7rem] font-medium uppercase text-[#0A0A0A] transition-opacity hover:opacity-90"
          >
            Submit request
          </button>
        </form>
      )}
    </Modal>
  )
}
