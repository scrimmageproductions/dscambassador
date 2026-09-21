import { useEffect, useRef, type RefObject } from 'react'
import {
  CREAM_RGB,
  FONT_SIZE,
  HEAD_ALPHA_MAX,
  HEAD_ALPHA_MIN,
  MAX_COLUMNS,
  MIN_ALPHA,
  randomChar,
  ROWS_PER_STEP,
  STEP_MS,
  TRAIL_DECAY_BASE,
} from './matrixRain'

// Per-tick multiplier applied to every trailing glyph's own alpha. Ramps
// from TRAIL_DECAY_BASE toward TRAIL_DECAY_STAGE2 across stage 2, which is
// what makes the trails visually stretch into streaks during the cascade
// wipe (a slower decay = a longer-lived tail) -- no ctx.scale() needed.
const TRAIL_DECAY_STAGE2 = 0.95
// How much of the gap to targetScrollProgress the smoothed value closes per
// rAF tick -- this is what turns a fast-scroll flick's instant jump to 1
// into a graceful multi-frame decay instead of a hard cut.
const SCROLL_SMOOTHING = 0.08
// How close smoothProgress must sit to a fully-faded target before the draw
// loop actually stops scheduling itself -- LERP asymptotically approaches
// but never exactly reaches its target.
const FADE_EPSILON = 0.005

// -- Two-stage scroll choreography, keyed off a single scrollProgress in
// [0, 1] that tracks how far the gap between the Hero's CTA row and the
// ScrambleHeader target has scrolled through the viewport's vertical
// center. --
const STAGE1_START = 0.1
const STAGE1_END = 0.5
const FEEDER_COUNT = 3
// How quickly a "feeder" stream eases toward the landing point once
// triggered -- a fraction of the remaining distance covered per tick.
const FEEDER_EASE = 0.08

type TrailEntry = { char: string; alpha: number; row: number }
type Drop = { col: number; headRow: number; trail: TrailEntry[]; isFeeder: boolean }

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v))
}

/**
 * Ambient digital-rain overlay for the Hero, choreographed into a two-stage
 * scroll-driven transition as the user scrolls from the Hero's CTAs toward
 * the ScrambleHeader (`targetRef`) that opens the next section:
 *
 * Stage 1 (scrollProgress 0.1-0.5, "Terminal Decryption"): 2-3 of the
 * ambient streams nearest horizontal center stop free-falling and ease
 * toward a landing point on the target's own top edge, at the horizontal
 * center of the viewport -- ScrambleHeader independently locks its own
 * text once scrollProgress crosses its own (lower) threshold, so the rain
 * visually "arrives" first and the real DOM header follows.
 *
 * Stage 2 (scrollProgress 0.5-1.0, "Cascade Acceleration Wipe"): every
 * remaining ambient stream's fall speed ramps toward 4x and its trail decay
 * slows (stretching into a streak), fading to fully transparent by
 * scrollProgress = 1. The DOM header itself is unaffected by this fade --
 * it stays put.
 *
 * Every stage above is driven by smoothProgress, a LERP'd chase of the raw
 * scroll-derived target (updated every rAF tick regardless of the STEP_MS
 * pacing throttle below), not the raw value itself -- a fast scroll flick
 * can jump the target straight to 1, but smoothProgress only catches up
 * over several frames, so drops keep sweeping and fading gracefully off the
 * bottom instead of vanishing in a single hard cut. The draw loop only
 * stops scheduling itself once both the target AND the smoothed value have
 * actually settled at the fully-faded end, and resumes automatically the
 * moment scrolling brings the transition back into range.
 *
 * Rendered as a `position: absolute` overlay spanning a shared `relative`
 * ancestor that wraps both the Hero and the next section -- it takes no
 * space in the document flow and introduces no section boundary of its
 * own. The canvas is only ever `clearRect`'d, never filled, so the page's
 * own background/noise texture is always visible through the gaps between
 * characters. Purely decorative (aria-hidden) and skipped entirely under
 * prefers-reduced-motion.
 */
