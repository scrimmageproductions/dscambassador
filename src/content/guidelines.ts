export const eligibility = [
  {
    title: 'Genuine member',
    detail: 'A genuine Digital Spenders Club member who moves crypto forward.',
  },
  {
    title: 'Active online',
    detail:
      'Active on Instagram, TikTok, or X: minimum 500 followers for ambassadorship consideration.',
  },
  {
    title: '18 or older',
    detail: 'Ambassadors must be 18+ years old.',
  },
  {
    title: 'No conflicts',
    detail:
      'No current ambassadorships that will conflict with Digital Spenders Club participation.',
  },
] as const

export type CommitmentRow = {
  frequency: string
  task: string
  example: string
  detail: string
}

export const commitments: CommitmentRow[] = [
  {
    frequency: '2x / month',
    task: 'Post original content featuring DSC product',
    example: 'Feed, Reel, or TikTok.',
    detail:
      'Unboxing, styling three ways, a "day in the life" fit check, wearing DSC clothing in relevant content with a mention, conference content, spending-crypto content, and similar formats all count.',
  },
  {
    frequency: 'Daily',
    task: 'Engage with @DigitalSpendersClub posts when they drop',
    example: 'Like, repost, and comment within 24 hours of drop.',
    detail:
      '"This colorway is insane," "been waiting for this collab," "can\'t wait until this collection drops." Genuine, timely engagement that shows up in the first 24 hours.',
  },
  {
    frequency: '1x / quarter',
    task: 'Attend a major conference or local crypto event and promote DSC',
    example: 'Encourage people to join the club.',
    detail:
      'Hand out DSC Membership Cards to onboard people at events and conferences IRL. Join panels and/or get a sponsor booth or space at events when possible.',
  },
]

export const contentRules = [
  'No edits to our logo or product images.',
  'Use common sense and be kind. Don’t use hurtful or discriminatory messaging while repping the brand.',
  'No reselling free product meant for the ambassadorship program. Instant termination.',
]

export const successMetrics = [
  {
    title: 'Engagement rate',
    detail: 'Are people interacting with your content? Reposts, likes, comments.',
  },
  {
    title: 'Community interactions',
    detail:
      'Are you hyping others in the crew? Are other relevant communities interacting with your DSC content?',
  },
  {
    title: 'Member onboarding',
    detail:
      'How many members are joining the Digital Spenders Club movement off the strength of your recommendation or content? Are you actively encouraging followers to join?',
  },
  {
    title: 'Monthly Ambassador Call',
    detail: 'Are you attending? Are you contributing and helping move the program forward?',
  },
]

export const AGREEMENT_TEXT =
  'By checking “I agree,” the applicant confirms they have read and accept these guidelines.'
