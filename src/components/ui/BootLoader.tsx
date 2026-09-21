import { useEffect, useRef, useState } from 'react'
import { CREAM_RGB, FONT_SIZE, HEAD_ALPHA_MAX, HEAD_ALPHA_MIN, randomChar } from './matrixRain'

const BAR_DURATION_MS = 1800
// "Terminal Decryption Scramble & Matrix Rain Cascade" exit choreography,
// fired the instant loadingProgress hits 100%. Every duration below is
// deliberate -- the whole sequence stays under 600ms total so it reads as
// fast and sharp, never a stall or a glitch.
const PAUSE_MS = 100 // Phase 1a: static pause right at 100%, before scrambling.
// Phase 1b splits into an active scramble, then a brief frozen "lock" just
// before release -- 100 + 120 + 30 = 250ms, exactly the "~220ms-250ms"
// window the lock-snap flash occupies.
const SCRAMBLE_MS = 120 // Rapid character-cycle + bar collapse.
const LOCK_MS = 30 // Frozen "[DSC]" in pure white right before release.
const SCRAMBLE_TICK_MS = 40 // How often the scrambled characters re-randomize.
// Monospace size shared by the scramble text and the bar's `ch`-based
// collapse width below, so the bar always ends up matching the text's
// actual rendered width regardless of font metrics.
const SCRAMBLE_FONT_SIZE = '44px'
const SCRAMBLE_BAR_WIDTH = '4ch'
const LOCK_COLOR = '#FFFFFF'
const CASCADE_MS = 300 // Phase 2: full-viewport matrix cascade before the cut.
// Both the "released" DSC columns and the ambient fill-in columns share
// this velocity, so by hard-cut time the whole screen already matches the
// Hero's own ambient rain speed with no visible seam.
const CASCADE_VY = 18
// Outward wave ignition: each ambient column's ignite delay grows with its
// distance from center, capped low so the whole wave still reads as one
// fast beat rather than a visible build-up.
const RADIAL_DELAY_PER_COL_MS = 15
const RADIAL_DELAY_MAX_MS = 60

const BOOT_SEEN_KEY = 'dsc-boot-seen'

const CREAM = '#E8DFD0'
const CREAM_FAINT = 'rgba(232, 223, 208, 0.1)'
const PANEL_BG = '#0A0A0A' // matches --color-bg exactly

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
 * 100% sharp against the panel background. Unrevealed letter-pixels sit at
 * low, flat opacity until their turn comes up in the sweep. */
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
        <rect key={`o-${x}-${y}`} x={x * BLOCK} y={y * BLOCK} width={BLOCK} height={BLOCK} fill={PANEL_BG} />
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
 * Phase 1b of the exit sequence: swaps the pixel-grid mark for three real
 * monospace glyphs at the same position, each re-randomizing from the
 * `$0123456789` pool (same `randomChar` pool the site's own matrix rain
 * uses) every SCRAMBLE_TICK_MS -- a cryptographic-decryption cycle rather
 * than the dot-matrix reveal. Flat solid cream, no glow, same shade the
 * cascade rain draws in, so there's no color shift into Phase 2 once it
 * unlocks.
 *
 * When `locked`, the cycling stops dead and the mark instead reads the
 * literal decrypted string "[DSC]" in pure white -- the "lock snap" beat
 * right before Phase 2 releases it into the rain.
 */
function ScrambleText({ locked }: { locked: boolean }) {
  const [chars, setChars] = useState(() => [randomChar(), randomChar(), randomChar()])

  useEffect(() => {
    if (locked) return
    const interval = setInterval(() => {
      setChars([randomChar(), randomChar(), randomChar()])
    }, SCRAMBLE_TICK_MS)
    return () => clearInterval(interval)
  }, [locked])

  if (locked) {
    return (
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: SCRAMBLE_FONT_SIZE, lineHeight: 1, color: LOCK_COLOR }}>
        [DSC]
      </div>
    )
  }

  return (
    <div
      className="flex gap-2"
      style={{ fontFamily: 'var(--font-mono)', fontSize: SCRAMBLE_FONT_SIZE, lineHeight: 1, color: `rgb(${CREAM_RGB})` }}
    >
      {chars.map((c, i) => (
        <span key={i}>{c}</span>
      ))}
    </div>
  )
}

type CascadeEntry = { char: string; alpha: number; row: number }
type CascadeColumn = {
  col: number
  headRow: number
  trail: CascadeEntry[]
  released: boolean
  delayMs: number
  ignited: boolean
}

