import { useState, type ReactNode } from 'react'
import {
  HQStoreContext,
  APPROVAL_TYPE_LABEL,
  type ApprovalRequest,
  type ApprovalType,
  type AuditLogEntry,
  type CardInventoryState,
  type RoleTransfer,
} from './HQStoreContext'
import { regionalCardInventory } from '../data/dashboard'

export const NODE_REGION = 'New York, NY'

let idCounter = 0
function nextId(prefix: string) {
  idCounter += 1
  return `${prefix}-${Date.now().toString(36)}-${idCounter}`
}

/**
 * Client-only demo store for HQ's node-governance features (card reorders,
 * role transfers, the admin approval queue, the audit log). There is no
 * real backend, so this just holds shared in-memory state for the current
 * browser tab -- it lets the ambassador-facing views and the admin panel
 * observe and act on the same "live" data within one demo session.
 */
const UNCLAIMED_NAME = 'Ambassador'

export function HQStoreProvider({ children }: { children: ReactNode }) {
  const [primaryAmbassadorName, setPrimaryAmbassadorName] = useState(UNCLAIMED_NAME)
  const [coAmbassador, setCoAmbassador] = useState('')
  const [ambassadorRole, setAmbassadorRole] = useState<'primary' | 'emeritus'>('primary')
  const [cardInventory, setCardInventory] = useState<CardInventoryState>({
    batchSize: regionalCardInventory.batchSize,
    activations: regionalCardInventory.activations,
    reorderThresholdPct: regionalCardInventory.reorderThresholdPct,
    reorderStatus: 'idle',
  })
  const [roleTransfer, setRoleTransfer] = useState<RoleTransfer | null>(null)
  const [approvalQueue, setApprovalQueue] = useState<ApprovalRequest[]>([])
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([])

  function appendAudit(action: string) {
    setAuditLog((prev) => [{ id: nextId('audit'), timestamp: Date.now(), action }, ...prev])
  }

  function submitCardReorder({
    batchSize,
    address,
    requestedBy,
  }: {
    batchSize: number
    address: string
    requestedBy: string
  }) {
    setCardInventory((prev) => ({ ...prev, reorderStatus: 'pending', reorderRejectionReason: undefined }))
    setApprovalQueue((prev) => [
      {
        id: nextId('req'),
        type: 'card-reorder',
        region: NODE_REGION,
        requestedBy,
        submittedAt: Date.now(),
        status: 'pending',
        summary: `Reorder ${batchSize} cards — ship to ${address}`,
      },
      ...prev,
    ])
    appendAudit(`Card reorder requested — ${batchSize} cards, ${NODE_REGION}`)
  }

  function claimPrimaryAmbassadorName(name: string) {
    setPrimaryAmbassadorName((prev) => (prev === UNCLAIMED_NAME ? name : prev))
  }

  function resetCardReorderStatus() {
    setCardInventory((prev) => ({ ...prev, reorderStatus: 'idle', reorderRejectionReason: undefined }))
  }

  function submitRequest(
    type: ApprovalType,
    details: { region: string; requestedBy: string; summary: string },
  ) {
    setApprovalQueue((prev) => [
      { id: nextId('req'), type, submittedAt: Date.now(), status: 'pending', ...details },
      ...prev,
    ])
    appendAudit(`${APPROVAL_TYPE_LABEL[type]} submitted — ${details.requestedBy}, ${details.region}`)
  }

  function approveRequest(id: string) {
    setApprovalQueue((prev) => {
      const target = prev.find((r) => r.id === id)
      if (!target) return prev
      if (target.type === 'card-reorder') {
        setCardInventory((c) => ({ ...c, reorderStatus: 'approved' }))
      }
      appendAudit(`Approved ${APPROVAL_TYPE_LABEL[target.type]} — ${target.requestedBy}, ${target.region}`)
      return prev.map((r) => (r.id === id ? { ...r, status: 'approved' } : r))
    })
  }

  function rejectRequest(id: string, reason: string) {
    setApprovalQueue((prev) => {
      const target = prev.find((r) => r.id === id)
      if (!target) return prev
      if (target.type === 'card-reorder') {
        setCardInventory((c) => ({ ...c, reorderStatus: 'rejected', reorderRejectionReason: reason }))
      }
      appendAudit(
        `Rejected ${APPROVAL_TYPE_LABEL[target.type]} — ${target.requestedBy}, ${target.region} (${reason})`,
      )
      return prev.map((r) => (r.id === id ? { ...r, status: 'rejected', rejectionReason: reason } : r))
    })
  }

  function initiateTransfer(fromName: string, toName: string, reason: string) {
    setRoleTransfer({
      id: nextId('transfer'),
      fromName,
      toName,
      reason,
      stage: 'pending-co-ambassador',
      submittedAt: Date.now(),
    })
    appendAudit(`Role transfer initiated — ${fromName} proposed handover to ${toName}`)
  }

  function simulateCoAmbassadorDecision(accept: boolean) {
    setRoleTransfer((prev) => {
      if (!prev) return prev
      if (!accept) {
        appendAudit(`Role transfer declined by ${prev.toName}`)
        return { ...prev, stage: 'declined' }
      }
      appendAudit(`${prev.toName} accepted the handover — routed to admin approval`)
      return { ...prev, stage: 'pending-admin' }
    })
  }

  function approveTransfer() {
    setRoleTransfer((prev) => {
      if (!prev) return prev
      appendAudit(
        `Role transfer approved — ${prev.fromName} -> Emeritus Member, ${prev.toName} -> Primary Ambassador`,
      )
      setPrimaryAmbassadorName(prev.toName)
      return { ...prev, stage: 'completed' }
    })
    setAmbassadorRole('emeritus')
    setCoAmbassador('')
  }

  function rejectTransfer(reason: string) {
    setRoleTransfer((prev) => {
      if (!prev) return prev
      appendAudit(`Role transfer rejected by admin — ${prev.fromName} remains Primary Ambassador (${reason})`)
      return { ...prev, stage: 'declined', rejectionReason: reason }
    })
  }

  return (
    <HQStoreContext.Provider
      value={{
        region: NODE_REGION,
        primaryAmbassadorName,
        claimPrimaryAmbassadorName,
        coAmbassador,
        setCoAmbassador,
        ambassadorRole,
        cardInventory,
        submitCardReorder,
        resetCardReorderStatus,
        roleTransfer,
        initiateTransfer,
        simulateCoAmbassadorDecision,
        approveTransfer,
        rejectTransfer,
        approvalQueue,
        submitRequest,
        approveRequest,
        rejectRequest,
        auditLog,
      }}
    >
      {children}
    </HQStoreContext.Provider>
  )
}
