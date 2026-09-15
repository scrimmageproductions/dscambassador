const DAYS_IN_MONTH = 30
const POST_DAYS = [8, 22]

export function CommitmentCalendar() {
  return (
    <div className="hairline bg-surface/40 p-6 md:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="label-mono text-[0.68rem] text-cream-wash">One month, illustrated</p>
        <div className="flex flex-wrap gap-4 text-xs text-cream-3">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cream" /> Original post
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full border border-cream-wash/60" /> Daily engage
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-6 gap-2 sm:grid-cols-10">
        {Array.from({ length: DAYS_IN_MONTH }, (_, i) => i + 1).map((day) => {
          const isPost = POST_DAYS.includes(day)
          return (
            <div
              key={day}
              className={`hairline flex aspect-square flex-col items-center justify-center gap-1 text-[0.6rem] ${
                isPost ? 'bg-cream text-ink' : 'text-cream-wash/70'
              }`}
              title={isPost ? 'Original DSC content due' : 'Engage within 24h of any drop'}
            >
              <span>{day}</span>
              {!isPost && <span className="h-1 w-1 rounded-full border border-cream-wash/50" />}
            </div>
          )
        })}
      </div>

      <div className="mt-6 hairline-t flex items-center justify-between pt-6 text-sm text-cream-3">
        <span>Once a quarter, add one IRL activation.</span>
        <span className="label-mono text-[0.68rem] text-gold">1x / quarter</span>
      </div>
    </div>
  )
}
