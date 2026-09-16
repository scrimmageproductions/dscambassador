const chapters = [
  'HARVARD',
  'STANFORD',
  'BERKELEY',
  'ETH ZÜRICH',
  'CAMBRIDGE',
  'COLUMBIA',
  'TOKYO',
  'MIT',
]

export function CampusTicker() {
  const text = chapters.join(' // ') + ' // '

  return (
    <div className="hairline-t hairline-b flex items-center gap-6 overflow-hidden bg-ink py-4">
      <p className="label-mono shrink-0 pl-6 text-[0.65rem] text-gold">Active chapters</p>
      <div className="relative flex-1 overflow-hidden">
        <p className="sr-only">
          Active chapters at {chapters.join(', ')}, with more launching every semester.
        </p>
        <div className="flex w-max animate-marquee" aria-hidden="true">
          <span className="label-mono shrink-0 whitespace-nowrap pr-12 text-sm text-cream-wash">
            {text}
          </span>
          <span className="label-mono shrink-0 whitespace-nowrap pr-12 text-sm text-cream-wash">
            {text}
          </span>
        </div>
      </div>
    </div>
  )
}
