type Colorway = 'black' | 'cream'
type GarmentProps = { colorway?: Colorway; className?: string }

function palette(colorway: Colorway) {
  return colorway === 'cream'
    ? { fill: '#F3EDE3', stroke: '#0A0A0A', bg: '#141414' }
    : { fill: '#141414', stroke: '#F3EDE3', bg: '#141414' }
}

export function TeeIllustration({ colorway = 'black', className = '' }: GarmentProps) {
  const p = palette(colorway)
  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label="DSC t-shirt">
      <rect width="200" height="200" fill={p.bg} />
      <path
        d="M70 40 L40 55 L25 85 L45 98 L52 82 L52 165 L148 165 L148 82 L155 98 L175 85 L160 55 L130 40 L118 50 A20 20 0 0 1 82 50 Z"
        fill={p.fill}
        stroke={p.stroke}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <circle cx="100" cy="100" r="1.5" fill={p.stroke} opacity="0.6" />
      <text x="100" y="128" textAnchor="middle" fontFamily="Georgia, serif" fontSize="14" fill={p.stroke} opacity="0.85">
        DSC
      </text>
    </svg>
  )
}

export function CrewIllustration({ colorway = 'black', className = '' }: GarmentProps) {
  const p = palette(colorway)
  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label="DSC crewneck sweater">
      <rect width="200" height="200" fill={p.bg} />
      <path
        d="M66 38 L34 52 L20 88 L42 100 L50 84 L50 168 L150 168 L150 84 L158 100 L180 88 L166 52 L134 38 L122 48 A24 22 0 0 1 78 48 Z"
        fill={p.fill}
        stroke={p.stroke}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M78 48 A24 22 0 0 0 122 48" fill="none" stroke={p.stroke} strokeWidth="2" opacity="0.7" />
      <text x="100" y="132" textAnchor="middle" fontFamily="Georgia, serif" fontSize="12" fill={p.stroke} opacity="0.85">
        SPENDERS CLUB
      </text>
    </svg>
  )
}

export function HoodieIllustration({ colorway = 'black', className = '' }: GarmentProps) {
  const p = palette(colorway)
  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label="DSC hoodie">
      <rect width="200" height="200" fill={p.bg} />
      <path
        d="M100 22 C74 22 60 40 60 55 L34 62 L20 96 L42 106 L50 90 L50 172 L150 172 L150 90 L158 106 L180 96 L166 62 L140 55 C140 40 126 22 100 22 Z"
        fill={p.fill}
        stroke={p.stroke}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M84 60 Q100 78 116 60" fill="none" stroke={p.stroke} strokeWidth="2" opacity="0.7" />
      <line x1="94" y1="95" x2="92" y2="140" stroke={p.stroke} strokeWidth="1.5" opacity="0.6" />
      <line x1="106" y1="95" x2="108" y2="140" stroke={p.stroke} strokeWidth="1.5" opacity="0.6" />
      <circle cx="93" cy="140" r="2" fill={p.stroke} opacity="0.6" />
      <circle cx="107" cy="140" r="2" fill={p.stroke} opacity="0.6" />
    </svg>
  )
}

export function NFCKeychainIllustration({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label="DSC NFC keychain">
      <rect width="200" height="200" fill="#141414" />
      <rect x="55" y="30" width="90" height="130" rx="14" fill="#0A0A0A" stroke="#F3EDE3" strokeWidth="2.5" />
      <circle cx="100" cy="46" r="5" fill="none" stroke="#C4A574" strokeWidth="2" />
      <text x="100" y="105" textAnchor="middle" fontFamily="Georgia, serif" fontSize="15" fill="#F3EDE3">
        DSC
      </text>
      <text x="100" y="122" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="6" letterSpacing="1" fill="#C4B8A4">
        NFC TAP
      </text>
      <path
        d="M118 88 a12 12 0 0 1 0 17 M124 82 a20 20 0 0 1 0 29"
        fill="none"
        stroke="#C4A574"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function MembershipCardIllustration({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 200" className={className} role="img" aria-label="DSC membership card">
      <rect width="320" height="200" rx="16" fill="#0A0A0A" stroke="#F3EDE3" strokeWidth="1.5" />
      <rect x="20" y="20" width="280" height="160" rx="8" fill="none" stroke="#F3EDE3" strokeOpacity="0.15" />
      <text x="40" y="60" fontFamily="Georgia, serif" fontSize="22" fill="#F3EDE3">
        DSC
      </text>
      <text x="40" y="80" fontFamily="ui-monospace, monospace" fontSize="8" letterSpacing="2" fill="#C4B8A4">
        DIGITAL SPENDERS CLUB
      </text>
      <text x="40" y="150" fontFamily="ui-monospace, monospace" fontSize="9" letterSpacing="1.5" fill="#E8DFD0">
        MEMBER
      </text>
      <text x="40" y="166" fontFamily="ui-monospace, monospace" fontSize="11" letterSpacing="3" fill="#F3EDE3">
        •••• •••• 04
      </text>
      <text x="280" y="166" textAnchor="end" fontFamily="Georgia, serif" fontSize="13" fill="#C4A574">
        ©
      </text>
    </svg>
  )
}
