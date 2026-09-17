import { budgetLines } from '../../../data/dashboard'

export function BudgetView() {
  return (
    <div className="hairline divide-y divide-cream/10 glass-card">
      <div className="hidden gap-4 px-6 py-4 sm:grid sm:grid-cols-4">
        {['Category', 'Allocated', 'Used', 'Status'].map((h) => (
          <p key={h} className="label-mono text-[0.62rem] text-cream-wash">
            {h}
          </p>
        ))}
      </div>
      {budgetLines.map((b) => (
        <div key={b.category} className="grid gap-1 px-6 py-4 sm:grid-cols-4 sm:items-center sm:gap-4">
          <p className="font-display text-base text-cream">{b.category}</p>
          <p className="text-sm text-cream-3">{b.allocated}</p>
          <p className="text-sm text-cream-3">{b.used}</p>
          <p className={`label-mono text-[0.65rem] ${b.status === 'Fully used' ? 'text-gold' : 'text-cream-wash'}`}>
            {b.status}
          </p>
        </div>
      ))}
      <p className="px-6 py-4 text-xs leading-relaxed text-cream-wash/70">
        2026 budget resets each January. Unused allocations don&rsquo;t roll over.
      </p>
    </div>
  )
}
