import { useEffect, useRef } from 'react'

const blobs = [
  { drift: 'thermal-blob-a', color: 'rgba(243,237,227,0.24)', size: '46vw', top: '-12%', left: '-10%' },
  { drift: 'thermal-blob-b', color: 'rgba(196,165,116,0.20)', size: '40vw', top: '8%', left: '58%' },
  { drift: 'thermal-blob-c', color: 'rgba(243,237,227,0.18)', size: '50vw', top: '52%', left: '-16%' },
  { drift: 'thermal-blob-d', color: 'rgba(196,165,116,0.12)', size: '38vw', top: '62%', left: '52%' },
]

/**
 * Fixed, decorative ambient background: slow-drifting blurred blobs in the
 * site's cream/gold palette, with a subtle cursor-parallax offset. Sits
 * behind all page content (z-0, inside the shared z-10 content wrapper in
 * Layout) and below the grain overlay, which paints above everything.
 */
export function ThermalBackground() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const el = ref.current
    if (!el) return

    let raf = 0
    function handleMove(e: MouseEvent) {
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el?.style.setProperty('--mx', `${x * 16}px`)
        el?.style.setProperty('--my', `${y * 16}px`)
      })
    }

    window.addEventListener('mousemove', handleMove)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-bg"
      aria-hidden="true"
    >
      {blobs.map((b) => (
        <div
          key={b.drift}
          className={`thermal-blob ${b.drift}`}
          style={{
            width: b.size,
            height: b.size,
            top: b.top,
            left: b.left,
            background: `radial-gradient(circle, ${b.color} 0%, transparent 70%)`,
          }}
        />
      ))}
    </div>
  )
}
