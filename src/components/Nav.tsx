import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { LinkButton } from './ui/Button'

const links = [
  { to: '/program', label: 'Program' },
  { to: '/kit', label: 'Kit' },
  { to: '/campus', label: 'Campus' },
  { to: '/events', label: 'Events' },
  { to: '/guidelines', label: 'Guidelines' },
  { to: '/hq', label: 'HQ' },
]

export function Nav() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const [lastPathname, setLastPathname] = useState(location.pathname)

  if (location.pathname !== lastPathname) {
    setLastPathname(location.pathname)
    if (open) setOpen(false)
  }

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <nav className="sticky top-0 z-50 hairline-b bg-ink/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <NavLink to="/" className="group flex items-center gap-3">
            <img
              src="/text-logo-white.png"
              alt="Digital Spenders Club"
              className="h-8 w-auto object-contain sm:h-9"
            />
            <span className="label-mono hidden text-[0.65rem] text-cream-wash sm:inline">
              Ambassadors
            </span>
          </NavLink>

          <div className="hidden items-center gap-8 lg:flex">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `label-mono relative py-1 text-[0.72rem] text-cream-3 transition-colors hover:text-cream ${
                    isActive ? 'text-cream after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:bg-cream after:animate-underline' : ''
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>

          <div className="hidden lg:block">
            <LinkButton to="/apply" variant="solid" className="!px-5 !py-2.5">
              Apply
            </LinkButton>
          </div>

          <button
            type="button"
            className="flex flex-col gap-1.5 p-2 lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span
              className={`block h-px w-6 bg-cream transition-transform ${open ? 'translate-y-[3.5px] rotate-45' : ''}`}
            />
            <span
              className={`block h-px w-6 bg-cream transition-transform ${open ? '-translate-y-[3.5px] -rotate-45' : ''}`}
            />
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-40 bg-ink transition-opacity duration-300 lg:hidden ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div className="flex h-full flex-col justify-between px-6 pb-10 pt-24">
          <div className="flex flex-col gap-6">
            {links.map((l, i) => (
              <NavLink
                key={l.to}
                to={l.to}
                className="font-display text-4xl text-cream"
                style={{ transitionDelay: `${i * 40}ms` }}
              >
                {l.label}
              </NavLink>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            <LinkButton to="/apply" variant="solid">
              Apply now
            </LinkButton>
            <p className="label-mono text-[0.68rem] text-cream-wash">
              Questions? DM @YoungScrimmage
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
