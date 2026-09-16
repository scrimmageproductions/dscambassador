import { ScrambleText } from '../motion/ScrambleText'

export function Tagline({ className = '' }: { className?: string }) {
  return (
    <p className={`label-mono text-cream-wash text-[0.72rem] ${className}`}>
      <ScrambleText>Spenders Move, Follow the Motion</ScrambleText> <span className="text-gold">©</span>
    </p>
  )
}
