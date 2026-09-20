import { useEffect, useRef } from 'react'

// Character pool restricted to digits + dollar sign only -- no Katakana, no
// Latin letters, on brand for a finance-culture club rather than a generic
// hacker aesthetic.
const CHARS = '$0123456789'.split('')
const FONT_SIZE = 16
// Time between simulation ticks, decoupled from the render loop's frame
// rate -- this is what keeps the fall "moderate" and refined instead of
// hyperactive regardless of a 60Hz vs. 120Hz display.
const STEP_MS = 130
const ROWS_PER_STEP = 0.45
// Only draw a fresh glyph in a given column on roughly 60% of ticks, so the
// rain reads as a scattering of ambient drips rather than a dense wall of
// code filling every column every frame.
const DRAW_CHANCE = 0.6
// #E8E4D9, the exact cream requested for these characters.
const CREAM_RGB = '232, 228, 217'
// Must equal --color-bg exactly -- any mismatch here is what turns the
// trail fade into a visible solid-color box against the page background.
const BG_RGB = '10, 10, 10'
const BG_HEX = '#0a0a0a'
const FADE_RGBA = `rgba(${BG_RGB}, 0.1)`

/**
 * Decorative canvas interstitial woven between the Hero and "Real people.
 * Real presence." sections: a restrained, cream-toned take on digital rain
 * -- digits and `$` only, falling at a deliberately unhurried, sparse pace.
 *
 * To avoid reading as a separate boxed-off section, the wrapper overlaps
 * its neighbors with negative margins and is fully inert
 * (`pointer-events-none`, low z-index) so it visually flows underneath the
 * Hero's CTA row and the next section's heading rather than sitting between
 * them as its own block. The canvas itself carries a mask-image that
 * feathers its top and bottom to full transparency well inside its own
 * bounds, on top of the trail fade using --color-bg exactly (not an
 * approximation) so there's never a visible seam against the shared page
 * background. Purely decorative (aria-hidden) and skipped entirely under
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
        if (Math.random() < DRAW_CHANCE) {
          const char = CHARS[Math.floor(Math.random() * CHARS.length)]
          const x = i * FONT_SIZE
          const y = drops[i] * FONT_SIZE
          const alpha = 0.18 + Math.random() * 0.3
          ctx.fillStyle = `rgba(${CREAM_RGB}, ${alpha})`
          ctx.fillText(char, x, y)
        }

        if (drops[i] * FONT_SIZE > height && Math.random() > 0.975) {
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
      className="matrix-transition-wrapper pointer-events-none relative z-0 -mt-[100px] -mb-[100px] h-[400px] overflow-hidden bg-bg bg-noise"
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block h-full w-full"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent, black 35%, black 65%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 35%, black 65%, transparent)',
        }}
      />
    </section>
  )
}
