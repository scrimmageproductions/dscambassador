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

const CREAM_GLOW = 'radial-gradient(circle, rgba(232,223,208,0.55) 0%, rgba(232,223,208,0) 70%)'
const AMBER_GLOW = 'radial-gradient(circle, rgba(42,40,37,0.6) 0%, rgba(42,40,37,0) 70%)'

const bubbles: Bubble[] = [
  { id: 'b1', size: 340, top: '-8%', left: '-6%', gradient: CREAM_GLOW, morph: 'thermal-morph-a', duration: 18, delay: -2 },
  { id: 'b2', size: 220, top: '2%', left: '55%', gradient: CREAM_GLOW, morph: 'thermal-morph-b', duration: 22, delay: -9 },
  { id: 'b3', size: 150, top: '40%', left: '72%', gradient: AMBER_GLOW, morph: 'thermal-morph-c', duration: 15, delay: -4 },
  { id: 'b4', size: 350, top: '50%', left: '-12%', gradient: CREAM_GLOW, morph: 'thermal-morph-d', duration: 25, delay: -12 },
  { id: 'b5', size: 120, top: '14%', left: '28%', gradient: CREAM_GLOW, morph: 'thermal-morph-c', duration: 14, delay: -6 },
  { id: 'b6', size: 300, top: '62%', left: '34%', gradient: CREAM_GLOW, morph: 'thermal-morph-b', duration: 20, delay: -1 },
  { id: 'b7', size: 90, top: '26%', left: '82%', gradient: AMBER_GLOW, morph: 'thermal-morph-a', duration: 12, delay: -8 },
  { id: 'b8', size: 240, top: '76%', left: '64%', gradient: CREAM_GLOW, morph: 'thermal-morph-d', duration: 21, delay: -15 },
  { id: 'b9', size: 80, top: '8%', left: '85%', gradient: CREAM_GLOW, morph: 'thermal-morph-b', duration: 13, delay: -3 },
  { id: 'b10', size: 180, top: '34%', left: '10%', gradient: AMBER_GLOW, morph: 'thermal-morph-c', duration: 17, delay: -10 },
  { id: 'b11', size: 260, top: '4%', left: '20%', gradient: CREAM_GLOW, morph: 'thermal-morph-a', duration: 24, delay: -5 },
  { id: 'b12', size: 100, top: '58%', left: '88%', gradient: CREAM_GLOW, morph: 'thermal-morph-d', duration: 16, delay: -13 },
  { id: 'b13', size: 200, top: '86%', left: '12%', gradient: AMBER_GLOW, morph: 'thermal-morph-b', duration: 19, delay: -7 },
  { id: 'b14', size: 130, top: '68%', left: '48%', gradient: CREAM_GLOW, morph: 'thermal-morph-c', duration: 23, delay: -11 },
]

/**
 * Fixed, decorative ambient background: soft pools of cream/amber light
 * that drift and swell into each other. No hard-edged shapes — an extreme
 * blur dissolves every blob into pure ambient glow, and a screen blend
 * between blobs makes overlaps brighten like merging light rather than
 * composite like flat cutouts. Bubbles carry a subtle cursor-parallax
 * offset. Sits behind all page content (z-0, inside the shared z-10
 * content wrapper in Layout) and below the grain overlay, which paints
 * above everything.
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
      <div
        ref={ref}
        className="absolute inset-0 blur-[140px]"
        style={{ isolation: 'isolate' }}
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
              mixBlendMode: 'screen',
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
