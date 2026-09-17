import { expenseReports } from '../../../data/dashboard'

export function MyExpensesView() {
  return (
    <div className="hairline divide-y divide-cream/10 glass-card">
      <div className="hidden gap-4 px-6 py-4 sm:grid sm:grid-cols-3">
        {['Item', 'Amount', 'Status'].map((h) => (
          <p key={h} className="label-mono text-[0.62rem] text-cream-wash">
            {h}
          </p>
        ))}
      </div>
      {expenseReports.map((e) => (
        <div key={e.item} className="grid gap-1 px-6 py-4 sm:grid-cols-3 sm:items-center sm:gap-4">
          <p className="font-display text-base text-cream">{e.item}</p>
          <p className="text-sm text-cream-3">{e.amount}</p>
          <p className={`label-mono text-[0.65rem] ${e.status === 'Reimbursed' ? 'text-gold' : 'text-cream-wash'}`}>
            {e.status}
          </p>
        </div>
      ))}
    </div>
  )
}
