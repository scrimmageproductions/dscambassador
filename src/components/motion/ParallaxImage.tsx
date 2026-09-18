import { useEffect, useRef, useState, type ImgHTMLAttributes, type RefObject } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { EASE_CINEMATIC } from '../../lib/motion'

type SafeImgAttrs = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'
>

/** Monochrome by default, full color on hover. Tailwind's `hover:` variant is
 * itself gated to `@media (hover: hover)`, so this never sticks on touch. */
const MONOCHROME_HOVER =
  'grayscale contrast-[1.1] transition-[filter] duration-500 [transition-timing-function:ease] hover:grayscale-0'
/** Static grayscale for the touch dual-layer base -- color there comes from
 * the scroll-revealed layer on top, not a hover state touch can't fire. */
const MONOCHROME_STATIC = 'grayscale contrast-[1.1]'

/**
 * Drop-in replacement for `<img>`: scales down from 1.12 to 1.0 as it enters
 * the viewport (parent must keep `overflow-hidden`, as with the existing
 * media containers) and drifts a few px on scroll for a subtle parallax feel.
 *
 * Desktop/hover-capable: renders monochrome by default, transitioning to
 * full color on `:hover` -- unchanged from before.
 *
 * Touch/no-hover (`@media (hover: none)`, where a hover state can never
 * fire): renders a static grayscale base with a full-color copy layered
 * directly on top, clipped via `clip-path: inset(0 0 X% 0)`. As the image
 * scrolls through the middle half of the viewport, X sweeps from 100 to 0,
 * so the color layer wipes in from the top down -- the image visibly fills
 * with color as it crosses the middle of the screen.
 *
 * Falls back to a plain, unanimated, full-color image under
 * prefers-reduced-motion (on any viewport type) rather than leaving touch
 * users with no way to ever see color.
 */
export function ParallaxImage({ className = '', style, ...rest }: SafeImgAttrs) {
  const ref = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const [isTouch, setIsTouch] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches,
  )

  useEffect(() => {
    const mql = window.matchMedia('(hover: none)')
    const update = () => setIsTouch(mql.matches)
    update()
    mql.addEventListener('change', update)
    return () => mql.removeEventListener('change', update)
  }, [])

  const { scrollYProgress: driftProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(driftProgress, [0, 1], [-24, 24])

  // Color reveal progresses specifically as the element crosses the middle
  // half of the viewport (25%-75% down the screen), not the full traversal.
  const { scrollYProgress: revealProgress } = useScroll({ target: ref, offset: ['start 0.75', 'start 0.25'] })
  const clipPath = useTransform(revealProgress, (v) => `inset(0 0 ${100 - v * 100}% 0)`)

  if (reduceMotion) {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img ref={ref as RefObject<HTMLImageElement>} className={className} style={style} {...rest} />
  }

  if (isTouch) {
    return (
      <motion.div
        ref={ref as RefObject<HTMLDivElement>}
        className={`relative overflow-hidden ${className}`}
        initial={{ scale: 1.12, opacity: 0.75 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.1, ease: EASE_CINEMATIC }}
        style={{ ...style, y, willChange: 'transform' }}
      >
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img {...rest} className={`absolute inset-0 h-full w-full ${MONOCHROME_STATIC} ${className}`} />
        {/* Decorative duplicate: the base layer above already carries the real
            alt text. Must be a motion.img -- clipPath is a live MotionValue,
            which only a motion component subscribes to via `style`. */}
        <motion.img
          {...rest}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full grayscale-0 ${className}`}
          style={{ clipPath, willChange: 'clip-path, opacity' }}
        />
      </motion.div>
    )
  }

  return (
    <motion.img
      ref={ref as RefObject<HTMLImageElement>}
      className={`${MONOCHROME_HOVER} ${className}`}
      initial={{ scale: 1.12, opacity: 0.75 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.1, ease: EASE_CINEMATIC }}
      style={{ ...style, y, willChange: 'transform' }}
      {...rest}
    />
  )
}
