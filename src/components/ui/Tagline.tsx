export function Tagline({ className = '' }: { className?: string }) {
  return (
    <p className={`label-mono text-cream-wash text-[0.72rem] ${className}`}>
      Spenders Move, Follow the Motion <span className="text-gold">©</span>
    </p>
  )
}
