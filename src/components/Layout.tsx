import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Nav } from './Nav'
import { Footer } from './Footer'
import { ThermalBackground } from './ui/ThermalBackground'
import { KineticCursor } from './ui/KineticCursor'

export function Layout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="relative flex min-h-screen flex-col">
      <ThermalBackground />

      {/*
        Architectural grid: hairlines at the outer layout gutters only (the
        edges of the max-w-7xl content bounds), never crossing into
        single-column content. Sits at z-0, behind everything else, so
        glass-card containers correctly blur it via backdrop-filter
        instead of it slicing over card text.
      */}
      <div
        className="pointer-events-none fixed inset-0 z-0 mx-auto hidden max-w-7xl justify-between px-6 md:flex"
        aria-hidden="true"
      >
        <span className="h-full w-px bg-white/[0.04]" />
        <span className="h-full w-px bg-white/[0.04]" />
      </div>

      {/*
        Viewport vignette: an ellipse (not a circle) sized to the
        viewport's own proportions, so the shadow gathers in the extreme
        corners instead of banding down the left/right edges. Sits at
        z-10, below the z-50 content wrapper, so it never washes over
        nav, sidebar, or corner UI text.
      */}
      <div
        className="pointer-events-none fixed inset-0 z-10"
        style={{ background: 'radial-gradient(ellipse 85% 75% at center, transparent 70%, rgba(0,0,0,0.35) 100%)' }}
        aria-hidden="true"
      />

      {/* Grain overlay stays above all page content, texturing everything uniformly. */}
      <div
        className="bg-grain pointer-events-none fixed inset-0 z-[60] opacity-[0.12]"
        aria-hidden="true"
      />

      <KineticCursor />

      <div className="relative z-50 flex flex-1 flex-col bg-transparent">
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
