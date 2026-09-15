import { useState } from 'react'

const LOGO_URL = 'https://www.spenders.club/cdn/shop/t/16/assets/favicon-dark.svg'

export function BrandLogo({ className = '' }: { className?: string }) {
  const [broken, setBroken] = useState(false)

  if (broken) return null

  return (
    <img
      src={LOGO_URL}
      alt=""
      aria-hidden="true"
      loading="lazy"
      className={className}
      onError={() => setBroken(true)}
    />
  )
}
