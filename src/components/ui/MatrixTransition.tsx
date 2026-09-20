import { useEffect, useRef, type RefObject } from 'react'

// Character pool restricted to digits + dollar sign only for the ambient
// rain -- no Katakana, no Latin letters, on brand for a finance-culture
// club rather than a generic hacker aesthetic. The decrypted message below
// is the one deliberate exception: real letters as its *locked* end state.
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
// Per-tick multiplier applied to every trailing glyph's own alpha. Ramps
// from the base value toward TRAIL_DECAY_STAGE2 across stage 2, which is
// what makes the trails visually stretch into streaks during the cascade
// wipe (a slower decay = a longer-lived tail) -- no ctx.scale() needed.
const TRAIL_DECAY_BASE = 0.85
const TRAIL_DECAY_STAGE2 = 0.95
const MIN_ALPHA = 0.02

// -- Two-stage scroll choreography, keyed off a single scrollProgress in
// [0, 1] that tracks how far the gap between the Hero's CTA row and the
// "Real people" heading has scrolled through the viewport's vertical
// center. --
const STAGE1_START = 0.1
const STAGE1_END = 0.5
const FEEDER_COUNT = 3
const LANDING_OFFSET_PX = 60
const MESSAGE = '[ REAL WORLD PRESENCE ]'
const MESSAGE_FONT_SIZE = 13
const MESSAGE_LETTER_SPACING_EM = 0.18
const MESSAGE_LOCKED_ALPHA = 0.9
const MESSAGE_SCRAMBLE_ALPHA = 0.5
// How quickly a "feeder" stream eases toward the landing point once
// triggered -- a fraction of the remaining distance covered per tick.
const FEEDER_EASE = 0.08

type TrailEntry = { char: string; alpha: number; row: number }
type Drop = { col: number; headRow: number; trail: TrailEntry[]; isFeeder: boolean }

function randomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)]
}

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v))
}

/**
 * Ambient digital-rain overlay for the Hero, choreographed into a two-stage
 * scroll-driven transition as the user scrolls from the Hero's CTAs toward
 * the "Real people. Real presence." heading:
 *
 * Stage 1 (scrollProgress 0.1-0.5, "Terminal Decryption"): 2-3 of the
 * ambient streams nearest horizontal center stop free-falling and ease
 * toward a fixed landing row just above the heading, while an independent
 * message layer scrambles through digits and locks left-to-right into
 * "[ REAL WORLD PRESENCE ]".
 *
 * Stage 2 (scrollProgress 0.5-1.0, "Cascade Acceleration Wipe"): every
 * remaining ambient stream's fall speed ramps toward 4x and its trail decay
 * slows (stretching into a streak), while both the rain and the locked
 * message fade to fully transparent by scrollProgress = 1, at which point
 * the draw loop stops scheduling itself entirely until scrolling back
 * brings the transition into range again.
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
  headingRef,
}: {
  ctaRef: RefObject<HTMLElement | null>
  headingRef: RefObject<HTMLElement | null>
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

    // 0 while the CTA-to-heading gap hasn't reached the viewport's vertical
    // center yet, ramping to 1 once that gap has fully scrolled past it.
    let scrollProgress = 0
    let scrollRaf = 0

    // Landing point tracks the heading itself -- both its top edge (for Y)
    // and its own horizontal center (for X) -- rather than the canvas's
    // full width, so the message sits directly above the heading instead
    // of drifting under whatever sits in the other column (e.g. the
    // lifestyle photo) in a multi-column layout.
    function computeLandingPoint() {
      const heading = headingRef.current
      if (!heading) return { x: width / 2, y: height }
      const headingRect = heading.getBoundingClientRect()
      const containerRect = containerEl.getBoundingClientRect()
      return {
        x: headingRect.left - containerRect.left + headingRect.width / 2,
        y: headingRect.top - containerRect.top - LANDING_OFFSET_PX,
      }
    }

    function computeScrollProgress() {
      const cta = ctaRef.current
      const heading = headingRef.current
      if (!cta || !heading) return 0
      const ctaRect = cta.getBoundingClientRect()
      const headingRect = heading.getBoundingClientRect()
      const gapSpan = headingRect.top - ctaRect.bottom
      if (gapSpan <= 0) return 1
      const viewportMid = window.innerHeight / 2
      return clamp01((viewportMid - ctaRect.bottom) / gapSpan)
    }

    function updateScrollProgress() {
      scrollRaf = 0
      scrollProgress = computeScrollProgress()
      // The draw loop stops scheduling itself once fully faded out (see
      // draw() below); resume it here the moment scrolling brings the
      // transition back into range.
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
      const chosenCols = pool.slice(0, activeCount)
      // Feeders converge on the heading's own horizontal center (where the
      // message will land), not the canvas's -- those only coincide in a
      // single-column layout.
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

    function drawMessage(lockProgress: number, globalFade: number) {
      const lockedCount = Math.floor(lockProgress * MESSAGE.length)
      ctx.font = `${MESSAGE_FONT_SIZE}px "JetBrains Mono", ui-monospace, monospace`
      ctx.textBaseline = 'middle'
      const charWidth = ctx.measureText('0').width
      const advance = charWidth + MESSAGE_FONT_SIZE * MESSAGE_LETTER_SPACING_EM
      const totalWidth = advance * MESSAGE.length
      let x = landingX - totalWidth / 2
      for (let i = 0; i < MESSAGE.length; i++) {
        const target = MESSAGE[i]
        if (target !== ' ') {
          const locked = i < lockedCount
          const display = locked ? target : randomChar()
          const alpha = (locked ? MESSAGE_LOCKED_ALPHA : MESSAGE_SCRAMBLE_ALPHA) * globalFade
          if (alpha >= MIN_ALPHA) {
            ctx.fillStyle = `rgba(${CREAM_RGB}, ${alpha})`
            ctx.fillText(display, x, landingY)
          }
        }
        x += advance
      }
    }

    function draw(time: number) {
      // Fully faded past the transition: stop scheduling frames entirely
      // (no work at all, not even a clear) until a scroll event brings
      // scrollProgress back under 1 and reschedules us from
      // updateScrollProgress above.
      if (scrollProgress >= 1) {
        raf = 0
        ctx.clearRect(0, 0, width, height)
        return
      }
      raf = requestAnimationFrame(draw)
      if (time - lastStep < STEP_MS) return
      lastStep = time

      ;({ x: landingX, y: landingY } = computeLandingPoint())

      const stage1Active = scrollProgress >= STAGE1_START
      const stage1Progress = clamp01((scrollProgress - STAGE1_START) / (STAGE1_END - STAGE1_START))
      const stage2Progress = clamp01((scrollProgress - STAGE1_END) / (1 - STAGE1_END))

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

      if (stage1Active) {
        drawMessage(stage1Progress, globalFade)
      }
    }

    return () => {
      cancelAnimationFrame(raf)
      cancelAnimationFrame(scrollRaf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [ctaRef, headingRef])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[1] block h-full w-full"
      style={{
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)',
      }}
    />
  )
}
