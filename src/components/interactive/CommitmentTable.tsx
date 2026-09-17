import { useState } from 'react'
import { commitments } from '../../content/guidelines'

export function CommitmentTable() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="hairline divide-y divide-cream/10 glass-card">
      <div className="hidden grid-cols-[140px_1fr_1fr] gap-4 px-6 py-4 md:grid">
        <span className="label-mono text-[0.68rem] text-cream-wash">Frequency</span>
        <span className="label-mono text-[0.68rem] text-cream-wash">Task</span>
        <span className="label-mono text-[0.68rem] text-cream-wash">Example</span>
      </div>
      {commitments.map((row, i) => {
        const open = openIndex === i
        return (
          <div key={row.frequency} className="border-t border-cream/10 first:border-t-0 md:border-t-cream/10">
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : i)}
              aria-expanded={open}
              className="grid w-full grid-cols-1 gap-2 px-6 py-5 text-left transition-colors hover:bg-cream/[0.03] md:grid-cols-[140px_1fr_1fr] md:items-center md:gap-4"
            >
              <span className="font-display text-lg text-cream md:text-base">{row.frequency}</span>
              <span className="text-sm text-cream-2">{row.task}</span>
              <span className="flex items-center justify-between text-sm text-cream-3">
                {row.example}
                <span
                  className={`label-mono ml-3 shrink-0 text-cream-wash transition-transform ${open ? 'rotate-45' : ''}`}
                  aria-hidden="true"
                >
                  +
                </span>
              </span>
            </button>
            <div
              className={`grid transition-all duration-300 ease-out ${
                open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-6 text-sm leading-relaxed text-cream-3 md:pl-[164px]">
                  {row.detail}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
