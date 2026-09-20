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
// "Atmospheric background motion, not a dense wall of text": only this many
// of the available column slots ever have an active stream at once.
const MAX_COLUMNS = 26
// #E8E4D9, the exact cream requested for these characters.
const CREAM_RGB = '232, 228, 217'
const HEAD_ALPHA_MIN = 0.32
const HEAD_ALPHA_MAX = 0.55
// Per-tick multiplier applied to every trailing glyph's own alpha -- this is
// the *entire* fade mechanism. There is no canvas-level fill of any kind, so
// the canvas is fully transparent everywhere a character isn't currently
// drawn, letting the page's own background/noise texture show through.
const TRAIL_DECAY = 0.85
const MIN_ALPHA = 0.02

type TrailEntry = { char: string; alpha: number; row: number }
type Drop = { col: number; headRow: number; trail: TrailEntry[] }

function randomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)]
}

/**
 * Ambient digital-rain overlay: a restrained, cream-toned scattering of
 * digits and `$` that drifts down behind the Hero's own content. Meant to
 * be rendered as an absolutely-positioned child of a `position: relative`
 * container (the Hero section) -- it takes no space in the document flow
 * and introduces no section of its own, so it can never read as a boxed-off
 * block.
 *
 * Trails are tracked entirely in JS state (each Drop keeps an array of
 * {char, alpha, row} entries that decay independently) and the canvas is
 * `clearRect`'d, never filled, every frame -- there is no background paint
 * of any kind on the canvas, so whatever sits behind it (the Hero's own
 * bg-noise texture, its ambient glow) is always visible through the gaps
 * between characters. A CSS mask feathers the whole canvas to transparent
 * well before its own top/bottom edges.
 *
 * Purely decorative (aria-hidden) and skipped entirely under
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
    let width = 0
    let height = 0
    let drops: Drop[] = []
    let raf = 0
    let lastStep = 0

    // 0 while scrolled to the very top of the Hero, ramping to 1 by the
    // time the user has scrolled 75% of the Hero's own height -- drives the
    // fade-out and speed-up below, and gates the pause/resume of the draw
    // loop itself. Read at draw time only, never mutated inside draw.
    let scrollProgress = 0
    let scrollRaf = 0

    function updateScrollProgress() {
      scrollRaf = 0
      scrollProgress = Math.min(1, Math.max(0, window.scrollY / (height * 0.75)))
      // The draw loop stops scheduling itself once fully faded out (see
      // draw() below); resume it here the moment scrolling brings the Hero
      // back into its fading range.
      if (scrollProgress < 1 && raf === 0) {
        raf = requestAnimationFrame(draw)
      }
    }

    function handleScroll() {
      if (scrollRaf) return
      scrollRaf = requestAnimationFrame(updateScrollProgress)
    }

    function spawnDrops() {
      const totalColumns = Math.max(1, Math.floor(width / FONT_SIZE))
      const activeCount = Math.min(MAX_COLUMNS, totalColumns)
      const pool = Array.from({ length: totalColumns }, (_, i) => i)
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[pool[i], pool[j]] = [pool[j], pool[i]]
      }
      drops = pool.slice(0, activeCount).map((col) => ({
        col,
        headRow: Math.random() * -30,
        trail: [],
      }))
    }

    function resize() {
      const rect = containerEl.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvasEl.width = Math.floor(width * dpr)
      canvasEl.height = Math.floor(height * dpr)
      canvasEl.style.width = `${width}px`
      canvasEl.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      spawnDrops()
    }

    resize()
    window.addEventListener('resize', resize)
    updateScrollProgress()
    window.addEventListener('scroll', handleScroll, { passive: true })

    function draw(time: number) {
      // Fully out of the Hero's fade range: stop scheduling frames entirely
      // (no work at all, not even a clear) until a scroll event brings
      // scrollProgress back under 1 and reschedules us from
      // updateScrollProgress above.
      if (scrollProgress >= 1) {
        raf = 0
        // A fast scroll can jump straight past the fade range in one event,
        // freezing whatever was last drawn at a non-zero alpha -- clear it
        // so "paused" also means "actually invisible," not just "no longer
        // updating."
        ctx.clearRect(0, 0, width, height)
        return
      }
      raf = requestAnimationFrame(draw)
      if (time - lastStep < STEP_MS) return
      lastStep = time

      // No fillRect anywhere in this function -- clearRect is the only
      // canvas-level paint, so nothing but individual characters is ever
      // drawn to the canvas.
      ctx.clearRect(0, 0, width, height)
      ctx.font = `${FONT_SIZE}px "JetBrains Mono", ui-monospace, monospace`
      ctx.textBaseline = 'top'

      // Streams fall faster and fade out as the Hero scrolls past --
      // display-only multipliers, so the underlying trail-decay state
      // stays untouched and streams reappear cleanly if the user scrolls
      // back up before scrollProgress reaches 1.
      const speedMultiplier = 1 + scrollProgress * 0.5
      const fadeMultiplier = 1 - scrollProgress

      for (const drop of drops) {
        for (const entry of drop.trail) entry.alpha *= TRAIL_DECAY
        drop.trail = drop.trail.filter((entry) => entry.alpha >= MIN_ALPHA)

        if (drop.headRow * FONT_SIZE < height) {
          drop.trail.push({
            char: randomChar(),
            alpha: HEAD_ALPHA_MIN + Math.random() * (HEAD_ALPHA_MAX - HEAD_ALPHA_MIN),
            row: drop.headRow,
          })
          drop.headRow += ROWS_PER_STEP * speedMultiplier
        } else if (drop.trail.length === 0) {
          drop.headRow = Math.random() * -30
        }

        const x = drop.col * FONT_SIZE
        for (const entry of drop.trail) {
          const y = entry.row * FONT_SIZE
          if (y < -FONT_SIZE || y > height) continue
          const alpha = entry.alpha * fadeMultiplier
          if (alpha < MIN_ALPHA) continue
          ctx.fillStyle = `rgba(${CREAM_RGB}, ${alpha})`
          ctx.fillText(entry.char, x, y)
        }
      }
    }

    return () => {
      cancelAnimationFrame(raf)
      cancelAnimationFrame(scrollRaf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[1] block h-full w-full"
      style={{
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%)',
      }}
    />
  )
}
