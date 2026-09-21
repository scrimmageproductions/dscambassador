import { useEffect, useRef, useState } from 'react'
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

const BAR_DURATION_MS = 1800
const HOLD_MS = 200
// "Velocity Stretch / Motion Blur Blast": the rapid exit sequence once the
// bar and dot-matrix mark hit 100% -- rain speed and canvas stretch both
// snap instantly, hold for this long, then the whole overlay hard-cuts.
const BLAST_MS = 150
const BLAST_VELOCITY = 4
const BLAST_SCALE_Y = 3

const BOOT_SEEN_KEY = 'dsc-boot-seen'

const CREAM = '#E8DFD0'
const CREAM_FAINT = 'rgba(232, 223, 208, 0.1)'
const MATTE_BLACK = '#0D0D0D'

// Classic 5x7 blocky pixel-font glyphs, laid out with a 1-unit gap between
// letters so each gets its own independent outline once dilated.
const LETTER_D = ['XXXX.', 'X...X', 'X...X', 'X...X', 'X...X', 'X...X', 'XXXX.']
const LETTER_S = ['.XXXX', 'X....', 'X....', '.XXX.', '....X', '....X', 'XXXX.']
const LETTER_C = ['.XXXX', 'X....', 'X....', 'X....', 'X....', 'X....', '.XXXX']
const WORD = [LETTER_D, LETTER_S, LETTER_C]
const LETTER_GAP = 1
const PAD = 1

// Each coarse letter-pixel renders as a BLOCK x BLOCK square of fine units,
// and the dot-matrix pattern tiles every PATTERN_TILE fine units (with a
// DOT_SIZE cream dot inset in each tile) -- BLOCK is a clean multiple of
// PATTERN_TILE so the texture stays aligned across adjacent letter-pixels.
const PATTERN_TILE = 3
const DOT_SIZE = 2
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
 * interior fills in dot-by-dot (in `revealCount` order) with the same
 * cream/black dot-matrix texture as the custom cursor, via a tiled SVG
 * `<pattern>`. Unrevealed letter-pixels sit at low opacity until their turn
 * comes up in the sweep. */
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
      <defs>
        <pattern id="boot-dot-matrix" patternUnits="userSpaceOnUse" width={PATTERN_TILE} height={PATTERN_TILE}>
          <rect width={PATTERN_TILE} height={PATTERN_TILE} fill={MATTE_BLACK} />
          <rect width={DOT_SIZE} height={DOT_SIZE} fill={CREAM} />
        </pattern>
      </defs>
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
            fill={revealed ? 'url(#boot-dot-matrix)' : CREAM_FAINT}
            style={revealed ? { filter: 'drop-shadow(0 0 2.5px rgba(232, 223, 208, 0.55))' } : undefined}
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

type BootTrailEntry = { char: string; alpha: number; row: number }
type BootDrop = { col: number; headRow: number; trail: BootTrailEntry[] }

/**
 * The boot screen's own ambient digit-rain background -- continuous free
 * fall, no scroll-linking, sharing MatrixTransition's exact constants
 * (font, char pool, color, alpha, decay) so the look is identical to the
 * Hero's own rain it hands off into. `blasting` is read through a ref
 * inside the animation loop (never a dependency of the setup effect) so
 * flipping it can't tear down and restart the falling drops: the fall
 * speed jumps to 4x on the very next tick, and the scaleY stretch below is
 * applied straight to the canvas's inline style, both with zero transition
 * so the "instant" snap the velocity-stretch exit calls for is real.
 */
