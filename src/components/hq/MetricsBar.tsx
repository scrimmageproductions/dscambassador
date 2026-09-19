import { dashboardMetrics } from '../../data/dashboard'

export function MetricsBar() {
  return (
    <div className="flex flex-wrap overflow-hidden rounded-2xl bg-white/[0.02] sm:flex-nowrap">
      {dashboardMetrics.map((m, i) => (
        <div
          key={m.label}
          className={`min-w-[45%] flex-1 px-5 py-5 sm:min-w-0 ${
            i % 2 !== 0 ? 'border-l border-cream/10 sm:border-l' : i !== 0 ? 'sm:border-l sm:border-cream/10' : ''
          } ${i >= 2 ? 'border-t border-cream/10 sm:border-t-0' : ''}`}
        >
          <p className="font-display text-3xl text-cream">{m.value}</p>
          <p className="mt-2 text-sm text-cream-2">{m.label}</p>
          <p className="label-mono mt-1 text-[0.6rem] text-cream-wash/70">{m.hint}</p>
        </div>
      ))}
    </div>
  )
}
