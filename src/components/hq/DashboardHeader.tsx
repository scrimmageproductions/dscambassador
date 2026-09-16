export function DashboardHeader({ name, onSignOut }: { name: string; onSignOut: () => void }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl text-cream md:text-4xl">Welcome back, {name}!</h1>
        <p className="mt-2 text-sm text-cream-3 md:text-base">
          Access your ambassador management tools and resources.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span className="label-mono rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-[0.65rem] text-gold">
          Ambassador
        </span>
        <button
          type="button"
          onClick={onSignOut}
          className="label-mono text-[0.65rem] text-cream-wash underline underline-offset-4 hover:text-cream"
        >
          Sign out
        </button>
      </div>
    </div>
  )
}
