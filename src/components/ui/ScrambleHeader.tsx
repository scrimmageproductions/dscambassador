import { forwardRef, useEffect, useImperativeHandle, useRef, useState, type RefObject } from 'react'

const MESSAGE = '[ REAL WORLD PRESENCE ]'
const CHARS = '$0123456789'.split('')
const TRIGGER_THRESHOLD = 0.3
const SCRAMBLE_TICK_MS = 55
const IDLE_FLICKER_MS = 350

function randomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)]
}

function renderAt(lockedCount: number) {
  return MESSAGE.split('')
    .map((ch, i) => (ch === ' ' || i < lockedCount ? ch : randomChar()))
    .join('')
}

/**
 * The real, permanent DOM header for the "Real people" section -- the
 * decrypted-terminal counterpart to MatrixTransition's ambient rain.
 * Idles on a gently flickering scrambled placeholder (reads as "still
 * encrypting") until the scroll gap between `ctaRef` and this element's own
 * position crosses TRIGGER_THRESHOLD, at which point it locks into
 * "[ REAL WORLD PRESENCE ]" left-to-right and stays that way permanently --
 * unlike the canvas rain, this never fades back out.
 *
 * Forwards its own DOM node so a sibling MatrixTransition can read its
 * getBoundingClientRect() and land its feeder streams exactly on its top
 * edge. Skips all animation under prefers-reduced-motion, showing the final
 * text immediately.
 */
export const ScrambleHeader = forwardRef<HTMLHeadingElement, { ctaRef: RefObject<HTMLElement | null> }>(
  function ScrambleHeader({ ctaRef }, forwardedRef) {
    const innerRef = useRef<HTMLHeadingElement>(null)
    useImperativeHandle(forwardedRef, () => innerRef.current as HTMLHeadingElement, [])

    const reduceMotion =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const [display, setDisplay] = useState(() => (reduceMotion ? MESSAGE : renderAt(0)))
    const [locked, setLocked] = useState(reduceMotion)

    useEffect(() => {
      if (reduceMotion) return

      let scrollRaf = 0
      let idleInterval: ReturnType<typeof setInterval> | undefined
      let scrambleInterval: ReturnType<typeof setInterval> | undefined
      let triggered = false

      function computeProgress() {
        const cta = ctaRef.current
        const el = innerRef.current
        if (!cta || !el) return 0
        const ctaRect = cta.getBoundingClientRect()
        const elRect = el.getBoundingClientRect()
        const gapSpan = elRect.top - ctaRect.bottom
        if (gapSpan <= 0) return 1
        const viewportMid = window.innerHeight / 2
        return Math.min(1, Math.max(0, (viewportMid - ctaRect.bottom) / gapSpan))
      }

      function startScramble() {
        if (triggered) return
        triggered = true
        if (idleInterval) clearInterval(idleInterval)
        let count = 0
        scrambleInterval = setInterval(() => {
          count += 1
          if (count >= MESSAGE.length) {
            if (scrambleInterval) clearInterval(scrambleInterval)
            setDisplay(MESSAGE)
            setLocked(true)
            return
          }
          setDisplay(renderAt(count))
        }, SCRAMBLE_TICK_MS)
      }

      function handleScroll() {
        if (scrollRaf) return
        scrollRaf = requestAnimationFrame(() => {
          scrollRaf = 0
          if (computeProgress() >= TRIGGER_THRESHOLD) startScramble()
        })
      }

      idleInterval = setInterval(() => {
        if (!triggered) setDisplay(renderAt(0))
      }, IDLE_FLICKER_MS)

      window.addEventListener('scroll', handleScroll, { passive: true })
      window.addEventListener('resize', handleScroll)
      handleScroll()

      return () => {
        cancelAnimationFrame(scrollRaf)
        window.removeEventListener('scroll', handleScroll)
        window.removeEventListener('resize', handleScroll)
        if (idleInterval) clearInterval(idleInterval)
        if (scrambleInterval) clearInterval(scrambleInterval)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
      <h2
        ref={innerRef}
        aria-label={MESSAGE}
        className="select-none font-mono text-xl uppercase tracking-[0.18em] text-cream sm:text-2xl md:text-3xl"
      >
        <span aria-hidden="true">{locked ? MESSAGE : display}</span>
      </h2>
    )
  },
)
