import { useEffect, useRef, useState } from 'react'
import { CREAM_RGB, FONT_SIZE, randomChar } from './matrixRain'

const BAR_DURATION_MS = 1800
// Cinematic exit choreography once loadingProgress hits 100% -- an
// anticipation beat, then a slow-building zoom, then a data stream that
// fades in partway through the zoom and outlives it slightly, then a hard
// cut. Every duration below is deliberate: this is meant to read as
// luxurious and Web3-architectural, not a jump-scare glitch.
const HOLD_MS = 250 // Phase 1: hold the completed mark + bar, static.
const PLUNGE_MS = 450 // Phase 2: full duration of the DSC scale transition.
const PLUNGE_SCALE = 15
// Smooth start, hard acceleration toward the end -- gives the eye time to
// track the motion before it outruns the viewport.
const PLUNGE_EASE = 'cubic-bezier(0.5, 0, 0.2, 1)'
const BAR_FADE_MS = 200 // How long the bar takes to fade once the hold ends.
// Phase 3: the data stream ignites this far into the plunge (not at its
// start), and keeps running for STREAM_MS after that -- overlapping the
// tail of the zoom rather than waiting for it to finish.
const STREAM_DELAY_MS = 250
const STREAM_FADE_MS = 200
const STREAM_MS = 300
// Pixels advanced per rendered frame (not gated by any step throttle) --
// still brisk, but slower than a full-flood flash so it reads as code
// streaming past rather than a wall of static.
const STREAM_VY = 16
// ~60-70% of available column slots active, leaving negative space between
// streams instead of a solid wall.
const STREAM_DENSITY = 0.65

const BOOT_SEEN_KEY = 'dsc-boot-seen'

const CREAM = '#E8DFD0'
const CREAM_FAINT = 'rgba(232, 223, 208, 0.1)'
const MATTE_BLACK = '#0D0D0D'

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Classic 5x7 blocky pixel-font glyphs, laid out with a 1-unit gap between
// letters so each gets its own independent outline once dilated.
const LETTER_D = ['XXXX.', 'X...X', 'X...X', 'X...X', 'X...X', 'X...X', 'XXXX.']
const LETTER_S = ['.XXXX', 'X....', 'X....', '.XXX.', '....X', '....X', 'XXXX.']
const LETTER_C = ['.XXXX', 'X....', 'X....', 'X....', 'X....', 'X....', '.XXXX']
const WORD = [LETTER_D, LETTER_S, LETTER_C]
const LETTER_GAP = 1
const PAD = 1

// Each coarse letter-pixel renders as a BLOCK x BLOCK square of fine units.
const BLOCK = 6

const FILLED = WORD.flatMap((letter, letterIndex) => {
  const xOffset = PAD + WORD.slice(0, letterIndex).reduce((sum, l) => sum + l[0].length + LETTER_GAP, 0)
  return letter.flatMap((row, y) =>
    [...row].flatMap((cell, x) => (cell === 'X' ? [{ x: x + xOffset, y: y + PAD }] : [])),
  )
})

const FILLED_SET = new Set(FILLED.map(({ x, y }) => `${x},${y}`))
const outlineSeen = new Set<string>()
const OUTLINE = FILLED.flatMap(({ x, y }) => {
  const neighbors = []
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue
      const nx = x + dx
      const ny = y + dy
      const key = `${nx},${ny}`
      if (!FILLED_SET.has(key) && !outlineSeen.has(key)) {
        outlineSeen.add(key)
        neighbors.push({ x: nx, y: ny })
      }
    }
  }
  return neighbors
})

const GRID_W = PAD * 2 + WORD.reduce((sum, l) => sum + l[0].length, 0) + LETTER_GAP * (WORD.length - 1)
const GRID_H = PAD * 2 + WORD[0].length

// Reveal order sweeps strictly left-to-right across the letterforms (column
// by column, top-to-bottom within a column) so the mark resolves the same
// way a scanning dot-matrix display would, in lockstep with loadingProgress.
const REVEAL_ORDER = [...FILLED].sort((a, b) => a.x - b.x || a.y - b.y)
const REVEAL_INDEX = new Map(REVEAL_ORDER.map(({ x, y }, i) => [`${x},${y}`, i]))
export const TOTAL_DOTS = FILLED.length

/** The dot-matrix "DSC" mark: a matte-black-outlined pixel wordmark whose
 * interior fills in dot-by-dot (in `revealCount` order) with flat, solid
 * cream -- no gradient, no pattern, no glow, so every revealed pixel is
 * 100% sharp against the matte-black background. Unrevealed letter-pixels
 * sit at low, flat opacity until their turn comes up in the sweep. */
