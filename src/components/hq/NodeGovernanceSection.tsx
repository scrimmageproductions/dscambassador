import { useState } from 'react'
import { useHQStore } from '../../context/useHQStore'
import { RoleTransferModal } from './RoleTransferModal'

export function NodeGovernanceSection() {
  const { coAmbassador, ambassadorRole, roleTransfer, simulateCoAmbassadorDecision } = useHQStore()
  const [modalOpen, setModalOpen] = useState(false)

  if (ambassadorRole === 'emeritus') {
    return (
      <div className="mt-8 hairline-t pt-6">
        <p className="label-mono text-[0.68rem] text-cream-wash">Node governance</p>
        <p className="label-mono mt-3 text-[0.65rem] text-cream">[ Role transfer complete ]</p>
        <p className="mt-2 text-sm text-cream-3">
          Your primary role transferred to {roleTransfer?.toName}. Node management, card
          inventory tracking, and HQ privileges now live with them.
        </p>
      </div>
    )
  }

  return (
    <div className="mt-8 hairline-t pt-6">
      <p className="label-mono text-[0.68rem] text-cream-wash">Node governance</p>

      {!roleTransfer || roleTransfer.stage === 'declined' ? (
        <>
          <p className="mt-2 text-xs leading-relaxed text-cream-wash/60">
            Hand off primary ownership of this node to your Co-Ambassador.
          </p>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            disabled={!coAmbassador.trim()}
            className="label-mono mt-3 border border-cream/35 px-6 py-3 text-[0.7rem] text-cream transition-colors hover:border-cream hover:bg-cream/5 disabled:cursor-not-allowed disabled:opacity-30"
          >
            [ Initiate role handover ]
          </button>
          {!coAmbassador.trim() ? (
            <p className="label-mono mt-2 text-[0.6rem] text-white/40">
              Add a Co-Ambassador above before starting a handover.
            </p>
          ) : null}
          {roleTransfer?.stage === 'declined' ? (
            <p className="label-mono mt-3 text-[0.62rem] text-gold">
              [ Handover to {roleTransfer.toName} was declined
              {roleTransfer.rejectionReason ? `: ${roleTransfer.rejectionReason}` : ''} ]
            </p>
          ) : null}
        </>
      ) : (
        <div className="mt-3">
          {roleTransfer.stage === 'pending-co-ambassador' ? (
            <>
              <p className="label-mono text-[0.65rem] text-gold">[ Pending co-ambassador acceptance ]</p>
              <p className="mt-2 text-sm text-cream-3">
                Waiting on {roleTransfer.toName} to accept primary ownership.
              </p>
              <div className="hairline mt-4 bg-white/[0.02] p-4">
                <p className="label-mono text-[0.6rem] text-white/50">
                  Demo: simulate {roleTransfer.toName}&rsquo;s response
                </p>
                <div className="mt-3 flex gap-3">
                  <button
                    type="button"
                    onClick={() => simulateCoAmbassadorDecision(true)}
                    className="label-mono border border-cream/35 px-4 py-2 text-[0.65rem] text-cream transition-colors hover:border-cream hover:bg-cream/5"
                  >
                    Accept
                  </button>
                  <button
                    type="button"
                    onClick={() => simulateCoAmbassadorDecision(false)}
                    className="label-mono border border-white/15 px-4 py-2 text-[0.65rem] text-cream-wash transition-colors hover:border-white/30 hover:text-cream"
                  >
                    Decline
                  </button>
                </div>
              </div>
            </>
          ) : null}

          {roleTransfer.stage === 'pending-admin' ? (
            <>
              <p className="label-mono text-[0.65rem] text-gold">[ Pending admin approval ]</p>
              <p className="mt-2 text-sm text-cream-3">
                {roleTransfer.toName} accepted. Routed to HQ admin for final approval.
              </p>
            </>
          ) : null}
        </div>
      )}

      <RoleTransferModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
