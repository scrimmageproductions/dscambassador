import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Nav } from './Nav'
import { Footer } from './Footer'
import { ThermalBackground } from './ui/ThermalBackground'
import { CrosshairCursor } from './ui/CrosshairCursor'

export function Layout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="relative flex min-h-screen flex-col">
      <ThermalBackground />
      <div
        className="bg-grain pointer-events-none fixed inset-0 z-30 opacity-[0.12]"
        aria-hidden="true"
      />

      {/* Architectural grid: faint vertical hairlines echoing a print column grid. */}
      <div
        className="pointer-events-none fixed inset-0 z-20 mx-auto hidden max-w-7xl justify-between px-6 md:flex"
        aria-hidden="true"
      >
        <span className="h-full w-px bg-white/[0.04]" />
        <span className="h-full w-px bg-white/[0.04]" />
        <span className="h-full w-px bg-white/[0.04]" />
        <span className="h-full w-px bg-white/[0.04]" />
        <span className="h-full w-px bg-white/[0.04]" />
      </div>

      {/* Viewport vignette: frames the whole screen, darkening the outer edges. */}
      <div
        className="pointer-events-none fixed inset-0 z-40"
        style={{ background: 'radial-gradient(circle, transparent 60%, rgba(0,0,0,0.8) 100%)' }}
        aria-hidden="true"
      />

      <CrosshairCursor />

      <div className="relative z-10 flex flex-1 flex-col bg-transparent">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-cream focus:px-4 focus:py-2 focus:text-ink"
        >
          Skip to content
        </a>
        <Nav />
        <main id="main" className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}
