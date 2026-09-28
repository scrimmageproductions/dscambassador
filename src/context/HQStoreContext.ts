import { createContext } from 'react'

export type ApprovalType = 'card-reorder' | 'event-funding' | 'ambassador-application' | 'merch-allocation'

export const APPROVAL_TYPE_LABEL: Record<ApprovalType | 'role-transfer', string> = {
  'card-reorder': 'Card reorder',
  'event-funding': 'Event funding',
  'ambassador-application': 'Ambassador application',
  'merch-allocation': 'Merch allocation',
  'role-transfer': 'Role transfer',
}

export type ApprovalStatus = 'pending' | 'approved' | 'rejected'

export type ApprovalRequest = {
  id: string
  type: ApprovalType
  region: string
  requestedBy: string
  submittedAt: number
  status: ApprovalStatus
  summary: string
  rejectionReason?: string
}

export type TransferStage = 'pending-co-ambassador' | 'pending-admin' | 'completed' | 'declined'

export type RoleTransfer = {
  id: string
  fromName: string
  toName: string
  reason: string
  stage: TransferStage
  submittedAt: number
  rejectionReason?: string
}

export type AuditLogEntry = {
  id: string
  timestamp: number
  action: string
}

export type CardInventoryState = {
  batchSize: number
  activations: number
  reorderThresholdPct: number
  reorderStatus: 'idle' | ApprovalStatus
  reorderRejectionReason?: string
}

export type HQStoreValue = {
  region: string

  /** The node's actual current primary ambassador -- independent of whichever
   * demo persona (ambassador or admin) happens to be signed in and viewing
   * at any given moment. Drives the Regional Node Matrix's live row. */
  primaryAmbassadorName: string
  claimPrimaryAmbassadorName: (name: string) => void

  coAmbassador: string
  setCoAmbassador: (name: string) => void
  ambassadorRole: 'primary' | 'emeritus'

  cardInventory: CardInventoryState
  submitCardReorder: (details: { batchSize: number; address: string; requestedBy: string }) => void
  resetCardReorderStatus: () => void

  roleTransfer: RoleTransfer | null
  initiateTransfer: (fromName: string, toName: string, reason: string) => void
  simulateCoAmbassadorDecision: (accept: boolean) => void
  approveTransfer: () => void
  rejectTransfer: (reason: string) => void

  approvalQueue: ApprovalRequest[]
  submitRequest: (type: ApprovalType, details: { region: string; requestedBy: string; summary: string }) => void
  approveRequest: (id: string) => void
  rejectRequest: (id: string, reason: string) => void

  auditLog: AuditLogEntry[]
}

export const HQStoreContext = createContext<HQStoreValue | null>(null)
