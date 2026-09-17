import { activityFeed } from '../../../data/dashboard'

export function ActivityView() {
  return (
    <div className="hairline divide-y divide-cream/10 glass-card">
      {activityFeed.map((item) => (
        <div key={item.title + item.time} className="flex flex-col gap-1 px-6 py-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-display text-base text-cream">{item.title}</p>
            <p className="mt-1 text-sm text-cream-3">{item.detail}</p>
          </div>
          <p className="label-mono shrink-0 text-[0.62rem] text-cream-wash sm:pl-4">{item.time}</p>
        </div>
      ))}
    </div>
  )
}
