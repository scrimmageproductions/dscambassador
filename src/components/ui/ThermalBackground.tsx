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

const MAGENTA = 'radial-gradient(circle at 35% 30%, #C400C4, #4B0082)'
const AMBER = 'radial-gradient(circle at 35% 30%, #FF8C00, #FF4500)'
const CYAN = 'radial-gradient(circle at 35% 30%, #00E5E8, #00838B)'

const bubbles: Bubble[] = [
  { id: 'b1', size: 420, top: '-6%', left: '-4%', gradient: AMBER, morph: 'thermal-morph-a', duration: 18, delay: -2 },
  { id: 'b2', size: 320, top: '4%', left: '58%', gradient: MAGENTA, morph: 'thermal-morph-b', duration: 22, delay: -9 },
  { id: 'b3', size: 260, top: '46%', left: '70%', gradient: CYAN, morph: 'thermal-morph-c', duration: 15, delay: -4 },
  { id: 'b4', size: 450, top: '52%', left: '-10%', gradient: MAGENTA, morph: 'thermal-morph-d', duration: 25, delay: -12 },
  { id: 'b5', size: 200, top: '18%', left: '30%', gradient: AMBER, morph: 'thermal-morph-c', duration: 14, delay: -6 },
  { id: 'b6', size: 380, top: '66%', left: '38%', gradient: AMBER, morph: 'thermal-morph-b', duration: 20, delay: -1 },
  { id: 'b7', size: 150, top: '30%', left: '80%', gradient: CYAN, morph: 'thermal-morph-a', duration: 12, delay: -8 },
  { id: 'b8', size: 300, top: '78%', left: '68%', gradient: MAGENTA, morph: 'thermal-morph-d', duration: 21, delay: -15 },
]

/**
 * Fixed, decorative ambient background: a metaball-style thermal-camera
 * liquid built from opaque, organically-morphing bubbles pushed through an
 * SVG gooey filter (blur + alpha threshold) so overlapping shapes visually
 * fuse and pull apart. Bubbles carry a subtle cursor-parallax offset. Sits
 * behind all page content (z-0, inside the shared z-10 content wrapper in
 * Layout) and below the grain overlay, which paints above everything.
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
        style={{ filter: 'url(#thermal-goo)', opacity: 0.35 }}
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
