import { useEffect, useRef } from 'react'

// Character pool restricted to digits + dollar sign only -- no Katakana, no
// Latin letters, on brand for a finance-culture club rather than a generic
// hacker aesthetic.
const CHARS = '$0123456789'.split('')
const FONT_SIZE = 16
// Time between simulation ticks, decoupled from the render loop's frame
// rate -- this is what keeps the fall "moderate" and refined instead of
// hyperactive regardless of a 60Hz vs. 120Hz display.
const STEP_MS = 90
const ROWS_PER_STEP = 0.5
// The site's ambient decorative cream tone (matches PixelCursor's aura and
// ThermalBackground's glow), distinct from the primary text --color-cream --
// closer to "quiet luxury" than the classic Matrix green.
const CREAM_RGB = '232, 223, 208'
const BG_HEX = '#0a0a0a'
const FADE_RGBA = 'rgba(10, 10, 10, 0.08)'

/**
 * Decorative canvas interstitial between the Hero and "Real people. Real
 * presence." sections: a restrained, cream-toned take on digital rain --
 * digits and `$` only, falling at a deliberately unhurried pace with
 * per-glyph opacity variance. Top/bottom gradient overlays dissolve it into
 * the surrounding --color-bg with no hard edges on either side. Purely
 * decorative (aria-hidden) and skipped entirely under
 * prefers-reduced-motion, matching this codebase's other ambient effects.
 */
export function MatrixTransition() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const canvasRefEl = canvasRef.current
    const containerRefEl = canvasRefEl?.parentElement
    const ctxRef = canvasRefEl?.getContext('2d')
    if (!canvasRefEl || !containerRefEl || !ctxRef) return

    // Re-bind as explicitly non-nullable: TS's control-flow narrowing from
    // the guard above doesn't extend into the nested resize/draw closures.
    const canvasEl: HTMLCanvasElement = canvasRefEl
    const containerEl: HTMLElement = containerRefEl
    const ctx: CanvasRenderingContext2D = ctxRef

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let columns = 0
    let drops: number[] = []
    let width = 0
    let height = 0

    function resize() {
      const rect = containerEl.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvasEl.width = Math.floor(width * dpr)
      canvasEl.height = Math.floor(height * dpr)
      canvasEl.style.width = `${width}px`
      canvasEl.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      columns = Math.max(1, Math.floor(width / FONT_SIZE))
      drops = Array.from({ length: columns }, () => Math.random() * -40)
      ctx.fillStyle = BG_HEX
      ctx.fillRect(0, 0, width, height)
    }

    resize()
    window.addEventListener('resize', resize)

    let raf = 0
    let lastStep = 0

    function draw(time: number) {
      raf = requestAnimationFrame(draw)
      if (time - lastStep < STEP_MS) return
      lastStep = time

      ctx.fillStyle = FADE_RGBA
      ctx.fillRect(0, 0, width, height)

      ctx.font = `${FONT_SIZE}px "JetBrains Mono", ui-monospace, monospace`
      ctx.textBaseline = 'top'

      for (let i = 0; i < columns; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)]
        const x = i * FONT_SIZE
        const y = drops[i] * FONT_SIZE
        const alpha = 0.35 + Math.random() * 0.45
        ctx.fillStyle = `rgba(${CREAM_RGB}, ${alpha})`
        ctx.fillText(char, x, y)

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i] += ROWS_PER_STEP
      }
    }

    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <section
      className="matrix-transition-wrapper relative h-[50vh] min-h-[300px] max-h-[450px] overflow-hidden bg-bg"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24 md:h-32"
        style={{ background: `linear-gradient(to bottom, ${BG_HEX}, transparent)` }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 md:h-32"
        style={{ background: `linear-gradient(to top, ${BG_HEX}, transparent)` }}
      />
    </section>
  )
}
