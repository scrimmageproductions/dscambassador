import { useState } from 'react'
import { ParallaxImage } from '../motion/ParallaxImage'

export function ExternalImage({
  src,
  alt,
  className = '',
  fallbackLabel,
}: {
  src: string
  alt: string
  className?: string
  fallbackLabel?: string
}) {
  const [broken, setBroken] = useState(false)

  if (broken) {
    return (
      <div className={`hairline flex items-center justify-center bg-surface/60 text-center ${className}`}>
        <span className="label-mono px-4 text-[0.65rem] text-cream-wash">
          {fallbackLabel ?? alt}
        </span>
      </div>
    )
  }

  return (
    <ParallaxImage
      src={src}
      alt={alt}
      loading="lazy"
      className={className}
      onError={() => setBroken(true)}
    />
  )
}
