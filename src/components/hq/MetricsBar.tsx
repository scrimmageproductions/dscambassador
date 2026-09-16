import { dashboardMetrics } from '../../data/dashboard'

export function MetricsBar() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {dashboardMetrics.map((m) => (
        <div key={m.label} className="hairline bg-ink p-5">
          <p className="font-display text-3xl text-cream">{m.value}</p>
          <p className="mt-2 text-sm text-cream-2">{m.label}</p>
          <p className="label-mono mt-1 text-[0.6rem] text-cream-wash/70">{m.hint}</p>
        </div>
      ))}
    </div>
  )
}
