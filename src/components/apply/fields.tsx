import type { ChangeEvent } from 'react'

export function TextField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  required,
}: {
  label: string
  name: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
  required?: boolean
}) {
  return (
    <div>
      <label htmlFor={name} className="label-mono text-[0.68rem] text-cream-wash">
        {label} {required ? <span className="text-gold">*</span> : null}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        className="hairline mt-2 w-full rounded-lg bg-surface px-4 py-3 text-sm text-cream placeholder:text-cream-wash/40 focus-visible:outline-cream"
      />
    </div>
  )
}

export function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  required,
}: {
  label: string
  name: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  required?: boolean
}) {
  return (
    <div>
      <label htmlFor={name} className="label-mono text-[0.68rem] text-cream-wash">
        {label} {required ? <span className="text-gold">*</span> : null}
      </label>
      <select
        id={name}
        name={name}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="hairline mt-2 w-full rounded-lg bg-surface px-4 py-3 text-sm text-cream focus-visible:outline-cream"
      >
        <option value="" disabled>
          Select
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export function PillGroup<T extends string>({
  label,
  options,
  value,
  onChange,
  required,
}: {
  label: string
  options: { value: T; label: string }[]
  value: T | ''
  onChange: (value: T) => void
  required?: boolean
}) {
  return (
    <div>
      <p className="label-mono text-[0.68rem] text-cream-wash">
        {label} {required ? <span className="text-gold">*</span> : null}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            aria-pressed={value === o.value}
            className={`label-mono rounded-lg border px-4 py-2 text-[0.68rem] transition-colors ${
              value === o.value ? 'border-cream bg-cream text-ink' : 'border-cream/25 text-cream-3 hover:border-cream/60'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}
