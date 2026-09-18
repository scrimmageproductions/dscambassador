export type ApplicationDraft = {
  name: string
  city: string
  isAdult: boolean
  membership: 'yes' | 'no' | ''
  dscBurnerWalletAddress: string
  instagramHandle: string
  instagramFollowers: string
  tiktokHandle: string
  tiktokFollowers: string
  xHandle: string
  xFollowers: string
  conflictingAmbassadorship: 'yes' | 'no' | ''
  size: string
  region: string
  garmentPreference: 'tee' | 'sweater' | 'sweatshirt' | ''
  upcomingEvents: string
  agreed: boolean
  note: string
}

export const emptyDraft: ApplicationDraft = {
  name: '',
  city: '',
  isAdult: false,
  membership: '',
  dscBurnerWalletAddress: '',
  instagramHandle: '',
  instagramFollowers: '',
  tiktokHandle: '',
  tiktokFollowers: '',
  xHandle: '',
  xFollowers: '',
  conflictingAmbassadorship: '',
  size: '',
  region: '',
  garmentPreference: '',
  upcomingEvents: '',
  agreed: false,
  note: '',
}

export const DRAFT_KEY = 'dsc-ambassador-application-draft'

export function meetsFollowerMinimum(d: ApplicationDraft) {
  const counts = [d.instagramFollowers, d.tiktokFollowers, d.xFollowers].map((v) => Number(v) || 0)
  return Math.max(...counts) >= 500
}
