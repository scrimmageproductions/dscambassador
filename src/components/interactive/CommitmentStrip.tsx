const steps = [
  { cadence: '2x / month', label: 'Original content' },
  { cadence: 'Daily', label: 'Engage within 24h' },
  { cadence: '1x / quarter', label: 'IRL activation' },
]

export function CommitmentStrip() {
  return (
    <div className="grid gap-0 sm:grid-cols-3">
      {steps.map((step, i) => (
        <div
          key={step.cadence}
          className={`border-t border-cream/10 px-6 py-8 sm:px-8 sm:border-t-0 ${i > 0 ? 'sm:border-l' : ''}`}
        >
          <p className="label-mono text-[0.7rem] text-gold">{step.cadence}</p>
          <p className="mt-3 font-display text-2xl text-cream">{step.label}</p>
        </div>
      ))}
    </div>
  )
}