export function MatrixTransition({
  ctaRef,
  targetRef,
}: {
  ctaRef: RefObject<HTMLElement | null>
  targetRef: RefObject<HTMLElement | null>
}) {
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
    let landingY = 0
    let landingX = 0

    // targetScrollProgress: 0 while the CTA-to-target gap hasn't reached the
    // viewport's vertical center yet, ramping to 1 once that gap has fully
    // scrolled past it -- this can jump discontinuously on a fast scroll
    // flick. smoothProgress chases it via LERP every rAF tick and is what
    // actually drives the visuals below, so a fast flick decays gracefully
    // over several frames instead of snapping straight to the end state.
    let targetScrollProgress = 0
    let smoothProgress = 0
    let scrollRaf = 0

    // Landing point is the horizontal center of the viewport/canvas, at the
    // target's own top edge -- the streams converge exactly where the real
    // DOM header (rendered separately by ScrambleHeader) begins.
    function computeLandingPoint() {
      const target = targetRef.current
      if (!target) return { x: width / 2, y: height }
      const targetRect = target.getBoundingClientRect()
      const containerRect = containerEl.getBoundingClientRect()
      return {
        x: width / 2,
        y: targetRect.top - containerRect.top,
      }
    }

    function computeScrollProgress() {
      const cta = ctaRef.current
      const target = targetRef.current
      if (!cta || !target) return 0
      const ctaRect = cta.getBoundingClientRect()
      const targetRect = target.getBoundingClientRect()
      const gapSpan = targetRect.top - ctaRect.bottom
      if (gapSpan <= 0) return 1
      const viewportMid = window.innerHeight / 2
      return clamp01((viewportMid - ctaRect.bottom) / gapSpan)
    }

    // True only once both the raw target AND the smoothed value have
    // settled at the fully-faded end -- i.e. there's genuinely nothing left
    // to animate, not just "the target jumped to 1 this instant."
    function isFullyFadedOut() {
      return targetScrollProgress >= 1 && smoothProgress >= 1 - FADE_EPSILON
    }

    function updateScrollProgress() {
      scrollRaf = 0
      targetScrollProgress = computeScrollProgress()
      // The draw loop stops scheduling itself once fully faded out (see
      // draw() below); resume it here the moment scrolling brings the
      // transition back into range.
      if (!isFullyFadedOut() && raf === 0) {
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
      const chosenCols = pool.slice(0, activeCount)
      // Feeders converge on the viewport's horizontal center, where the
      // ScrambleHeader lands.
      const centerCol = landingX / FONT_SIZE
      const feederCols = new Set(
        [...chosenCols].sort((a, b) => Math.abs(a - centerCol) - Math.abs(b - centerCol)).slice(0, FEEDER_COUNT),
      )
      drops = chosenCols.map((col) => ({
        col,
        headRow: Math.random() * -30,
        trail: [],
        isFeeder: feederCols.has(col),
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
      ;({ x: landingX, y: landingY } = computeLandingPoint())
      spawnDrops()
    }

    resize()
    window.addEventListener('resize', resize)
    updateScrollProgress()
    window.addEventListener('scroll', handleScroll, { passive: true })

    function draw(time: number) {
      // Chase the (possibly discontinuous, e.g. after a fast scroll flick)
      // target every rAF tick, independent of the STEP_MS throttle below --
      // this is what makes the whole transition decay gracefully instead of
      // snapping straight to its end state.
      smoothProgress += (targetScrollProgress - smoothProgress) * SCROLL_SMOOTHING

      // Only stop once there's genuinely nothing left to animate: not just
      // "the raw scroll target reached 1," but the smoothed value (and so
      // every visual it drives) has actually settled there too.
      if (isFullyFadedOut()) {
        raf = 0
        ctx.clearRect(0, 0, width, height)
        return
      }
      raf = requestAnimationFrame(draw)
      if (time - lastStep < STEP_MS) return
      lastStep = time

      ;({ x: landingX, y: landingY } = computeLandingPoint())

      const stage1Active = smoothProgress >= STAGE1_START
      const stage2Progress = clamp01((smoothProgress - STAGE1_END) / (1 - STAGE1_END))

      // Stage 2 ("Cascade Acceleration Wipe"): ramps in smoothly past the
      // scrollProgress = 0.5 midpoint. All three read as 1x/base/opaque
      // whenever stage2Progress is 0, i.e. throughout stages 0-1.
      const velocityMultiplier = 1 + stage2Progress * 3
      const trailDecay = TRAIL_DECAY_BASE + (TRAIL_DECAY_STAGE2 - TRAIL_DECAY_BASE) * stage2Progress
      const globalFade = 1 - stage2Progress

      // No fillRect anywhere in this function -- clearRect is the only
      // canvas-level paint, so nothing but individual characters is ever
      // drawn to the canvas.
      ctx.clearRect(0, 0, width, height)
      ctx.font = `${FONT_SIZE}px "JetBrains Mono", ui-monospace, monospace`
      ctx.textBaseline = 'top'

      const landingRow = landingY / FONT_SIZE

      for (const drop of drops) {
        for (const entry of drop.trail) entry.alpha *= trailDecay
        drop.trail = drop.trail.filter((entry) => entry.alpha >= MIN_ALPHA)

        if (drop.isFeeder && stage1Active) {
          // Ease toward the landing point and hold -- this is the "2-3
          // central streams land" cue that feeds the decrypting message.
          drop.headRow += (landingRow - drop.headRow) * FEEDER_EASE
          drop.trail.push({
            char: randomChar(),
            alpha: HEAD_ALPHA_MIN + Math.random() * (HEAD_ALPHA_MAX - HEAD_ALPHA_MIN),
            row: drop.headRow,
          })
        } else if (drop.headRow * FONT_SIZE < height) {
          drop.trail.push({
            char: randomChar(),
            alpha: HEAD_ALPHA_MIN + Math.random() * (HEAD_ALPHA_MAX - HEAD_ALPHA_MIN),
            row: drop.headRow,
          })
          drop.headRow += ROWS_PER_STEP * velocityMultiplier
        } else if (drop.trail.length === 0) {
          drop.headRow = Math.random() * -30
        }

        const x = drop.col * FONT_SIZE
        for (const entry of drop.trail) {
          const y = entry.row * FONT_SIZE
          if (y < -FONT_SIZE || y > height) continue
          const alpha = entry.alpha * globalFade
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
  }, [ctaRef, targetRef])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[1] block h-full w-full"
      style={{
        maskImage: 'linear-gradient(to bottom, black 0%, black 75%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 75%, transparent 100%)',
      }}
    />
  )
}
