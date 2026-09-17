import { Link } from 'react-router-dom'
import { Tagline } from './ui/Tagline'

export function Footer() {
  return (
    <footer className="hairline-t bg-ink">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <img
              src="/text-logo-white.png"
              alt="Digital Spenders Club"
              className="h-10 w-auto object-contain"
            />
            <p className="label-mono mt-2 text-[0.65rem] text-cream-wash">Ambassador Program</p>
            <Tagline className="mt-4" />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-cream-3">
              Questions? DM{' '}
              <a
                href="https://twitter.com/YoungScrimmage"
                target="_blank"
                rel="noreferrer"
                className="text-cream underline decoration-cream/40 underline-offset-4 hover:decoration-cream"
              >
                @YoungScrimmage
              </a>
              .
            </p>
          </div>

          <div>
            <p className="label-mono text-[0.68rem] text-cream-wash">Program</p>
            <ul className="mt-4 space-y-3 text-sm text-cream-3">
              <li><Link to="/program" className="hover:text-cream">The Program</Link></li>
              <li><Link to="/kit" className="hover:text-cream">The Kit</Link></li>
              <li><Link to="/campus" className="hover:text-cream">Campus</Link></li>
              <li><Link to="/events" className="hover:text-cream">Events</Link></li>
              <li><Link to="/guidelines" className="hover:text-cream">Guidelines</Link></li>
              <li><Link to="/apply" className="hover:text-cream">Apply</Link></li>
            </ul>
          </div>

          <div>
            <p className="label-mono text-[0.68rem] text-cream-wash">Elsewhere</p>
            <ul className="mt-4 space-y-3 text-sm text-cream-3">
              <li>
                <a href="https://spenders.club" target="_blank" rel="noreferrer" className="hover:text-cream">
                  spenders.club
                </a>
              </li>
              <li>
                <a href="https://instagram.com/spenders_club" target="_blank" rel="noreferrer" className="hover:text-cream">
                  @spenders_club
                </a>
              </li>
              <li>
                <a href="https://twitter.com/spenders_club" target="_blank" rel="noreferrer" className="hover:text-cream">
                  @spenders_club
                </a>
              </li>
              <li>
                <a href="https://sheeets.xyz" target="_blank" rel="noreferrer" className="hover:text-cream">
                  Ecosystem calendar
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="hairline-t mt-12 flex flex-col gap-3 pt-8 text-xs text-cream-wash/70 sm:flex-row sm:items-center sm:justify-between">
          <p>© Digital Spenders Club. Ambassador Program.</p>
          <p className="label-mono">Members move first.</p>
        </div>
      </div>
    </footer>
  )
}
