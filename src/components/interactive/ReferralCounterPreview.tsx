const stats = [
  { label: 'Members onboarded', value: 'N/A', hint: 'via your membership cards + referral link' },
  { label: 'Content posted', value: '0 / 2', hint: 'this month' },
  { label: 'Events attended', value: '0 / 1', hint: 'this quarter' },
  { label: 'SYNC attendance', value: 'N/A', hint: 'monthly ambassador call' },
]

export function ReferralCounterPreview() {
  return (
    <div className="hairline bg-surface/40 p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="label-mono text-[0.68rem] text-cream-wash">Ambassador HQ preview</p>
        <span className="label-mono text-[0.6rem] text-gold">Live tracking after approval</span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="hairline bg-ink p-5">
            <p className="font-display text-3xl text-cream-wash">{s.value}</p>
            <p className="mt-2 text-sm text-cream-2">{s.label}</p>
            <p className="label-mono mt-1 text-[0.6rem] text-cream-wash/70">{s.hint}</p>
          </div>
        ))}
      </div>

      <p className="mt-5 text-xs leading-relaxed text-cream-wash/70">
        Onboarding more members off your recommendation is how extra apparel and future kit drops
        get unlocked. This module goes live inside HQ once your application is approved.
      </p>
    </div>
  )
}
