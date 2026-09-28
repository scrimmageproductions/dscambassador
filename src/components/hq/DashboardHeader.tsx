import { Link } from 'react-router-dom'

export function DashboardHeader({
  name,
  role,
  isAdmin,
  onSignOut,
}: {
  name: string
  role: 'primary' | 'emeritus'
  isAdmin: boolean
  onSignOut: () => void
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl text-cream md:text-4xl">Welcome back, {name}!</h1>
        <p className="mt-2 text-sm text-cream-3 md:text-base">
          Access your ambassador management tools and resources.
        </p>
      </div>
      <div className="flex items-center gap-3">
        {isAdmin ? (
          <Link
            to="/admin"
            className="label-mono rounded-full border border-white/15 px-4 py-1.5 text-[0.65rem] text-cream-wash transition-colors hover:border-white/30 hover:text-cream"
          >
            Admin panel &rarr;
          </Link>
        ) : null}
        <span className="label-mono rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-[0.65rem] text-gold">
          {role === 'emeritus' ? 'Emeritus member' : 'Ambassador'}
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
