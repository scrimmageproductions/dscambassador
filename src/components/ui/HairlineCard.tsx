import type { ReactNode } from 'react'

export function HairlineCard({
  children,
  className = '',
  as: Tag = 'div',
}: {
  children: ReactNode
  className?: string
  as?: 'div' | 'article' | 'li'
}) {
  return (
    <Tag
      className={`hairline bg-surface/60 p-6 transition-transform duration-200 hover:-translate-y-1 ${className}`}
    >
      {children}
    </Tag>
  )
}
