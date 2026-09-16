import { useRef, type MouseEvent, type ReactNode } from 'react'
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion'

const SPRING = { stiffness: 300, damping: 30, mass: 0.6 }

/**
 * Wraps a card in a mouse-tracked 3D tilt with a soft specular glare that
 * follows the cursor. Springs back to flat on mouse leave. No-ops entirely
 * under prefers-reduced-motion (tilt is a hover-only embellishment, never
 * load-bearing for content).
 */
export function TiltCard({
  children,
  className = '',
  maxTilt = 8,
  glare = true,
}: {
  children: ReactNode
  className?: string
  maxTilt?: number
  glare?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const sx = useSpring(px, SPRING)
  const sy = useSpring(py, SPRING)

  const rotateX = useTransform(sy, [0, 1], [maxTilt, -maxTilt])
  const rotateY = useTransform(sx, [0, 1], [-maxTilt, maxTilt])
  const glareX = useTransform(sx, [0, 1], ['0%', '100%'])
  const glareY = useTransform(sy, [0, 1], ['0%', '100%'])
  const glareOpacity = useSpring(0, SPRING)
  const glareBackground = useMotionTemplate`radial-gradient(280px circle at ${glareX} ${glareY}, rgba(243,237,227,0.18), rgba(196,165,116,0.06) 45%, transparent 70%)`

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    px.set((e.clientX - rect.left) / rect.width)
    py.set((e.clientY - rect.top) / rect.height)
  }

  function handleEnter() {
    glareOpacity.set(1)
  }

  function handleLeave() {
    px.set(0.5)
    py.set(0.5)
    glareOpacity.set(0)
  }

  if (reduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className={`relative will-change-transform ${className}`}
    >
      {children}
      {glare && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-screen"
          style={{ background: glareBackground, opacity: glareOpacity }}
        />
      )}
    </motion.div>
  )
}
