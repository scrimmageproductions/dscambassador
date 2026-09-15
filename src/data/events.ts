export type EventSource = 'Ecosystem' | 'Plan.wtf' | 'Stand With Crypto' | 'Campus'
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

/**
 * Illustrative circuit sample — not a live feed. Live scraping of
 * standwithcrypto.org/events and plan.wtf isn't available from this build
 * environment, so dates below are seasonal placeholders, not confirmed
 * bookings. Links point to the source calendars themselves, not fabricated
 * per-event ticket pages. Swap this file for a real feed when one exists.
 */
export const events: CircuitEvent[] = [
  {
    id: 'eth-denver',
    title: 'ETHDenver',
    source: 'Ecosystem',
    date: 'February 2026',
    location: 'Denver, CO',
    description:
      'Builder-week anchor for the entire circuit. Hackathon energy, side-events stacked wall to wall, and the highest ambassador density of the year.',
    link: 'https://sheeets.xyz',
    dscStatus: 'Priority Circuit',
  },
  {
    id: 'consensus',
    title: 'Consensus',
    source: 'Ecosystem',
    date: 'Spring 2026',
    location: 'Austin, TX',
    description:
      'Mainstage conference with a heavy founder and institutional presence — a strong booth-adjacent onboarding opportunity.',
    link: 'https://sheeets.xyz',
    dscStatus: 'Ambassadors Attending',
  },
  {
    id: 'token2049',
    title: 'Token2049',
    source: 'Ecosystem',
    date: 'Q3 2026',
    location: 'Singapore',
    description:
      "The region's largest builder and investor gathering. Priority coverage for ambassadors already active in APAC.",
    link: 'https://sheeets.xyz',
    dscStatus: 'Priority Circuit',
  },
  {
    id: 'solana-breakpoint',
    title: 'Solana Breakpoint',
    source: 'Ecosystem',
    date: 'Q4 2026',
    location: 'Location TBD',
    description:
      'Annual flagship for the Solana ecosystem. Open call for ambassadors who want to run point on-site.',
    link: 'https://sheeets.xyz',
    dscStatus: 'Open Call',
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
