import { directory } from '../../../data/dashboard'

export function DirectoryView() {
  return (
    <div className="hairline divide-y divide-cream/10 bg-surface/40">
      <div className="hidden gap-4 px-6 py-4 sm:grid sm:grid-cols-4">
        {['Name', 'Region', 'Focus', 'Ambassador since'].map((h) => (
          <p key={h} className="label-mono text-[0.62rem] text-cream-wash">
            {h}
          </p>
        ))}
      </div>
      {directory.map((a) => (
        <div key={a.name} className="grid gap-1 px-6 py-4 sm:grid-cols-4 sm:items-center sm:gap-4">
          <p className="font-display text-base text-cream">{a.name}</p>
          <p className="text-sm text-cream-3">{a.region}</p>
          <p className="text-sm text-cream-3">{a.focus}</p>
          <p className="label-mono text-[0.65rem] text-cream-wash">{a.since}</p>
        </div>
      ))}
    </div>
  )
}
