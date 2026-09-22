import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'

// Phase 1: the decode-in, once per fresh entrance into view.
const DECODE_MS = 250
const DECODE_FRAME_MS = 30

// Phase 2: an intermittent, ultra-subtle "live system" tic while the
// heading sits in view -- 1-2 characters flicker for a beat, then settle.
// Deliberately rare and brief so it reads as ambient status, not motion.
const FLICKER_MIN_MS = 15000
const FLICKER_MAX_MS = 20000
const FLICKER_HOLD_MS = 100

function randomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)]
}

/**
 * Lightweight decode/glitch wrapper for headline text. Wrap the text inside
 * an existing heading element (`<h1><TextDecode>{title}</TextDecode></h1>`)
 * rather than using it as the heading itself, so page structure/semantics
 * stay exactly as they were.
 *
 * The instant the heading scrolls into view, every non-space character
 * cycles through random glyphs for `DECODE_MS`, then resolves to the real
 * text -- a brief cryptographic-decode read. From then on, for as long as
 * it stays in view, a single random 1-2 character flicker fires every
 * 15-20s (a fresh random interval picked each time, not a fixed metronome)
 * and holds for only 100ms before reverting -- subtle enough to read as a
 * live system status tic, not a distraction. Both effects stop entirely
 * under prefers-reduced-motion, where the heading just renders its real
 * text.
 */
export function TextDecode({ children, className = '' }: { children: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { amount: 0.6 })
  const reduceMotion = useReducedMotion()
  const [display, setDisplay] = useState(children)
  const [prevChildren, setPrevChildren] = useState(children)

  if (children !== prevChildren) {
    setPrevChildren(children)
    setDisplay(children)
  }

  // Phase 1: decode-in on every fresh entrance into view.
  useEffect(() => {
    if (reduceMotion || !isInView) return
    let cancelled = false
    const startedAt = performance.now()
    const interval = setInterval(() => {
      if (cancelled) return
      if (performance.now() - startedAt >= DECODE_MS) {
        clearInterval(interval)
        setDisplay(children)
        return
      }
      setDisplay(children.replace(/\S/g, () => randomChar()))
    }, DECODE_FRAME_MS)
    return () => {
      cancelled = true
      clearInterval(interval)
      setDisplay(children)
    }
  }, [isInView, children, reduceMotion])

  // Phase 2: sparse ambient flicker while it stays in view.
  useEffect(() => {
    if (reduceMotion || !isInView) return
    let holdTimer: ReturnType<typeof setTimeout> | undefined
    let nextTimer: ReturnType<typeof setTimeout> | undefined

    function scheduleNext() {
      const delay = FLICKER_MIN_MS + Math.random() * (FLICKER_MAX_MS - FLICKER_MIN_MS)
      nextTimer = setTimeout(flicker, delay)
    }

    function flicker() {
      const positions = [...children].flatMap((ch, i) => (/\S/.test(ch) ? [i] : []))
      if (positions.length > 0) {
        const flickerCount = Math.min(positions.length, Math.random() < 0.5 ? 1 : 2)
        const chosen = new Set<number>()
        while (chosen.size < flickerCount) {
          chosen.add(positions[Math.floor(Math.random() * positions.length)])
        }
        setDisplay(
          children
            .split('')
            .map((ch, i) => (chosen.has(i) ? randomChar() : ch))
            .join(''),
        )
        holdTimer = setTimeout(() => setDisplay(children), FLICKER_HOLD_MS)
      }
      scheduleNext()
    }

    scheduleNext()
    return () => {
      clearTimeout(holdTimer)
      clearTimeout(nextTimer)
    }
  }, [isInView, children, reduceMotion])

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  )
}
