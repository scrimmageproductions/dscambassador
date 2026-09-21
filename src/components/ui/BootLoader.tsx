import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const BAR_DURATION_MS = 1800
const HOLD_MS = 200
const FADE_MS = 300

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

/**
 * First-visit-only boot screen: a dot-matrix "DSC" mark that fills in
 * dot-by-dot, left to right, in exact lockstep with a single
 * `loadingProgress` value (0-100) driven by requestAnimationFrame over
 * ~1.8s. The hairline progress bar below reads off that same value, so the
 * two never drift relative to each other. At 100% the mark holds for
 * 200ms, then the whole overlay fades and scales out (`opacity 1 -> 0`,
 * `scale 1 -> 1.02`) to reveal the site underneath.
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
  const [phase, setPhase] = useState<'loading' | 'exiting' | 'done'>('loading')
  const [loadingProgress, setLoadingProgress] = useState(0)

  useEffect(() => {
    if (!shouldRender) return
    let raf: number
    let holdTimer: ReturnType<typeof setTimeout> | undefined
    let fadeTimer: ReturnType<typeof setTimeout> | undefined
    const start = performance.now()

    const tick = (now: number) => {
      const t = Math.min((now - start) / BAR_DURATION_MS, 1)
      setLoadingProgress(Math.round(ease(t) * 100))
      if (t < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        holdTimer = setTimeout(() => {
          setPhase('exiting')
          fadeTimer = setTimeout(() => setPhase('done'), FADE_MS)
        }, HOLD_MS)
      }
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(holdTimer)
      clearTimeout(fadeTimer)
    }
  }, [shouldRender])

  if (!shouldRender || phase === 'done') return null

  const revealCount = Math.floor((loadingProgress / 100) * TOTAL_DOTS)

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
      style={{ backgroundColor: MATTE_BLACK }}
      animate={{
        opacity: phase === 'exiting' ? 0 : 1,
        scale: phase === 'exiting' ? 1.02 : 1,
      }}
      transition={{ duration: FADE_MS / 1000, ease: 'easeOut' }}
    >
      <DotMatrixMark revealCount={revealCount} />

      <div className="relative mt-10 h-[2px] w-40 overflow-hidden rounded-full bg-cream/10">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-cream"
          style={{ width: `${loadingProgress}%`, willChange: 'width' }}
        />
      </div>
    </motion.div>
  )
}
