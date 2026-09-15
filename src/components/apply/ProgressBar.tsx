const steps = ['Identity', 'Presence', 'Fit', 'Agreement']

export function ProgressBar({ step }: { step: number }) {
  return (
    <div>
      <div className="flex justify-between">
        {steps.map((label, i) => (
          <span
            key={label}
            className={`label-mono text-[0.62rem] sm:text-[0.68rem] ${
              i <= step ? 'text-cream' : 'text-cream-wash/40'
            }`}
          >
            {label}
          </span>
        ))}
      </div>
      <div className="mt-3 h-px w-full bg-cream/10">
        <div
          className="h-px bg-cream transition-all duration-500 ease-out"
          style={{ width: `${(step / (steps.length - 1)) * 100}%` }}
        />
      </div>
      <p className="label-mono mt-2 text-[0.62rem] text-cream-wash">
        Step {step + 1} of {steps.length}
      </p>
    </div>
  )
}
