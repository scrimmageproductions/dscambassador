export type EventSource = 'Lu.ma Crypto' | 'Team1' | 'Plan.wtf' | 'Stand With Crypto' | 'Campus'
export type DscStatus = 'Ambassadors Attending' | 'Priority Circuit' | 'Open Call'

export type CircuitEvent = {
  id: string
  title: string
  source: EventSource
  date: string
  location: string
  description: string
  link: string
  dscStatus: DscStatus
}

/** Short monospace tag shown on each event card, e.g. "LUMA // CRYPTO". */
export const sourceBadge: Record<EventSource, string> = {
  'Lu.ma Crypto': 'LUMA // CRYPTO',
  Team1: 'TEAM1',
  'Plan.wtf': 'PLAN.WTF',
  'Stand With Crypto': 'SWC',
  Campus: 'CAMPUS',
}

/**
 * Known city/region → [lng, lat] for plotting on the circuit map. Locations
 * that aren't a fixed point ("Location TBD", "Virtual + regional hubs",
 * "Rotating cities") are intentionally left out rather than plotted at a
 * fabricated coordinate — CircuitMap surfaces those as an off-map count
 * instead.
 */
export const locationCoordinates: Record<string, [number, number]> = {
  'Denver, CO': [-104.9903, 39.7392],
  'Austin, TX': [-97.7431, 30.2672],
  Singapore: [103.8198, 1.3521],
  'New York, NY': [-74.006, 40.7128],
  'Washington, D.C.': [-77.0369, 38.9072],
  'San Francisco, CA': [-122.4194, 37.7749],
  'Boston, MA': [-71.0589, 42.3601],
}

export function resolveCoordinates(location: string): [number, number] | null {
  return locationCoordinates[location] ?? null
}

/**
 * Illustrative circuit sample — not a live feed. Live scraping of
 * standwithcrypto.org/events, plan.wtf, lu.ma/crypto, and lu.ma/Team1 isn't
 * available from this build environment (all four domains are blocked by
 * the sandbox's egress policy), so dates below are seasonal placeholders,
 * not confirmed bookings. Links point to each source's hub page itself,
 * not fabricated per-event ticket URLs. Swap this file for a real feed
 * (or a build-time scrape) when one exists.
 */
export const events: CircuitEvent[] = [
  {
    id: 'eth-denver',
    title: 'ETHDenver',
    source: 'Lu.ma Crypto',
    date: 'February 2026',
    location: 'Denver, CO',
    description:
      'Builder-week anchor for the entire circuit. Hackathon energy, side-events stacked wall to wall, and the highest ambassador density of the year.',
    link: 'https://lu.ma/crypto',
    dscStatus: 'Priority Circuit',
  },
  {
    id: 'consensus',
    title: 'Consensus',
    source: 'Lu.ma Crypto',
    date: 'Spring 2026',
    location: 'Austin, TX',
    description:
      'Mainstage conference with a heavy founder and institutional presence — a strong booth-adjacent onboarding opportunity.',
    link: 'https://lu.ma/crypto',
    dscStatus: 'Ambassadors Attending',
  },
  {
    id: 'token2049',
    title: 'Token2049',
    source: 'Lu.ma Crypto',
    date: 'Q3 2026',
    location: 'Singapore',
    description:
      "The region's largest builder and investor gathering. Priority coverage for ambassadors already active in APAC.",
    link: 'https://lu.ma/crypto',
    dscStatus: 'Priority Circuit',
  },
  {
    id: 'solana-breakpoint',
    title: 'Solana Breakpoint',
    source: 'Lu.ma Crypto',
    date: 'Q4 2026',
    location: 'Location TBD',
    description:
      'Annual flagship for the Solana ecosystem. Open call for ambassadors who want to run point on-site.',
    link: 'https://lu.ma/crypto',
    dscStatus: 'Open Call',
  },
  {
    id: 'team1-summit',
    title: 'Team1 Ambassador Summit',
    source: 'Team1',
    date: 'Ongoing',
    location: 'Virtual + regional hubs',
    description:
      'Avalanche Team1’s cross-ecosystem ambassador gathering. High overlap audience — builders already fluent in chapter-style ambassador programs.',
    link: 'https://lu.ma/Team1',
    dscStatus: 'Open Call',
  },
  {
    id: 'team1-regional',
    title: 'Team1 Regional Builder Meetup',
    source: 'Team1',
    date: 'Ongoing — monthly',
    location: 'Rotating cities',
    description:
      'Regional builder meetups run under the Team1 banner. A natural cross-promotion lane for DSC ambassadors already covering that city.',
    link: 'https://lu.ma/Team1',
    dscStatus: 'Ambassadors Attending',
  },
  {
    id: 'denver-side-events',
    title: 'Builder Week Side-Event Circuit',
    source: 'Plan.wtf',
    date: 'February 2026',
    location: 'Denver, CO',
    description:
      'The unofficial events running alongside ETHDenver — house parties, founder dinners, and pop-ups. This is where most onboarding conversations actually happen.',
    link: 'https://plan.wtf',
    dscStatus: 'Priority Circuit',
  },
  {
    id: 'nyc-founders-dinner',
    title: 'Founders Dinner Series',
    source: 'Plan.wtf',
    date: 'Monthly',
    location: 'New York, NY',
    description:
      'A recurring, invite-adjacent dinner circuit for founders and early operators. Small rooms, high signal.',
    link: 'https://plan.wtf',
    dscStatus: 'Open Call',
  },
  {
    id: 'swc-austin',
    title: 'Local SWC Chapter Meetup',
    source: 'Stand With Crypto',
    date: 'Ongoing — monthly',
    location: 'Austin, TX',
    description:
      'Grassroots gathering for the Austin chapter. Ambassadors show up, represent the brand, and onboard newcomers face to face.',
    link: 'https://www.standwithcrypto.org',
    dscStatus: 'Ambassadors Attending',
  },
  {
    id: 'swc-capitol-hill',
    title: 'SWC Capitol Hill Day',
    source: 'Stand With Crypto',
    date: 'Spring 2026',
    location: 'Washington, D.C.',
    description:
      'Where SWC meets legislators and policy staff directly. High-visibility, advocacy-first — not a merch moment.',
    link: 'https://www.standwithcrypto.org',
    dscStatus: 'Priority Circuit',
  },
  {
    id: 'swc-sf',
    title: 'SWC Regional Meetup',
    source: 'Stand With Crypto',
    date: 'Ongoing — monthly',
    location: 'San Francisco, CA',
    description:
      'Bay Area chapter gathering alongside the region’s builder-heavy conference calendar.',
    link: 'https://www.standwithcrypto.org',
    dscStatus: 'Open Call',
  },
  {
    id: 'campus-kickoff-southwest',
    title: 'Campus Chapter Kickoff Circuit',
    source: 'Campus',
    date: 'Fall semester',
    location: 'Austin, TX',
    description:
      'First-semester chapter launches at university blockchain clubs — cards, kit, and the after-party distribution that follows.',
    link: '/campus',
    dscStatus: 'Open Call',
  },
  {
    id: 'campus-mixer-northeast',
    title: 'Blockchain Club Mixer Circuit',
    source: 'Campus',
    date: 'Spring semester',
    location: 'Boston, MA',
    description:
      'Cross-campus mixer season for Northeast blockchain clubs. High headcount, high referral-apparel potential.',
    link: '/campus',
    dscStatus: 'Ambassadors Attending',
  },
]