function BootRain({ blasting }: { blasting: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const blastingRef = useRef(blasting)

  useEffect(() => {
    blastingRef.current = blasting
  }, [blasting])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const canvasRefEl = canvasRef.current
    const ctxRef = canvasRefEl?.getContext('2d')
    if (!canvasRefEl || !ctxRef) return

    // Re-bind as explicitly non-nullable: TS's control-flow narrowing from
    // the guard above doesn't extend into the nested resize/draw closures.
    const canvasEl: HTMLCanvasElement = canvasRefEl
    const ctx: CanvasRenderingContext2D = ctxRef

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let width = 0
    let height = 0
    let drops: BootDrop[] = []
    let raf = 0
    let lastStep = 0

    function spawnDrops() {
      const totalColumns = Math.max(1, Math.floor(width / FONT_SIZE))
      const activeCount = Math.min(MAX_COLUMNS, totalColumns)
      const pool = Array.from({ length: totalColumns }, (_, i) => i)
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[pool[i], pool[j]] = [pool[j], pool[i]]
      }
      drops = pool.slice(0, activeCount).map((col) => ({ col, headRow: Math.random() * -30, trail: [] }))
    }

    function resize() {
      width = window.innerWidth
      height = window.innerHeight
      canvasEl.width = Math.floor(width * dpr)
      canvasEl.height = Math.floor(height * dpr)
      canvasEl.style.width = `${width}px`
      canvasEl.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      spawnDrops()
    }

    resize()
    window.addEventListener('resize', resize)

    function draw(time: number) {
      raf = requestAnimationFrame(draw)
      if (time - lastStep < STEP_MS) return
      lastStep = time

      const velocityMultiplier = blastingRef.current ? BLAST_VELOCITY : 1

      ctx.clearRect(0, 0, width, height)
      ctx.font = `${FONT_SIZE}px "JetBrains Mono", ui-monospace, monospace`
      ctx.textBaseline = 'top'

      for (const drop of drops) {
        for (const entry of drop.trail) entry.alpha *= TRAIL_DECAY_BASE
        drop.trail = drop.trail.filter((entry) => entry.alpha >= MIN_ALPHA)

        if (drop.headRow * FONT_SIZE < height) {
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
          ctx.fillStyle = `rgba(${CREAM_RGB}, ${entry.alpha})`
          ctx.fillText(entry.char, x, y)
        }
      }
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 block"
      style={{
        transform: blasting ? `scaleY(${BLAST_SCALE_Y})` : 'scaleY(1)',
        transformOrigin: 'center',
        transition: 'none',
        willChange: 'transform',
      }}
    />
  )
}

/**
 * First-visit-only boot screen: a dot-matrix "DSC" mark that fills in
 * dot-by-dot, left to right, in exact lockstep with a single
 * `loadingProgress` value (0-100) driven by requestAnimationFrame over
 * ~1.8s, over an ambient digit-rain background. The hairline progress bar
 * below reads off that same value, so the two never drift relative to each
 * other.
 *
 * At 100% the mark holds for 200ms, then a "Velocity Stretch / Motion Blur
 * Blast" exit fires: the rain's fall speed instantly jumps 4x and the
 * canvas stretches `scaleY(3)` for 150ms, then the whole overlay hard-cuts
 * (an unmount, no fade or shrink) straight into the live Hero underneath --
 * whose own ambient rain (`MatrixTransition`) has been running the entire
 * time behind this overlay, so the high-speed blast snaps directly into
 * matching ambient rain with no visible seam.
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
  const [phase, setPhase] = useState<'loading' | 'blasting' | 'done'>('loading')
  const [loadingProgress, setLoadingProgress] = useState(0)

  useEffect(() => {
    if (!shouldRender) return
    let raf: number
    let holdTimer: ReturnType<typeof setTimeout> | undefined
    let blastTimer: ReturnType<typeof setTimeout> | undefined
    const start = performance.now()

    const tick = (now: number) => {
      const t = Math.min((now - start) / BAR_DURATION_MS, 1)
      setLoadingProgress(Math.round(ease(t) * 100))
      if (t < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        holdTimer = setTimeout(() => {
          setPhase('blasting')
          // Hard cut: no fade, no shrink -- straight to unmount once the
          // velocity blast has had its 150ms.
          blastTimer = setTimeout(() => setPhase('done'), BLAST_MS)
        }, HOLD_MS)
      }
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(holdTimer)
      clearTimeout(blastTimer)
    }
  }, [shouldRender])

  if (!shouldRender || phase === 'done') return null

  const revealCount = Math.floor((loadingProgress / 100) * TOTAL_DOTS)

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: MATTE_BLACK, transition: 'none' }}
    >
      <BootRain blasting={phase === 'blasting'} />

      <div className="relative z-10 flex flex-col items-center">
        <DotMatrixMark revealCount={revealCount} />

        <div className="relative mt-10 h-[2px] w-40 overflow-hidden rounded-full bg-cream/10">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-cream"
            style={{ width: `${loadingProgress}%`, willChange: 'width' }}
          />
        </div>
      </div>
    </div>
  )
}
