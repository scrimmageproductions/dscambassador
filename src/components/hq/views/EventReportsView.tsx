import { submittedEventReports } from '../../../data/dashboard'

export function EventReportsView() {
  return (
    <div className="hairline divide-y divide-cream/10 bg-surface/40">
      <div className="hidden gap-4 px-6 py-4 sm:grid sm:grid-cols-3">
        {['Event', 'Submitted', 'Status'].map((h) => (
          <p key={h} className="label-mono text-[0.62rem] text-cream-wash">
            {h}
          </p>
        ))}
      </div>
      {submittedEventReports.map((r) => (
        <div key={r.event} className="grid gap-1 px-6 py-4 sm:grid-cols-3 sm:items-center sm:gap-4">
          <p className="font-display text-base text-cream">{r.event}</p>
          <p className="text-sm text-cream-3">{r.submitted}</p>
          <p className={`label-mono text-[0.65rem] ${r.status === 'Approved' ? 'text-gold' : 'text-cream-wash'}`}>
            {r.status}
          </p>
        </div>
      ))}
      <p className="px-6 py-4 text-xs leading-relaxed text-cream-wash/70">
        New reports are filed from the Take Action tab after an event.
      </p>
    </div>
  )
}
