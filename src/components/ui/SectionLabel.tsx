import type { ReactNode } from 'react'

export function SectionLabel({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="h-px w-8 bg-cream/30" aria-hidden="true" />
      <span className="label-mono text-cream-wash text-[0.72rem]">{children}</span>
    </div>
  )
}
