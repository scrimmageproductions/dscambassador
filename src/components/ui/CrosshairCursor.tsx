import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

const RING_SPRING = { stiffness: 200, damping: 28 }

const INTERACTIVE_SELECTOR = 'a, button, [role="button"], input, select, textarea, label, [tabindex]'
const MEDIA_SELECTOR = 'img, video'

type Variant = 'default' | 'interactive' | 'media'

function variantFor(target: EventTarget | null): Variant {
  if (!(target instanceof Element)) return 'default'
  if (target.closest(MEDIA_SELECTOR)) return 'media'
  if (target.closest(INTERACTIVE_SELECTOR)) return 'interactive'
  return 'default'
}

/**
 * Minimalist editorial cursor for fine-pointer, hover-capable desktops:
 * a 6px dot tracking 1:1, and a 32px hairline ring trailing it on a
 * damped spring. Expands over interactive elements, inverts over media
 * via mix-blend-mode. Entirely inert on touch (`@media (hover: none)`),
 * pointer-events stay off throughout so it never intercepts clicks.
 */
export function CrosshairCursor() {
  const [active, setActive] = useState(false)
  const [variant, setVariant] = useState<Variant>('default')
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, RING_SPRING)
  const ringY = useSpring(y, RING_SPRING)

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return

    function handleMove(e: MouseEvent) {
      x.set(e.clientX)
      y.set(e.clientY)
      setVariant(variantFor(e.target))
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

  const isInteractive = variant === 'interactive'
  const isMedia = variant === 'media'
  const ringSize = isInteractive ? 52 : 32
  const ringBorder = isInteractive ? 'rgba(243, 237, 227, 0.6)' : 'rgba(243, 237, 227, 0.25)'
  const dotSize = isInteractive ? 4 : 6

  return (
    <>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[90] hidden md:block"
        style={{ x, y, translateX: '-50%', translateY: '-50%', opacity: active ? 1 : 0, willChange: 'transform' }}
        aria-hidden="true"
      >
        <motion.div
          className="rounded-full bg-cream"
          animate={{ width: dotSize, height: dotSize }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        />
      </motion.div>

      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[90] hidden md:block"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: active ? 1 : 0,
          mixBlendMode: isMedia ? 'difference' : 'normal',
          willChange: 'transform',
        }}
        aria-hidden="true"
      >
        <motion.div
          className="rounded-full"
          animate={{ width: ringSize, height: ringSize, borderColor: ringBorder }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          style={{ borderWidth: 1, borderStyle: 'solid' }}
        />
      </motion.div>
    </>
  )
}