/**
 * Phase 2 -- "Matrix Cascade Ignition": mounted only for the CASCADE_MS
 * window. The three columns under where the scrambled DSC text just sat
 * are "released" -- their head starts at that same mid-screen row and
 * grows a falling trail downward from there, exactly like the scrambled
 * characters dropping into rain. Every other column is "ambient": each one
 * ignites (pre-fills top-to-bottom in a single frame, then keeps flowing)
 * only once its own `delayMs` has elapsed, which grows with distance from
 * center (`RADIAL_DELAY_PER_COL_MS` per column, capped at
 * `RADIAL_DELAY_MAX_MS`) -- an outward wave rippling from the released
 * center columns to the edges, rather than every column popping in at
 * once. Both kinds share CASCADE_VY, so the whole screen is already
 * moving at the Hero's own ambient-rain speed by the time this unmounts.
 *
 * Column x-positions (`col * FONT_SIZE`, no left/right padding, columns
 * numbered from the same `Math.floor(width / FONT_SIZE)` count) are
 * identical to MatrixTransition's own grid math -- same shared FONT_SIZE,
 * same origin, so a column index here lands on the exact same pixel as
 * that same index in the Hero's canvas, guaranteeing zero horizontal jump
 * at the handoff.
 *
 * The container behind this canvas goes transparent the instant this
 * mounts, so the live Hero bleeds through the gaps between characters
 * immediately -- the "seamless handoff" the hard cut needs.
 */
function MatrixCascade() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

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

    // Matches MatrixTransition's own `Math.floor(width / FONT_SIZE)` column
    // count exactly, so this canvas's grid and the Hero's are identical.
    const totalColumns = Math.max(1, Math.floor(width / FONT_SIZE))
    const totalRows = Math.ceil(height / FONT_SIZE) + 2
    const centerCol = Math.round(width / 2 / FONT_SIZE)
    const centerRow = height / 2 / FONT_SIZE
    // The three columns the scrambled "DSC" text just occupied -- the wave's
    // epicenter.
    const releasedCols = new Set([centerCol - 1, centerCol, centerCol + 1])

    const columns: CascadeColumn[] = Array.from({ length: totalColumns }, (_, col) => {
      const released = releasedCols.has(col)
      return {
        col,
        headRow: released ? centerRow : totalRows,
        trail: [],
        released,
        delayMs: released ? 0 : Math.min(Math.abs(col - centerCol) * RADIAL_DELAY_PER_COL_MS, RADIAL_DELAY_MAX_MS),
        ignited: released,
      }
    })

    const rowsPerFrame = CASCADE_VY / FONT_SIZE
    const mountedAt = performance.now()
    let raf = 0

    function draw(now: number) {
      raf = requestAnimationFrame(draw)
      const elapsed = now - mountedAt
      ctx.clearRect(0, 0, width, height)
      for (const column of columns) {
        if (column.released) {
          for (const entry of column.trail) entry.alpha *= 0.9
          column.trail = column.trail.filter((entry) => entry.alpha >= 0.02)
          column.trail.push({ char: randomChar(), alpha: 1, row: column.headRow })
          column.headRow += rowsPerFrame
        } else {
          if (!column.ignited) {
            if (elapsed < column.delayMs) continue
            // Ignite now: pre-fill top-to-bottom in this single frame, same
            // as the old simultaneous flood, just staggered by delayMs.
            for (let row = 0; row <= totalRows; row++) {
              column.trail.push({
                char: randomChar(),
                alpha: HEAD_ALPHA_MIN + Math.random() * (HEAD_ALPHA_MAX - HEAD_ALPHA_MIN),
                row,
              })
            }
            column.ignited = true
          }
          // Keep every ambient row flowing downward, wrapping back above
          // the top the instant it exits the bottom -- the column stays
          // continuously full without ever needing to rebuild its trail.
          for (const entry of column.trail) {
            entry.row += rowsPerFrame
            if (entry.row * FONT_SIZE > height) {
              entry.row -= totalRows + 1
              entry.char = randomChar()
            }
          }
        }

        const x = column.col * FONT_SIZE
        for (const entry of column.trail) {
          const y = entry.row * FONT_SIZE
          if (y < -FONT_SIZE || y > height) continue
          ctx.fillStyle = `rgba(${CREAM_RGB}, ${entry.alpha})`
          ctx.fillText(entry.char, x, y)
        }
      }
    }
    raf = requestAnimationFrame(draw)

    return () => cancelAnimationFrame(raf)
  }, [])

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 block" />
}

