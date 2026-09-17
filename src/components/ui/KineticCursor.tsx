import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

const BASE_SIZE = 6
const MAX_STRETCH = 1.8
const MIN_SQUEEZE = 0.7
const MAX_SPEED = 2.2 // px/ms considered "full stretch"
const ROTATE_THRESHOLD = 0.4 // px moved per frame before we bother re-aiming
const MAGNET_STRENGTH = 0.25

const POSITION_SPRING = { stiffness: 700, damping: 42, mass: 0.4 }
const DEFORM_SPRING = { stiffness: 520, damping: 30, mass: 0.3 }
const OPACITY_SPRING = { stiffness: 320, damping: 32 }

const INTERACTIVE_SELECTOR = 'a, button, [role="button"], input, select, textarea, label, [tabindex]'
const MEDIA_SELECTOR = 'img, video'

type Variant = 'default' | 'interactive' | 'media'

function variantFor(target: EventTarget | null): Variant {
  if (!(target instanceof Element)) return 'default'
  if (target.closest(MEDIA_SELECTOR)) return 'media'
  if (target.closest(INTERACTIVE_SELECTOR)) return 'interactive'
  return 'default'
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

/**
 * Kinetic velocity-morph cursor for fine-pointer, hover-capable desktops: a
 * single cream capsule that stretches and aims itself along the direction of
 * travel in proportion to instantaneous mouse speed (recomputed every
 * animation frame, decoupled from mousemove event rate), then springs back
 * to a resting 6px dot the instant motion stops. Magnetizes gently toward
 * hovered interactive elements and inverts via mix-blend-mode over media.
 * Entirely inert on touch (`@media (hover: none)`); pointer-events stay off
 * throughout so it never intercepts clicks.
 */
export function KineticCursor() {
  const [variant, setVariant] = useState<Variant>('default')

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const displayX = useSpring(x, POSITION_SPRING)
  const displayY = useSpring(y, POSITION_SPRING)

  const widthTarget = useMotionValue(BASE_SIZE)
  const heightTarget = useMotionValue(BASE_SIZE)
  const rotateTarget = useMotionValue(0)
  const width = useSpring(widthTarget, DEFORM_SPRING)
  const height = useSpring(heightTarget, DEFORM_SPRING)
  const rotate = useSpring(rotateTarget, DEFORM_SPRING)

  const opacityTarget = useMotionValue(0)
  const opacity = useSpring(opacityTarget, OPACITY_SPRING)

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return

    let rafId: number
    let mouseX = -100
    let mouseY = -100
    let prevX = -100
    let prevY = -100
    let prevTime = performance.now()
    let magnetRect: DOMRect | null = null

    function handleMove(e: MouseEvent) {
      mouseX = e.clientX
      mouseY = e.clientY

      const interactiveEl = e.target instanceof Element ? e.target.closest(INTERACTIVE_SELECTOR) : null
      const v = interactiveEl ? 'interactive' : variantFor(e.target)
      setVariant(v)
      opacityTarget.set(v === 'interactive' ? 1 : 0.85)
      magnetRect = interactiveEl ? interactiveEl.getBoundingClientRect() : null
    }
    function handleLeave() {
      opacityTarget.set(0)
    }

    function loop(now: number) {
      const dt = Math.max(now - prevTime, 1)
      const dx = mouseX - prevX
      const dy = mouseY - prevY
      const dist = Math.hypot(dx, dy)
      const speed = dist / dt

      const t = clamp(speed / MAX_SPEED, 0, 1)
      widthTarget.set(BASE_SIZE * (1 + t * (MAX_STRETCH - 1)))
      heightTarget.set(BASE_SIZE * (1 - t * (1 - MIN_SQUEEZE)))
      if (dist > ROTATE_THRESHOLD) {
        rotateTarget.set((Math.atan2(dy, dx) * 180) / Math.PI)
      }

      let targetX = mouseX
      let targetY = mouseY
      if (magnetRect) {
        const cx = magnetRect.left + magnetRect.width / 2
        const cy = magnetRect.top + magnetRect.height / 2
        targetX += (cx - mouseX) * MAGNET_STRENGTH
        targetY += (cy - mouseY) * MAGNET_STRENGTH
      }
      x.set(targetX)
      y.set(targetY)

      prevX = mouseX
      prevY = mouseY
      prevTime = now
      rafId = requestAnimationFrame(loop)
    }

    rafId = requestAnimationFrame(loop)
    window.addEventListener('mousemove', handleMove)
    document.documentElement.addEventListener('mouseleave', handleLeave)
    document.body.classList.add('kinetic-cursor-active')

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', handleMove)
      document.documentElement.removeEventListener('mouseleave', handleLeave)
      document.body.classList.remove('kinetic-cursor-active')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isMedia = variant === 'media'

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[90] hidden md:block"
      style={{
        x: displayX,
        y: displayY,
        translateX: '-50%',
        translateY: '-50%',
        width,
        height,
        rotate,
        opacity,
        borderRadius: 9999,
        backgroundColor: '#F3EDE3',
        mixBlendMode: isMedia ? 'difference' : 'normal',
        willChange: 'transform',
      }}
      aria-hidden="true"
    />
  )
}
