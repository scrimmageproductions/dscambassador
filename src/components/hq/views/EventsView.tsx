import { myEvents } from '../../../data/dashboard'
import { LinkButton } from '../../ui/Button'
import { EventRequestModule } from '../EventRequestModule'

const statusStyle: Record<string, string> = {
  Confirmed: 'text-gold',
  Recurring: 'text-cream',
  'Pending approval': 'text-cream-wash',
}

export function EventsView() {
  return (
    <div>
      <div className="hairline divide-y divide-cream/10 glass-card">
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

      <div className="mt-12">
        <p className="label-mono text-[0.68rem] text-cream-wash">Request budget &amp; assets</p>
        <h3 className="mt-3 font-display text-xl text-cream">Prep your next activation.</h3>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-cream-3">
          Submit a budget request with receipts attached, and pull whatever physical gear you
          need from the club.
        </p>
        <div className="mt-6">
          <EventRequestModule />
        </div>
      </div>
    </div>
  )
}
