import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const BAR_DURATION_MS = 1800
const HOLD_MS = 200
const FADE_MS = 150

export type BootLoaderExitStyle = 'cut' | 'fade'

const BOOT_SEEN_KEY = 'dsc-boot-seen'

const CREAM = '#E8DFD0'
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

/** The dot-matrix "DSC" mark: a matte-black-outlined pixel wordmark whose
 * interior is filled with the same cream/black dot-matrix texture as the
 * custom cursor, via a tiled SVG `<pattern>`. */
function DotMatrixMark() {
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
      {FILLED.map(({ x, y }) => (
        <rect key={`f-${x}-${y}`} x={x * BLOCK} y={y * BLOCK} width={BLOCK} height={BLOCK} fill="url(#boot-dot-matrix)" />
      ))}
    </svg>
  )
}

/**
 * First-visit-only boot screen: a centered dot-matrix "DSC" mark fades in
 * while a hairline cream progress bar fills over ~1.8s. Once it hits 100%
 * and holds briefly, the overlay exits and unmounts -- no slide, sweep, or
 * translation, ever: either an instant hard cut (`exitStyle="cut"`, the
 * default -- zero fade, the frame just cuts straight to the site) or a
 * swift linear opacity fade (`exitStyle="fade"`, 150ms).
 *
 * Gated on sessionStorage so it fires exactly once per browser session --
 * never on client-side route navigation (App itself only mounts once per
 * page load anyway) and never again on a reload within the same session.
 */
export function BootLoader({ exitStyle = 'cut' }: { exitStyle?: BootLoaderExitStyle } = {}) {
  const [shouldRender] = useState(() => {
    if (typeof window === 'undefined') return false
    if (sessionStorage.getItem(BOOT_SEEN_KEY)) return false
    sessionStorage.setItem(BOOT_SEEN_KEY, '1')
    return true
  })
  const [phase, setPhase] = useState<'loading' | 'exiting' | 'done'>('loading')

  useEffect(() => {
    if (!shouldRender) return
    let fadeTimer: ReturnType<typeof setTimeout> | undefined
    const fillTimer = setTimeout(() => {
      if (exitStyle === 'cut') {
        // Zero fade, zero delay: unmount on the very next frame.
        setPhase('done')
      } else {
        setPhase('exiting')
        fadeTimer = setTimeout(() => setPhase('done'), FADE_MS)
      }
    }, BAR_DURATION_MS + HOLD_MS)
    return () => {
      clearTimeout(fillTimer)
      clearTimeout(fadeTimer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!shouldRender || phase === 'done') return null

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
      style={{ backgroundColor: MATTE_BLACK }}
      animate={{ opacity: phase === 'exiting' ? 0 : 1 }}
      transition={{ duration: FADE_MS / 1000, ease: 'linear' }}
    >
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5, ease: 'easeOut' }}>
        <DotMatrixMark />
      </motion.div>

      <div className="relative mt-10 h-[2px] w-40 overflow-hidden rounded-full bg-cream/10">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-cream"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: BAR_DURATION_MS / 1000, ease: 'circOut' }}
          style={{ willChange: 'width' }}
        />
      </div>
    </motion.div>
  )
}
