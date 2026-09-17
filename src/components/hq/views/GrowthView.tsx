import { growthHistory, dashboardMetrics } from '../../../data/dashboard'

export function GrowthView() {
  const max = Math.max(...growthHistory.map((g) => g.onboarded))
  const totalOnboarded = dashboardMetrics.find((m) => m.label === 'Members onboarded')?.value ?? 'N/A'

  return (
    <div className="hairline glass-card p-6 md:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="label-mono text-[0.68rem] text-cream-wash">Members onboarded (last 6 months)</p>
        <p className="font-display text-2xl text-cream">{totalOnboarded} total</p>
      </div>

      <div className="mt-8 flex items-end gap-4 sm:gap-6">
        {growthHistory.map((g) => (
          <div key={g.month} className="flex flex-1 flex-col items-center gap-2">
            <p className="label-mono text-[0.62rem] text-cream-wash">{g.onboarded}</p>
            <div className="flex h-32 w-full items-end bg-ink">
              <div
                className="w-full bg-gradient-to-t from-gold/70 to-cream"
                style={{ height: `${(g.onboarded / max) * 100}%` }}
              />
            </div>
            <p className="label-mono text-[0.62rem] text-cream-wash">{g.month}</p>
          </div>
        ))}
      </div>

      <p className="mt-8 text-xs leading-relaxed text-cream-wash/70">
        More members onboarded through your cards and referral link unlocks extra apparel and
        priority access to future kit drops.
      </p>
    </div>
  )
}
