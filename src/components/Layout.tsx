import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Nav } from './Nav'
import { Footer } from './Footer'
import { ThermalBackground } from './ui/ThermalBackground'

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
