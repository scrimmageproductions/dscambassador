import { ScrambleText } from '../motion/ScrambleText'

export function SectionLabel({
  children,
  className = '',
}: {
  children: string
  className?: string
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="h-px w-8 bg-cream/30" aria-hidden="true" />
      <ScrambleText className="label-mono text-cream-wash text-[0.72rem]">{children}</ScrambleText>
    </div>
  )
}
