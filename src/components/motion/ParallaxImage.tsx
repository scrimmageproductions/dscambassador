import { useRef, type ImgHTMLAttributes } from 'react'
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
 * Falls back to a static `<img>` under prefers-reduced-motion.
 */
export function ParallaxImage({ className = '', style, ...rest }: SafeImgAttrs) {
  const ref = useRef<HTMLImageElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [-24, 24])

  if (reduceMotion) {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img ref={ref} className={className} style={style} {...rest} />
  }

  return (
    <motion.img
      ref={ref}
      className={className}
      initial={{ scale: 1.12, opacity: 0.75 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.1, ease: EASE_CINEMATIC }}
      style={{ ...style, y, willChange: 'transform' }}
      {...rest}
    />
  )
}
