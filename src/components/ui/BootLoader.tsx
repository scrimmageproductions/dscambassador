import { useEffect, useState } from 'react'

const BAR_DURATION_MS = 1800
// "Architectural Vault Split" exit choreography once loadingProgress hits
// 100%: a lock hold, then two solid panels split apart top/bottom like a
// museum vault shutter, revealing the live Hero underneath through the
// widening seam, then a hard cut. Clean and mechanical -- no zoom, no
// plunge, no rain of its own.
const HOLD_MS = 200 // Phase 1: hold the completed mark + bar, static.
const SPLIT_MS = 400 // Phase 2: full duration of the panel split.
// Sharp, editorial curve: fast open, settling at the very end.
const SPLIT_EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'
// The mark + bar fade out over only the first slice of the split, so they
// never stretch or distort as the panels start moving.
const CONTENT_FADE_MS = 100
const SEAM_COLOR = 'rgba(232, 228, 217, 0.2)'
// Matches --color-bg exactly, so the panels are indistinguishable from the
// page's own background right up until they slide away.
const PANEL_BG = '#0A0A0A'

const BOOT_SEEN_KEY = 'dsc-boot-seen'

const CREAM = '#E8DFD0'
const CREAM_FAINT = 'rgba(232, 223, 208, 0.1)'

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
 * First-visit-only boot screen. During loading (0-100%), the two vault
 * panels sit together covering the full viewport, showing only a
 * dot-matrix "DSC" mark that fills in dot-by-dot, left to right, in exact
 * lockstep with a single `loadingProgress` value (0-100) driven by
 * requestAnimationFrame over ~1.8s, plus a flat, solid-cream hairline
 * progress bar reading off that same value. No drop-shadows, glows, or
 * blur filters anywhere -- every pixel and the bar are 100% sharp cream.
 *
 * Once loadingProgress reaches 100%, a clean, mechanical "Architectural
 * Vault Split" plays out:
 *   1. Lock hold (200ms) -- the completed mark and full bar sit static, so
 *      the 100% state registers cleanly.
 *   2. Hairline seam & panel split (400ms) -- a 1px hairline appears along
 *      the exact vertical center, the mark and bar fade out over the first
 *      CONTENT_FADE_MS of this phase (so they never stretch or distort),
 *      and the two panels slide apart -- the top one translateY(-100%),
 *      the bottom one translateY(100%) -- on a sharp, editorial curve
 *      (`cubic-bezier(0.16, 1, 0.3, 1)`), revealing the live Hero
 *      underneath (whose own ambient rain has been running the entire
 *      time behind this overlay) through the widening seam.
 *   3. Hard cut -- the instant the panels clear the viewport bounds at the
 *      400ms mark, the whole overlay unmounts with no fade.
 * Skips the whole split for prefers-reduced-motion and cuts straight from
 * 100% to unmounted instead.
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
  const [phase, setPhase] = useState<'loading' | 'holding' | 'splitting' | 'done'>('loading')
  const [loadingProgress, setLoadingProgress] = useState(0)

  useEffect(() => {
    if (!shouldRender) return
    let raf: number
    let holdTimer: ReturnType<typeof setTimeout> | undefined
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
          setPhase('splitting')
          doneTimer = setTimeout(() => setPhase('done'), SPLIT_MS)
        }, HOLD_MS)
      }
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(holdTimer)
      clearTimeout(doneTimer)
    }
  }, [shouldRender])

  if (!shouldRender || phase === 'done') return null

  const revealCount = Math.floor((loadingProgress / 100) * TOTAL_DOTS)
  const isSplitting = phase === 'splitting'

  return (
    <div className="fixed inset-0 z-[200] overflow-hidden" style={{ transition: 'none' }}>
      <div
        className="absolute inset-x-0 top-0 z-10 flex items-end justify-center"
        style={{
          height: '50%',
          backgroundColor: PANEL_BG,
          borderBottom: isSplitting ? `1px solid ${SEAM_COLOR}` : 'none',
          transform: isSplitting ? 'translateY(-100%)' : 'translateY(0)',
          transition: isSplitting ? `transform ${SPLIT_MS}ms ${SPLIT_EASE}` : 'none',
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 z-10"
        style={{
          height: '50%',
          backgroundColor: PANEL_BG,
          transform: isSplitting ? 'translateY(100%)' : 'translateY(0)',
          transition: isSplitting ? `transform ${SPLIT_MS}ms ${SPLIT_EASE}` : 'none',
        }}
      />

      <div
        className="absolute inset-0 z-20 flex flex-col items-center justify-center"
        style={{
          opacity: isSplitting ? 0 : 1,
          transition: isSplitting ? `opacity ${CONTENT_FADE_MS}ms ease-out` : 'none',
        }}
      >
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
