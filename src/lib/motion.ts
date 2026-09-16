import type { Transition, Variants } from 'framer-motion'

/** Cinematic, non-bouncy easing used across every scroll reveal and transition. */
export const EASE_CINEMATIC = [0.16, 1, 0.3, 1] as const

export const REVEAL_TRANSITION: Transition = {
  type: 'tween',
  duration: 0.8,
  ease: EASE_CINEMATIC,
}

export const revealItem: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: REVEAL_TRANSITION },
}

export const revealContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15 },
  },
}

/** Shared viewport config: animate once, slightly before the element is fully on screen. */
export const REVEAL_VIEWPORT = { once: true, amount: 0.25, margin: '0px 0px -80px 0px' } as const
