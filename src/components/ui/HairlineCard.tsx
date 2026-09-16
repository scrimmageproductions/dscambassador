import type { ReactNode } from 'react'
import { Reveal } from '../motion/Reveal'
import { TiltCard } from '../motion/TiltCard'

export function HairlineCard({
  children,
  className = '',
  as: Tag = 'div',
  delay = 0,
}: {
  children: ReactNode
  className?: string
  as?: 'div' | 'article' | 'li'
  delay?: number
}) {
  return (
    <Reveal as={Tag} delay={delay} amount={0.15}>
      <TiltCard maxTilt={6} className={`hairline bg-surface/60 p-6 ${className}`}>
        {children}
      </TiltCard>
    </Reveal>
  )
}
