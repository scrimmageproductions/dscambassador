import { ParallaxImage } from '../motion/ParallaxImage'
import { ScrambleText } from '../motion/ScrambleText'

export function CultureMedia({
  className = '',
  src = '/dsc-culture.gif',
  alt = 'Digital Spenders Club members browsing kit at an IRL pop-up',
  aspectClassName = 'aspect-[4/5]',
}: {
  className?: string
  src?: string
  alt?: string
  aspectClassName?: string
}) {
  return (
    <figure className={`hairline group relative overflow-hidden rounded-2xl bg-surface/40 ${className}`}>
      <div className={`relative ${aspectClassName} w-full overflow-hidden`}>
        <ParallaxImage
          src={src}
          alt={alt}
          loading="lazy"
          className="h-full w-full object-cover brightness-90"
        />
        <div className="pointer-events-none absolute inset-0 bg-cream/[0.05] mix-blend-overlay" aria-hidden="true" />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent"
          aria-hidden="true"
        />
      </div>
      <figcaption className="label-mono absolute bottom-5 left-5 text-[0.68rem] text-cream">
        <ScrambleText>Spenders in motion</ScrambleText>
      </figcaption>
    </figure>
  )
}
