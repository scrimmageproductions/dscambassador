import { useState } from 'react'
import { useHQStore } from '../../context/useHQStore'
import { APPROVAL_TYPE_LABEL, type ApprovalType } from '../../context/HQStoreContext'
import { RejectReasonModal } from './RejectReasonModal'

type Row = {
  id: string
  type: ApprovalType | 'role-transfer'
  region: string
  requestedBy: string
  submittedAt: number
  summary: string
  onApprove: () => void
  onReject: (reason: string) => void
}

export function PendingApprovalsTab() {
  const { approvalQueue, approveRequest, rejectRequest, roleTransfer, approveTransfer, rejectTransfer } =
    useHQStore()
  const [rejectTarget, setRejectTarget] = useState<Row | null>(null)

  const rows: Row[] = approvalQueue
    .filter((r) => r.status === 'pending')
    .map((r) => ({
      id: r.id,
      type: r.type,
      region: r.region,
      requestedBy: r.requestedBy,
      submittedAt: r.submittedAt,
      summary: r.summary,
      onApprove: () => approveRequest(r.id),
      onReject: (reason: string) => rejectRequest(r.id, reason),
    }))

  if (roleTransfer && roleTransfer.stage === 'pending-admin') {
    rows.push({
      id: roleTransfer.id,
      type: 'role-transfer',
      region: '—',
      requestedBy: roleTransfer.fromName,
      submittedAt: roleTransfer.submittedAt,
      summary: `Handover to ${roleTransfer.toName} — ${roleTransfer.reason}`,
      onApprove: () => approveTransfer(),
      onReject: (reason: string) => rejectTransfer(reason),
    })
  }

  rows.sort((a, b) => b.submittedAt - a.submittedAt)

  if (rows.length === 0) {
    return (
      <div className="border border-white/10 bg-[#0A0A0A] p-8 text-center">
        <p className="label-mono text-[0.62rem] text-white/40">[ Queue clear &mdash; no pending node actions ]</p>
      </div>
    )
  }

  return (
    <div className="border border-white/10 bg-[#0A0A0A]">
      <div className="divide-y divide-white/10">
        {rows.map((row) => (
          <div key={row.id} className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <p className="label-mono text-[0.6rem] text-white/50">
                {APPROVAL_TYPE_LABEL[row.type]} &middot; {row.region} &middot;{' '}
                {new Date(row.submittedAt).toLocaleString()}
              </p>
              <p className="mt-1.5 text-sm text-[#E8E4D9]">{row.summary}</p>
              <p className="label-mono mt-1 text-[0.58rem] text-white/40">Requested by {row.requestedBy}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={row.onApprove}
                className="label-mono rounded-sm bg-[#E8E4D9] px-4 py-2 text-[0.62rem] font-medium uppercase text-[#0A0A0A] transition-opacity hover:opacity-90"
              >
                Approve
              </button>
              <button
                type="button"
                onClick={() => setRejectTarget(row)}
                className="label-mono rounded-sm border border-white/15 px-4 py-2 text-[0.62rem] uppercase text-white/60 transition-colors hover:border-white/30 hover:text-white"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      <RejectReasonModal
        open={rejectTarget !== null}
        onClose={() => setRejectTarget(null)}
        onConfirm={(reason) => {
          rejectTarget?.onReject(reason)
          setRejectTarget(null)
        }}
      />
    </div>
  )
}
