import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

const PIXEL = 2

// 8x13 pixel-grid arrow (classic pointer silhouette with a back "foot"),
// drawn as unit squares so shape-rendering: crispEdges keeps every edge
// axis-aligned regardless of scale.
const ARROW_BITMAP = [
  'X.......',
  'XX......',
  'XXX.....',
  'XXXX....',
  'XXXXX...',
  'XXXXXX..',
  'XXXXXXX.',
  'XXXXXXXX',
  'XXXXX...',
  'XX.XX...',
  'X...XX..',
  '.....XX.',
  '.....XX.',
]

const ARROW_PIXELS = ARROW_BITMAP.flatMap((row, y) =>
  [...row].flatMap((cell, x) => (cell === 'X' ? [{ x, y }] : [])),
)

const AURA_SPRING = { stiffness: 260, damping: 26, mass: 0.5 }
const AURA_SIZE_SPRING = { stiffness: 300, damping: 28 }

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
 * Luxury pixel-art cursor for fine-pointer, hover-capable desktops: a crisp
 * pixel-grid arrow with a CRT-style chromatic-aberration fringe, backed by a
 * soft cream aura that trails on a damped spring and blooms wider over
 * interactive elements. Both layers invert via mix-blend-mode over media.
 * Entirely inert on touch (`@media (hover: none)`); every layer stays
 * pointer-events: none so clicks always pass straight through.
 */
export function PixelCursor() {
  const [variant, setVariant] = useState<Variant>('default')
  const [visible, setVisible] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const auraX = useSpring(x, AURA_SPRING)
  const auraY = useSpring(y, AURA_SPRING)

  const auraSizeTarget = useMotionValue(32)
  const auraSize = useSpring(auraSizeTarget, AURA_SIZE_SPRING)

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return

    function handleMove(e: MouseEvent) {
      x.set(e.clientX)
      y.set(e.clientY)
      const v = variantFor(e.target)
      setVariant(v)
      auraSizeTarget.set(v === 'interactive' ? 48 : 32)
      setVisible(true)
    }
    function handleLeave() {
      setVisible(false)
    }

    window.addEventListener('mousemove', handleMove)
    document.documentElement.addEventListener('mouseleave', handleLeave)
    document.body.classList.add('pixel-cursor-active')

    return () => {
      window.removeEventListener('mousemove', handleMove)
      document.documentElement.removeEventListener('mouseleave', handleLeave)
      document.body.classList.remove('pixel-cursor-active')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isMedia = variant === 'media'
  const blend = isMedia ? ('difference' as const) : ('normal' as const)

  return (
    <div className="pointer-events-none fixed inset-0 z-[90] hidden md:block" aria-hidden="true">
      {/* Ambient diffusion aura, centered behind the arrow, trailing on a spring. */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 rounded-full"
        style={{
          x: auraX,
          y: auraY,
          translateX: '-50%',
          translateY: '-50%',
          width: auraSize,
          height: auraSize,
          opacity: visible ? 1 : 0,
          background: 'radial-gradient(circle, rgba(243, 237, 227, 0.12) 0%, rgba(243, 237, 227, 0) 75%)',
          backdropFilter: 'blur(12px)',
          mixBlendMode: blend,
          willChange: 'transform',
        }}
      />

      {/* Pixel-art arrow, tip pinned exactly to the pointer position. */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0"
        style={{
          x,
          y,
          opacity: visible ? 1 : 0,
          mixBlendMode: blend,
          filter:
            'drop-shadow(-1px 0px 0px rgba(255, 0, 80, 0.6)) drop-shadow(1px 0px 0px rgba(0, 220, 255, 0.6))',
          willChange: 'transform',
        }}
      >
        <svg
          width={8 * PIXEL}
          height={13 * PIXEL}
          viewBox="0 0 8 13"
          shapeRendering="crispEdges"
          style={{ imageRendering: 'pixelated', display: 'block' }}
        >
          {ARROW_PIXELS.map(({ x: px, y: py }) => (
            <rect key={`${px}-${py}`} x={px} y={py} width={1} height={1} fill="#F3EDE3" />
          ))}
        </svg>
      </motion.div>
    </div>
  )
}
