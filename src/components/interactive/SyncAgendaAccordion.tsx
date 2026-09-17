import { useState } from 'react'

const agenda = [
  {
    title: 'Growth',
    detail: 'Where new members are coming from, what content is converting, and what to double down on.',
  },
  {
    title: 'Event opportunities',
    detail: 'Upcoming conferences, local SWC gatherings, and hackathons worth an ambassador presence.',
  },
  {
    title: 'Friction',
    detail: 'What is slowing ambassadors down: shipping, assets, communication, said out loud and fixed.',
  },
  {
    title: 'Suggestions',
    detail: 'Ambassador-sourced ideas for the program, the kit, and the club itself.',
  },
  {
    title: 'Program updates',
    detail: 'Changes to guidelines, kit drops, campus rollout, and what is coming next.',
  },
]

export function SyncAgendaAccordion() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="hairline divide-y divide-cream/10 glass-card">
      {agenda.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={item.title}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-cream/[0.03]"
            >
              <span className="font-display text-xl text-cream">{item.title}</span>
              <span className={`label-mono text-cream-wash transition-transform ${isOpen ? 'rotate-45' : ''}`} aria-hidden="true">
                +
              </span>
            </button>
            <div className={`grid transition-all duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
              <div className="overflow-hidden">
                <p className="px-6 pb-5 text-sm leading-relaxed text-cream-3">{item.detail}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