function DotMatrixMark({ revealCount }: { revealCount: number }) {
  return (
    <svg
      width={GRID_W * BLOCK}
      height={GRID_H * BLOCK}
      viewBox={`0 0 ${GRID_W * BLOCK} ${GRID_H * BLOCK}`}
      shapeRendering="crispEdges"
      style={{ imageRendering: 'pixelated', display: 'block' }}
      role="img"
      aria-label="Digital Spenders Club"
    >
      {OUTLINE.map(({ x, y }) => (
        <rect key={`o-${x}-${y}`} x={x * BLOCK} y={y * BLOCK} width={BLOCK} height={BLOCK} fill={MATTE_BLACK} />
      ))}
      {FILLED.map(({ x, y }) => {
        const revealed = (REVEAL_INDEX.get(`${x},${y}`) ?? 0) < revealCount
        return (
          <rect
            key={`f-${x}-${y}`}
            x={x * BLOCK}
            y={y * BLOCK}
            width={BLOCK}
            height={BLOCK}
            fill={revealed ? CREAM : CREAM_FAINT}
          />
        )
      })}
    </svg>
  )
}

// circOut-ish ease, applied once to loadingProgress so the pixel sweep and
// the bar -- both driven off the same number -- share an identical curve.
function ease(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

/**
 * Phase 3 of the exit sequence -- "The Data Stream": mounted only for the
 * `STREAM_MS` window that starts partway through the zoom. Fades in over
 * `STREAM_FADE_MS` (a plain opacity transition, triggered by flipping
 * `visible` one frame after mount) rather than snapping to full brightness,
 * and only ~`STREAM_DENSITY` of the available column slots carry a stream,
 * so it reads as a deep data current with negative space between columns
 * instead of a solid wall of static. Each active column is redrawn every
 * frame with fresh glyphs and a bottom-heavy brightness gradient (long
 * streaks fading upward), shoved down by `STREAM_VY` px/frame -- brisk, but
 * slower than the flood-style flash this replaced. It never outlives its
 * effect: the parent unmounts it the instant the phase ends.
 */
function MatrixStream() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    const canvasRefEl = canvasRef.current
    const ctxRef = canvasRefEl?.getContext('2d')
    if (!canvasRefEl || !ctxRef) return
    const canvasEl: HTMLCanvasElement = canvasRefEl
    const ctx: CanvasRenderingContext2D = ctxRef

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const width = window.innerWidth
    const height = window.innerHeight
    canvasEl.width = Math.floor(width * dpr)
    canvasEl.height = Math.floor(height * dpr)
    canvasEl.style.width = `${width}px`
    canvasEl.style.height = `${height}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.font = `${FONT_SIZE}px "JetBrains Mono", ui-monospace, monospace`
    ctx.textBaseline = 'top'

    // Only ~STREAM_DENSITY of the column slots carry a stream, chosen once
    // (not reshuffled per frame) so the gaps read as a stable current
    // rather than per-frame flicker.
    const totalColumnSlots = Math.ceil(width / FONT_SIZE)
    const activeCount = Math.max(1, Math.floor(totalColumnSlots * STREAM_DENSITY))
    const pool = Array.from({ length: totalColumnSlots }, (_, i) => i)
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[pool[i], pool[j]] = [pool[j], pool[i]]
    }
    const activeCols = pool.slice(0, activeCount)

    const totalRows = Math.ceil(height / FONT_SIZE) + 2
    let yOffset = 0
    let raf = 0

    function draw() {
      raf = requestAnimationFrame(draw)
      yOffset = (yOffset + STREAM_VY) % FONT_SIZE
      ctx.clearRect(0, 0, width, height)
      for (const col of activeCols) {
        const x = col * FONT_SIZE
        for (let row = -2; row <= totalRows; row++) {
          const y = row * FONT_SIZE + yOffset
          if (y < -FONT_SIZE || y > height) continue
          // Streaks stretched long: brightest at the bottom leading edge,
          // fading toward the top of the stream.
          const depth = (y + FONT_SIZE) / (height + FONT_SIZE * 2)
          const alpha = 0.35 + depth * 0.65
          ctx.fillStyle = `rgba(${CREAM_RGB}, ${alpha})`
          ctx.fillText(randomChar(), x, y)
        }
      }
    }
    raf = requestAnimationFrame(draw)

    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20 block"
      style={{ opacity: visible ? 1 : 0, transition: `opacity ${STREAM_FADE_MS}ms ease-out` }}
    />
  )
}

/**
 * First-visit-only boot screen. During loading (0-100%), the canvas stays
 * completely dark -- no rain, no ambient motion -- showing only a dot-matrix
 * "DSC" mark that fills in dot-by-dot, left to right, in exact lockstep
 * with a single `loadingProgress` value (0-100) driven by
 * requestAnimationFrame over ~1.8s, plus a flat, solid-cream hairline
 * progress bar reading off that same value. No drop-shadows, glows, or
 * blur filters anywhere -- every pixel and the bar are 100% sharp cream
 * against matte black.
 *
 * Once loadingProgress reaches 100%, a deliberately paced, cinematic exit
 * plays out rather than an instant cut:
 *   1. Hold (250ms) -- the completed mark and full bar sit static, letting
 *      the eye register that loading finished.
 *   2. Plunge (450ms) -- the bar fades out over BAR_FADE_MS as the DSC mark
 *      begins scaling `1 -> 15` through its own center
 *      (`cubic-bezier(0.5, 0, 0.2, 1)`: smooth start, hard acceleration).
 *   3. Data stream -- STREAM_DELAY_MS into the plunge (not at its start),
 *      a partial-density (~STREAM_DENSITY) matrix stream fades in over the
 *      still-zooming mark and runs for STREAM_MS.
 *   4. Hard cut -- the instant the stream's run finishes, the whole overlay
 *      unmounts with no fade, straight into the live Hero underneath.
 * Skips the whole plunge/stream for prefers-reduced-motion and cuts
 * straight from 100% to unmounted instead.
 *
 * Gated on sessionStorage so it fires exactly once per browser session --
 * never on client-side route navigation (App itself only mounts once per
 * page load anyway) and never again on a reload within the same session.
 */
export function BootLoader() {
  const [shouldRender] = useState(() => {
    if (typeof window === 'undefined') return false
    if (sessionStorage.getItem(BOOT_SEEN_KEY)) return false
    sessionStorage.setItem(BOOT_SEEN_KEY, '1')
    return true
  })
  const [phase, setPhase] = useState<'loading' | 'holding' | 'plunging' | 'streaming' | 'done'>('loading')
  const [loadingProgress, setLoadingProgress] = useState(0)

  useEffect(() => {
    if (!shouldRender) return
    let raf: number
    let holdTimer: ReturnType<typeof setTimeout> | undefined
    let streamDelayTimer: ReturnType<typeof setTimeout> | undefined
    let doneTimer: ReturnType<typeof setTimeout> | undefined
    const start = performance.now()

    const tick = (now: number) => {
      const t = Math.min((now - start) / BAR_DURATION_MS, 1)
      setLoadingProgress(Math.round(ease(t) * 100))
      if (t < 1) {
        raf = requestAnimationFrame(tick)
      } else if (prefersReducedMotion()) {
        setPhase('done')
      } else {
        setPhase('holding')
        holdTimer = setTimeout(() => {
          setPhase('plunging')
          streamDelayTimer = setTimeout(() => {
            setPhase('streaming')
            doneTimer = setTimeout(() => setPhase('done'), STREAM_MS)
          }, STREAM_DELAY_MS)
        }, HOLD_MS)
      }
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(holdTimer)
      clearTimeout(streamDelayTimer)
      clearTimeout(doneTimer)
    }
  }, [shouldRender])

  if (!shouldRender || phase === 'done') return null

  const revealCount = Math.floor((loadingProgress / 100) * TOTAL_DOTS)
  // The mark starts (and keeps) scaling from 'plunging' onward -- 'streaming'
  // doesn't reset or reapply the transition, so the CSS transition already
  // in flight just keeps running underneath the stream.
  const isPlunging = phase === 'plunging' || phase === 'streaming'

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: MATTE_BLACK, transition: 'none' }}
    >
      {phase === 'streaming' && <MatrixStream />}

      <div className="relative z-10 flex flex-col items-center">
        <div
          style={{
            transform: isPlunging ? `scale(${PLUNGE_SCALE})` : 'scale(1)',
            transformOrigin: 'center',
            transition: phase === 'plunging' ? `transform ${PLUNGE_MS}ms ${PLUNGE_EASE}` : 'none',
          }}
        >
          <DotMatrixMark revealCount={revealCount} />
        </div>

        {phase !== 'streaming' && (
          <div className="relative mt-10 h-[2px] w-40 overflow-hidden rounded-full bg-cream/10">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-cream"
              style={{
                width: `${loadingProgress}%`,
                opacity: phase === 'plunging' ? 0 : 1,
                transition: phase === 'plunging' ? `opacity ${BAR_FADE_MS}ms ease-out` : 'none',
                willChange: 'width',
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
