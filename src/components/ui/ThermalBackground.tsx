import { useEffect, useRef } from 'react'

type Bubble = {
  id: string
  size: number
  top: string
  left: string
  gradient: string
  morph: 'thermal-morph-a' | 'thermal-morph-b' | 'thermal-morph-c' | 'thermal-morph-d'
  duration: number
  delay: number
}

const CREAM = 'radial-gradient(circle at 35% 30%, #FFFFFF, #F3EDE3)'
const IVORY = 'radial-gradient(circle at 35% 30%, #F3EDE3, #E8DFD0)'
const CHARCOAL = 'radial-gradient(circle at 35% 30%, #2A2A2A, #1E1E1E)'

const bubbles: Bubble[] = [
  { id: 'b1', size: 340, top: '-8%', left: '-6%', gradient: IVORY, morph: 'thermal-morph-a', duration: 18, delay: -2 },
  { id: 'b2', size: 220, top: '2%', left: '55%', gradient: CREAM, morph: 'thermal-morph-b', duration: 22, delay: -9 },
  { id: 'b3', size: 150, top: '40%', left: '72%', gradient: CHARCOAL, morph: 'thermal-morph-c', duration: 15, delay: -4 },
  { id: 'b4', size: 350, top: '50%', left: '-12%', gradient: CREAM, morph: 'thermal-morph-d', duration: 25, delay: -12 },
  { id: 'b5', size: 120, top: '14%', left: '28%', gradient: IVORY, morph: 'thermal-morph-c', duration: 14, delay: -6 },
  { id: 'b6', size: 300, top: '62%', left: '34%', gradient: IVORY, morph: 'thermal-morph-b', duration: 20, delay: -1 },
  { id: 'b7', size: 90, top: '26%', left: '82%', gradient: CHARCOAL, morph: 'thermal-morph-a', duration: 12, delay: -8 },
  { id: 'b8', size: 240, top: '76%', left: '64%', gradient: CREAM, morph: 'thermal-morph-d', duration: 21, delay: -15 },
  { id: 'b9', size: 80, top: '8%', left: '85%', gradient: CREAM, morph: 'thermal-morph-b', duration: 13, delay: -3 },
  { id: 'b10', size: 180, top: '34%', left: '10%', gradient: CHARCOAL, morph: 'thermal-morph-c', duration: 17, delay: -10 },
  { id: 'b11', size: 260, top: '4%', left: '20%', gradient: IVORY, morph: 'thermal-morph-a', duration: 24, delay: -5 },
  { id: 'b12', size: 100, top: '58%', left: '88%', gradient: CREAM, morph: 'thermal-morph-d', duration: 16, delay: -13 },
  { id: 'b13', size: 200, top: '86%', left: '12%', gradient: CHARCOAL, morph: 'thermal-morph-b', duration: 19, delay: -7 },
  { id: 'b14', size: 130, top: '68%', left: '48%', gradient: IVORY, morph: 'thermal-morph-c', duration: 23, delay: -11 },
]

/**
 * Fixed, decorative ambient background: a metaball-style monochrome wax
 * liquid built from opaque cream/ivory/charcoal bubbles pushed through an
 * SVG gooey filter (blur + alpha threshold) so overlapping shapes visually
 * fuse and pull apart, dimmed at the container level to read as a subtle
 * watermark rather than a bright shape. Bubbles carry a subtle cursor-
 * parallax offset. Sits behind all page content (z-0, inside the shared
 * z-10 content wrapper in Layout) and below the grain overlay, which
 * paints above everything.
 */
export function ThermalBackground() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const el = ref.current
    if (!el) return

    let raf = 0
    function handleMove(e: MouseEvent) {
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el?.style.setProperty('--mx', `${x * 16}px`)
        el?.style.setProperty('--my', `${y * 16}px`)
      })
    }

    window.addEventListener('mousemove', handleMove)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-bg" aria-hidden="true">
      <svg className="absolute h-0 w-0" aria-hidden="true" focusable="false">
        <defs>
          <filter id="thermal-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="18" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      <div
        ref={ref}
        className="absolute inset-0"
        style={{ filter: 'url(#thermal-goo)', opacity: 0.15 }}
      >
        {bubbles.map((b) => (
          <div
            key={b.id}
            className={`thermal-bubble ${b.morph}`}
            style={{
              width: b.size,
              height: b.size,
              top: b.top,
              left: b.left,
              background: b.gradient,
              animationName: b.morph,
              animationDuration: `${b.duration}s`,
              animationDelay: `${b.delay}s`,
              animationTimingFunction: 'ease-in-out',
              animationIterationCount: 'infinite',
              animationDirection: 'alternate',
            }}
          />
        ))}
      </div>
    </div>
  )
}
