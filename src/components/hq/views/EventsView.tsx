import { myEvents } from '../../../data/dashboard'
import { LinkButton } from '../../ui/Button'

const statusStyle: Record<string, string> = {
  Confirmed: 'text-gold',
  Recurring: 'text-cream',
  'Pending approval': 'text-cream-wash',
}

export function EventsView() {
  return (
    <div>
      <div className="hairline divide-y divide-cream/10 bg-surface/40">
        {myEvents.map((e) => (
          <div key={e.title} className="flex flex-col gap-2 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-lg text-cream">{e.title}</p>
              <p className="label-mono mt-1 text-[0.62rem] text-cream-wash">
                {e.role} &middot; {e.date}
              </p>
            </div>
            <span className={`label-mono text-[0.65rem] ${statusStyle[e.status] ?? 'text-cream-wash'}`}>
              {e.status}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <LinkButton to="/events" variant="ghost">
          Browse the full circuit
        </LinkButton>
      </div>
    </div>
  )
}
