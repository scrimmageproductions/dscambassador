import type {
  ButtonHTMLAttributes,
  AnchorHTMLAttributes,
  ReactNode,
  MouseEvent as ReactMouseEvent,
} from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'

type Variant = 'solid' | 'ghost' | 'text'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 label-mono text-[0.72rem] transition-colors duration-300 ease-out disabled:opacity-40 disabled:cursor-not-allowed'

const variants: Record<Variant, string> = {
  solid: 'bg-cream text-ink hover:bg-cream-2 shadow-[0_0_0_0_rgba(243,237,227,0)] hover:shadow-[0_0_28px_-6px_rgba(243,237,227,0.4)]',
  ghost: 'btn-metallic text-cream hover:bg-cream/[0.05]',
  text: 'rounded-none text-cream underline underline-offset-4 decoration-cream/40 hover:decoration-cream px-0 py-0',
}

const MAGNETIC_STRENGTH = 0.35
const MAGNETIC_MAX = 10
const MAGNETIC_SPRING = { stiffness: 200, damping: 18, mass: 0.4 }

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

/** Magnetic pull + spring-back: the element nudges toward the cursor on hover, within a small radius. */
function useMagnetic(disabled: boolean) {
  const reduceMotion = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, MAGNETIC_SPRING)
  const springY = useSpring(y, MAGNETIC_SPRING)
  const active = !disabled && !reduceMotion

  function handleMouseMove(e: ReactMouseEvent<HTMLElement>) {
    if (!active) return
    const rect = e.currentTarget.getBoundingClientRect()
    x.set(clamp((e.clientX - (rect.left + rect.width / 2)) * MAGNETIC_STRENGTH, -MAGNETIC_MAX, MAGNETIC_MAX))
    y.set(clamp((e.clientY - (rect.top + rect.height / 2)) * MAGNETIC_STRENGTH, -MAGNETIC_MAX, MAGNETIC_MAX))
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return {
    style: active ? { x: springX, y: springY } : undefined,
    whileHover: active ? { scale: 1.02 } : undefined,
    whileTap: active ? { scale: 0.97 } : undefined,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
  }
}

type CommonProps = { variant?: Variant; children: ReactNode; className?: string }
type SafeButtonAttrs = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'
>
type SafeAnchorAttrs = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'
>

const MotionLink = motion.create(Link)

export function Button({
  variant = 'solid',
  children,
  className = '',
  disabled,
  ...rest
}: CommonProps & SafeButtonAttrs) {
  const magnetic = useMagnetic(variant === 'text' || !!disabled)
  return (
    <motion.button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled}
      {...magnetic}
      {...rest}
    >
      {children}
    </motion.button>
  )
}

export function LinkButton({
  variant = 'solid',
  children,
  className = '',
  to,
  ...rest
}: CommonProps & SafeAnchorAttrs & { to: string }) {
  const magnetic = useMagnetic(variant === 'text')
  const isExternal = /^https?:\/\//.test(to)

  if (isExternal) {
    return (
      <motion.a
        href={to}
        className={`${base} ${variants[variant]} ${className}`}
        target="_blank"
        rel="noreferrer"
        {...magnetic}
        {...rest}
      >
        {children}
      </motion.a>
    )
  }

  return (
    <MotionLink to={to} className={`${base} ${variants[variant]} ${className}`} {...magnetic}>
      {children}
    </MotionLink>
  )
}