/**
 * First-visit-only boot screen. During loading (0-100%), a dot-matrix
 * "DSC" mark fills in dot-by-dot, left to right, in exact lockstep with a
 * single `loadingProgress` value (0-100) driven by requestAnimationFrame
 * over ~1.8s, plus a flat, solid-cream hairline progress bar reading off
 * that same value. No drop-shadows, glows, or blur filters anywhere.
 *
 * Once loadingProgress reaches 100%, a "Terminal Decryption Scramble &
 * Matrix Rain Cascade" exit plays out, under 600ms total:
 *   1a. Pause (100ms) -- the completed mark and full bar sit static.
 *   1b. Scramble (120ms) -- the pixel mark swaps for three real glyphs
 *       cycling through the `$0123456789` pool every SCRAMBLE_TICK_MS,
 *       while the bar collapses inward from its full width to
 *       SCRAMBLE_BAR_WIDTH (sized in `ch` units off the same monospace
 *       font as the scramble text, so it always matches).
 *   1c. Lock (30ms, ~220-250ms) -- the cycling freezes on the literal
 *       string "[DSC]" in pure white, held static right up to the release.
 *   2.  Cascade (300ms) -- the instant the lock ends, those same three
 *       columns "release" into falling rain (in standard cream again) from
 *       their own mid-screen position, while every other column ignites in
 *       an outward wave from center (each column's ignite delay grows with
 *       its distance from center, capped low) rather than all at once, all
 *       at the same CASCADE_VY as the Hero's own ambient rain running
 *       underneath (Home mounts immediately; this is just an overlay on
 *       top of it) and on the identical column grid, so there's no
 *       horizontal jump at the handoff.
 *   3.  Hard cut -- the instant the cascade's 300ms is up, the whole
 *       overlay unmounts with no fade.
 * Skips straight from 100% to unmounted for prefers-reduced-motion.
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
  const [phase, setPhase] = useState<'loading' | 'paused' | 'scrambling' | 'locked' | 'cascading' | 'done'>('loading')
  const [loadingProgress, setLoadingProgress] = useState(0)

  useEffect(() => {
    if (!shouldRender) return
    let raf: number
    let pauseTimer: ReturnType<typeof setTimeout> | undefined
    let scrambleTimer: ReturnType<typeof setTimeout> | undefined
    let lockTimer: ReturnType<typeof setTimeout> | undefined
    let cascadeTimer: ReturnType<typeof setTimeout> | undefined
    const start = performance.now()

    const tick = (now: number) => {
      const t = Math.min((now - start) / BAR_DURATION_MS, 1)
      setLoadingProgress(Math.round(ease(t) * 100))
      if (t < 1) {
        raf = requestAnimationFrame(tick)
      } else if (prefersReducedMotion()) {
        setPhase('done')
      } else {
        setPhase('paused')
        pauseTimer = setTimeout(() => {
          setPhase('scrambling')
          scrambleTimer = setTimeout(() => {
            setPhase('locked')
            lockTimer = setTimeout(() => {
              setPhase('cascading')
              cascadeTimer = setTimeout(() => setPhase('done'), CASCADE_MS)
            }, LOCK_MS)
          }, SCRAMBLE_MS)
        }, PAUSE_MS)
      }
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(pauseTimer)
      clearTimeout(scrambleTimer)
      clearTimeout(lockTimer)
      clearTimeout(cascadeTimer)
    }
  }, [shouldRender])

  if (!shouldRender || phase === 'done') return null

  const revealCount = Math.floor((loadingProgress / 100) * TOTAL_DOTS)
  const isScrambleText = phase === 'scrambling' || phase === 'locked'
  const isCascading = phase === 'cascading'

  return (
    <div
      className="fixed inset-0 z-[200] overflow-hidden"
      style={{ backgroundColor: isCascading ? 'transparent' : PANEL_BG, transition: 'none' }}
    >
      {isCascading && <MatrixCascade />}

      {!isCascading && (
        <div className="relative z-10 flex h-full flex-col items-center justify-center">
          {isScrambleText ? <ScrambleText locked={phase === 'locked'} /> : <DotMatrixMark revealCount={revealCount} />}

          <div
            className="relative mt-10 h-[2px] overflow-hidden rounded-full bg-cream/10"
            style={{
              width: isScrambleText ? SCRAMBLE_BAR_WIDTH : '10rem',
              // `ch` only needs to resolve correctly while it's actually the
              // active unit (during the collapse); harmless to set otherwise.
              fontFamily: isScrambleText ? 'var(--font-mono)' : undefined,
              fontSize: isScrambleText ? SCRAMBLE_FONT_SIZE : undefined,
              transition: phase === 'scrambling' ? `width ${SCRAMBLE_MS}ms ease-in` : 'none',
            }}
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-cream"
              style={{ width: `${loadingProgress}%`, willChange: 'width' }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
