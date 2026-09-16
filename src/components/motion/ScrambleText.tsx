import { useEffect, useRef, useState, type ElementType, type HTMLAttributes } from 'react'
import { useReducedMotion } from 'framer-motion'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'

function randomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)]
}

/**
 * Hover scramble/decode effect for short monospace labels: cycles every
 * character through random glyphs for ~150ms, then settles on the real
 * text. Meant for small interactive tags (nav links, captions, badges),
 * not body copy. No-ops under prefers-reduced-motion.
 */
export function ScrambleText({
  children,
  as = 'span',
  className = '',
  duration = 150,
  frameMs = 35,
  ...rest
}: {
  children: string
  as?: ElementType
  className?: string
  duration?: number
  frameMs?: number
} & HTMLAttributes<HTMLElement>) {
  const [display, setDisplay] = useState(children)
  const [prevChildren, setPrevChildren] = useState(children)
  const reduceMotion = useReducedMotion()
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  if (children !== prevChildren) {
    setPrevChildren(children)
    setDisplay(children)
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  function start() {
    if (reduceMotion) return
    if (intervalRef.current) clearInterval(intervalRef.current)
    const startedAt = performance.now()
    intervalRef.current = setInterval(() => {
      if (performance.now() - startedAt >= duration) {
        if (intervalRef.current) clearInterval(intervalRef.current)
        setDisplay(children)
        return
      }
      setDisplay(children.replace(/\S/g, () => randomChar()))
    }, frameMs)
  }

  function stop() {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setDisplay(children)
  }

  const Tag = as
  return (
    <Tag className={className} onMouseEnter={start} onMouseLeave={stop} {...rest}>
      {display}
    </Tag>
  )
}
