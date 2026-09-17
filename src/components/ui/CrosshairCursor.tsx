import { useEffect, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'

const SPRING = { stiffness: 220, damping: 26, mass: 0.5 }
const SPRING_REDUCED = { stiffness: 1000, damping: 100, mass: 0.2 }

/**
 * Minimal reticle that softly trails the real cursor (spring-smoothed, not
 * 1:1) on fine-pointer desktop viewports. Purely decorative: pointer-events
 * stay off, and the actual OS cursor is hidden site-wide only while this is
 * active (see `.crosshair-cursor-active` in index.css), never blocking
 * clicks. No-ops on touch devices.
 */
export function CrosshairCursor() {
  const [active, setActive] = useState(false)
  const reduceMotion = useReducedMotion()
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, reduceMotion ? SPRING_REDUCED : SPRING)
  const sy = useSpring(y, reduceMotion ? SPRING_REDUCED : SPRING)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return

    function handleMove(e: MouseEvent) {
      x.set(e.clientX)
      y.set(e.clientY)
      setActive(true)
    }
    function handleLeave() {
      setActive(false)
    }

    window.addEventListener('mousemove', handleMove)
    document.documentElement.addEventListener('mouseleave', handleLeave)
    document.body.classList.add('crosshair-cursor-active')

    return () => {
      window.removeEventListener('mousemove', handleMove)
      document.documentElement.removeEventListener('mouseleave', handleLeave)
      document.body.classList.remove('crosshair-cursor-active')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[90] hidden md:block"
      style={{ x: sx, y: sy, translateX: '-50%', translateY: '-50%', opacity: active ? 1 : 0 }}
      aria-hidden="true"
    >
      <div className="relative h-7 w-7">
        <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cream" />
        <span className="absolute left-1/2 top-0 h-2 w-px -translate-x-1/2 bg-cream/70" />
        <span className="absolute bottom-0 left-1/2 h-2 w-px -translate-x-1/2 bg-cream/70" />
        <span className="absolute left-0 top-1/2 h-px w-2 -translate-y-1/2 bg-cream/70" />
        <span className="absolute right-0 top-1/2 h-px w-2 -translate-y-1/2 bg-cream/70" />
      </div>
    </motion.div>
  )
}
