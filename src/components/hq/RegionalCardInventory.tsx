import { useState } from 'react'
import { useHQStore } from '../../context/useHQStore'
import { useAmbassadorSession } from '../../context/useAmbassadorSession'
import { CardReorderModal } from './CardReorderModal'

export function RegionalCardInventory() {
  const { session } = useAmbassadorSession()
  const { cardInventory, submitCardReorder, resetCardReorderStatus } = useHQStore()
  const [modalOpen, setModalOpen] = useState(false)

  const { batchSize, activations, reorderThresholdPct, reorderStatus, reorderRejectionReason } = cardInventory
  const activationRate = (activations / batchSize) * 100
  const unlocked = activationRate >= reorderThresholdPct

  return (
    <div className="border border-white/10 bg-[#0A0A0A] p-6 md:p-8">
      <h3 className="font-display text-lg text-[#E8E4D9] md:text-xl">
        Regional card inventory &amp; activations
      </h3>

      <div className="mt-6 grid grid-cols-1 divide-y divide-white/10 border border-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <div className="p-5">
          <p className="label-mono text-[0.62rem] text-white/50">Current batch inventory</p>
          <p className="mt-2 font-display text-2xl text-[#E8E4D9]">{batchSize} Cards</p>
        </div>
        <div className="p-5">
          <p className="label-mono text-[0.62rem] text-white/50">Regional activations</p>
          <p className="mt-2 font-display text-2xl text-[#E8E4D9]">
            {activations} / {batchSize}
          </p>
        </div>
        <div className="p-5">
          <p className="label-mono text-[0.62rem] text-white/50">Activation rate</p>
          <p className="mt-2 font-display text-2xl text-[#E8E4D9]">{activationRate.toFixed(1)}%</p>
        </div>
      </div>

      <div className="mt-8">
        <div
          role="progressbar"
          aria-valuenow={Math.round(activationRate)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Regional activation rate"
          className="relative h-2.5 rounded-sm border border-white/10 bg-neutral-900"
        >
          <div
            className="h-full rounded-sm bg-[#E8E4D9]"
            style={{ width: `${Math.min(activationRate, 100)}%` }}
          />
          <div
            className="absolute inset-y-0 w-px bg-white/40"
            style={{ left: `${reorderThresholdPct}%` }}
            aria-hidden="true"
          />
        </div>
        <div className="relative mt-2 h-4">
          <p
            className="label-mono absolute -translate-x-1/2 whitespace-nowrap text-[0.58rem] text-white/50"
            style={{ left: `${reorderThresholdPct}%` }}
          >
            {reorderThresholdPct}% reorder threshold
          </p>
        </div>
      </div>

      <div className="mt-8 border-t border-white/10 pt-6">
        {reorderStatus === 'pending' ? (
          <p className="label-mono text-[0.65rem] text-gold">[ Pending admin approval ]</p>
        ) : reorderStatus === 'approved' ? (
          <p className="label-mono text-[0.65rem] text-[#E8E4D9]">[ Approved &mdash; shipment confirmed ]</p>
        ) : reorderStatus === 'rejected' ? (
          <div>
            <p className="label-mono text-[0.65rem] text-gold">
              [ Rejected{reorderRejectionReason ? `: ${reorderRejectionReason}` : ''} ]
            </p>
            <button
              type="button"
              onClick={resetCardReorderStatus}
              className="label-mono mt-3 text-[0.62rem] text-white/50 underline underline-offset-4 hover:text-white"
            >
              Request again
            </button>
          </div>
        ) : unlocked ? (
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="label-mono rounded-sm bg-[#E8E4D9] px-6 py-3.5 text-[0.7rem] font-medium uppercase text-[#0A0A0A] transition-opacity hover:opacity-90"
          >
            Request card shipment
          </button>
        ) : (
          <div>
            <button
              type="button"
              disabled
              className="label-mono cursor-not-allowed rounded-sm border border-white/10 bg-white/[0.03] px-6 py-3.5 text-[0.7rem] font-medium uppercase text-white/30"
            >
              Request card shipment
            </button>
            <p className="label-mono mt-3 text-[0.62rem] text-white/40">
              [ Locked: {reorderThresholdPct}% regional activation required to reorder ]
            </p>
          </div>
        )}
      </div>

      <CardReorderModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        batchDefault={batchSize}
        onSubmitted={({ batchSize: submittedBatch, address }) =>
          submitCardReorder({ batchSize: submittedBatch, address, requestedBy: session?.name ?? 'Ambassador' })
        }
      />
    </div>
  )
}
