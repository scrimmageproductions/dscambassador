import { Children, type ElementType, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { REVEAL_TRANSITION, REVEAL_VIEWPORT, revealContainer, revealItem } from '../../lib/motion'

const tags = {
  div: motion.div,
  section: motion.section,
  header: motion.header,
  article: motion.article,
  li: motion.li,
  span: motion.span,
} as const

type Tag = keyof typeof tags

/**
 * Scroll-triggered fade-up reveal. With `stagger`, each direct child is
 * animated in sequence (0.15s apart) instead of the block animating as one
 * unit. Use it around a header + paragraph + CTA group. Animates once, and
 * is skipped entirely under prefers-reduced-motion.
 */
export function Reveal({
  children,
  className = '',
  as = 'div',
  stagger = false,
  delay = 0,
  amount,
}: {
  children: ReactNode
  className?: string
  as?: Tag
  stagger?: boolean
  delay?: number
  amount?: number
}) {
  const reduceMotion = useReducedMotion()
  const Tag = tags[as] as ElementType
  const viewport = amount === undefined ? REVEAL_VIEWPORT : { ...REVEAL_VIEWPORT, amount }

  if (reduceMotion) {
    const Static = as
    return <Static className={className}>{children}</Static>
  }

  if (stagger) {
    return (
      <Tag
        className={className}
        variants={revealContainer}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        transition={{ delayChildren: delay }}
      >
        {Children.toArray(children)
          .filter(Boolean)
          .map((child, i) => (
            <motion.div key={i} variants={revealItem}>
              {child}
            </motion.div>
          ))}
      </Tag>
    )
  }

  return (
    <Tag
      className={className}
      variants={revealItem}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      transition={{ ...REVEAL_TRANSITION, delay }}
    >
      {children}
    </Tag>
  )
}
