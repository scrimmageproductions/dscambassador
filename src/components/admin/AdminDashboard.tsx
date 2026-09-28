import { useState } from 'react'
import { PendingApprovalsTab } from './PendingApprovalsTab'
import { RegionalNodeMatrixTab } from './RegionalNodeMatrixTab'
import { AuditLogTab } from './AuditLogTab'

const TABS = [
  { key: 'pending', label: 'Pending approvals' },
  { key: 'matrix', label: 'Regional node matrix' },
  { key: 'audit', label: 'Audit logs' },
] as const

type TabKey = (typeof TABS)[number]['key']

export function AdminDashboard() {
  const [tab, setTab] = useState<TabKey>('pending')

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
      <p className="label-mono text-[0.65rem] text-gold">HQ // admin registry</p>
      <h1 className="mt-3 font-display text-3xl text-[#E8E4D9] md:text-4xl">Administration override</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-cream-3">
        Pending node actions across the ambassador network, one regional matrix, one audit trail.
      </p>

      <div className="mt-8 flex flex-wrap gap-2 border-b border-white/10 pb-6" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={`label-mono rounded-sm border px-4 py-2 text-[0.65rem] transition-colors ${
              tab === t.key
                ? 'border-[#E8E4D9] bg-[#E8E4D9] text-[#0A0A0A]'
                : 'border-white/10 text-white/50 hover:border-white/25 hover:text-white/80'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === 'pending' && <PendingApprovalsTab />}
        {tab === 'matrix' && <RegionalNodeMatrixTab />}
        {tab === 'audit' && <AuditLogTab />}
      </div>
    </div>
  )
}
