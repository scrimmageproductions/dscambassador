import { useRef, type ImgHTMLAttributes, type RefObject } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { EASE_CINEMATIC } from '../../lib/motion'

type SafeImgAttrs = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'
>

/**
 * Drop-in replacement for `<img>`: scales down from 1.12 to 1.0 as it enters
 * the viewport (parent must keep `overflow-hidden`, as with the existing
 * media containers) and drifts a few px on scroll for a subtle parallax feel.
 *
 * Color reveal is scroll-driven on every viewport, desktop included: a
 * static grayscale base sits under a full-color copy that's clipped via
 * GPU-accelerated `clip-path: inset(0 0 X% 0)`. As the image crosses the
 * middle half of the viewport (25%-75% down the screen), X sweeps from 100
 * to 0, wiping color in top-down. A third, always-transparent color layer
 * sits on top for hover-capable pointers only (Tailwind's `hover:` variant
 * is itself gated to `@media (hover: hover)`, so this never sticks on
 * touch): hovering fades it to full opacity over 0.4s, instantly overriding
 * the scroll state to full color regardless of where the scroll-driven
 * clip-path currently sits.
 *
 * Falls back to a plain, unanimated, full-color image under
 * prefers-reduced-motion rather than leaving anyone no way to see color.
 */
export function ParallaxImage({ className = '', style, ...rest }: SafeImgAttrs) {
  const ref = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()

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

  return (
    <motion.div
      ref={ref as RefObject<HTMLDivElement>}
      className={`group relative overflow-hidden ${className}`}
      initial={{ scale: 1.12, opacity: 0.75 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.1, ease: EASE_CINEMATIC }}
      style={{ ...style, y, willChange: 'transform' }}
    >
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <img {...rest} className={`absolute inset-0 h-full w-full grayscale contrast-[1.1] ${className}`} />
      {/* Decorative duplicate: the base layer above already carries the real
          alt text. Must be a motion.img -- clipPath is a live MotionValue,
          which only a motion component subscribes to via `style`. */}
      <motion.img
        {...rest}
        alt=""
        aria-hidden="true"
        className={`absolute inset-0 h-full w-full grayscale-0 ${className}`}
        style={{ clipPath, willChange: 'clip-path' }}
      />
      {/* Decorative duplicate: hover-only full-color override, inert on touch
          since Tailwind's hover: variant never matches there. */}
      <img
        {...rest}
        alt=""
        aria-hidden="true"
        className={`absolute inset-0 h-full w-full grayscale-0 opacity-0 transition-opacity duration-[400ms] ease-out group-hover:opacity-100 ${className}`}
      />
    </motion.div>
  )
}
