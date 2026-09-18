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

// Pad by 1 unit on every side so the dark outline halo (drawn just
// outside the fill) has room without clipping against the SVG bounds.
const OUTLINE_PAD = 1
const GRID_W = 8 + OUTLINE_PAD * 2
const GRID_H = 13 + OUTLINE_PAD * 2

const ARROW_PIXELS = ARROW_BITMAP.flatMap((row, y) =>
  [...row].flatMap((cell, x) => (cell === 'X' ? [{ x: x + OUTLINE_PAD, y: y + OUTLINE_PAD }] : [])),
)

const ARROW_SET = new Set(ARROW_PIXELS.map(({ x, y }) => `${x},${y}`))
const outlineSeen = new Set<string>()
const OUTLINE_PIXELS = ARROW_PIXELS.flatMap(({ x, y }) => {
  const neighbors = []
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue
      const nx = x + dx
      const ny = y + dy
      const key = `${nx},${ny}`
      if (!ARROW_SET.has(key) && !outlineSeen.has(key)) {
        outlineSeen.add(key)
        neighbors.push({ x: nx, y: ny })
      }
    }
  }
  return neighbors
})

const AURA_SPRING = { stiffness: 260, damping: 26, mass: 0.5 }
const AURA_SIZE_SPRING = { stiffness: 300, damping: 28 }

const CREAM = '#E8DFD0'
const MATTE_BLACK = '#0D0D0D'
const AURA_OPACITY_RESTING = 0.04

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
 * Monochrome pixel-art cursor for fine-pointer, hover-capable desktops: a
 * crisp black-outlined cream pixel arrow (no color fringing) backed by an
 * ultra-subtle warm cream aura that trails on a damped spring and blooms
 * slightly wider over interactive elements. Both layers invert via
 * mix-blend-mode over media. Entirely inert on touch (`@media (hover:
 * none)`); every layer stays pointer-events: none so clicks always pass
 * straight through.
 */
export function PixelCursor() {
  const [variant, setVariant] = useState<Variant>('default')
  const [visible, setVisible] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const auraX = useSpring(x, AURA_SPRING)
  const auraY = useSpring(y, AURA_SPRING)

  const auraSizeTarget = useMotionValue(24)
  const auraSize = useSpring(auraSizeTarget, AURA_SIZE_SPRING)

  const auraOpacityTarget = useMotionValue(0)
  const auraOpacity = useSpring(auraOpacityTarget, AURA_SIZE_SPRING)

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return

    function handleMove(e: MouseEvent) {
      x.set(e.clientX)
      y.set(e.clientY)
      const v = variantFor(e.target)
      setVariant(v)
      auraSizeTarget.set(v === 'interactive' ? 32 : 24)
      auraOpacityTarget.set(AURA_OPACITY_RESTING)
      setVisible(true)
    }
    function handleLeave() {
      setVisible(false)
      auraOpacityTarget.set(0)
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
      {/*
        Ambient diffusion aura: an ultra-subtle warm-cream haze, not a
        hotspot -- zero color contamination, just a faint monochrome glow.
        Gradient carries full-strength color so the opacity spring alone
        (a flat 0.04 whenever visible) sets the true visible intensity,
        smoothly, without needing to animate the gradient text itself.
      */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 rounded-full"
        style={{
          x: auraX,
          y: auraY,
          translateX: '-50%',
          translateY: '-50%',
          width: auraSize,
          height: auraSize,
          opacity: auraOpacity,
          background: 'radial-gradient(circle, rgba(232, 223, 208, 1) 0%, rgba(232, 223, 208, 0) 65%)',
          backdropFilter: 'blur(8px)',
          mixBlendMode: blend,
          willChange: 'transform',
        }}
      />

      {/*
        Pixel-art arrow, tip pinned exactly to the pointer position. The
        SVG grid is padded by OUTLINE_PAD to fit the dark outline halo, so
        the wrapper is nudged back by that same amount to keep the tip
        aligned with the real cursor position.
      */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0"
        style={{
          x,
          y,
          translateX: `-${OUTLINE_PAD * PIXEL}px`,
          translateY: `-${OUTLINE_PAD * PIXEL}px`,
          opacity: visible ? 1 : 0,
          mixBlendMode: blend,
          willChange: 'transform',
        }}
      >
        <svg
          width={GRID_W * PIXEL}
          height={GRID_H * PIXEL}
          viewBox={`0 0 ${GRID_W} ${GRID_H}`}
          shapeRendering="crispEdges"
          style={{ imageRendering: 'pixelated', display: 'block' }}
        >
          {OUTLINE_PIXELS.map(({ x: px, y: py }) => (
            <rect key={`outline-${px}-${py}`} x={px} y={py} width={1} height={1} fill={MATTE_BLACK} />
          ))}
          {ARROW_PIXELS.map(({ x: px, y: py }) => (
            <rect key={`fill-${px}-${py}`} x={px} y={py} width={1} height={1} fill={CREAM} />
          ))}
        </svg>
      </motion.div>
    </div>
  )
}
