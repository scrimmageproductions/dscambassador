export type DashboardViewKey =
  | 'take-action'
  | 'directory'
  | 'activity'
  | 'budget'
  | 'events'
  | 'event-reports'
  | 'reimbursement'
  | 'my-expenses'
  | 'gallery'
  | 'merch'
  | 'growth'
  | 'brand-assets'
  | 'settings'
  | 'mailing-address'

export type NavGroup = {
  label: string
  items: { key: DashboardViewKey; label: string }[]
}

export const navGroups: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { key: 'take-action', label: 'Take Action' },
      { key: 'directory', label: 'Directory' },
      { key: 'activity', label: 'Activity' },
    ],
  },
  {
    label: 'Finances',
    items: [
      { key: 'budget', label: '2026 Budget' },
      { key: 'events', label: 'Events' },
      { key: 'event-reports', label: 'Event Reports' },
      { key: 'reimbursement', label: 'Expense Reimbursement' },
      { key: 'my-expenses', label: 'My Expenses' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { key: 'gallery', label: 'Photo Gallery' },
      { key: 'merch', label: 'Order Merch' },
      { key: 'growth', label: 'Community Growth' },
    ],
  },
  {
    label: 'Resources',
    items: [{ key: 'brand-assets', label: 'Brand Assets & Guidelines' }],
  },
  {
    label: 'System',
    items: [
      { key: 'settings', label: 'Settings' },
      { key: 'mailing-address', label: 'Mailing Address' },
    ],
  },
]

export const viewLabels: Record<DashboardViewKey, string> = Object.fromEntries(
  navGroups.flatMap((g) => g.items.map((i) => [i.key, i.label])),
) as Record<DashboardViewKey, string>

/** Demo-only "live" metrics shown once signed in. Sells the authenticated state visitors were asked to preview. */
export const dashboardMetrics = [
  { label: 'Members onboarded', value: '12', hint: 'via your membership cards + referral link' },
  { label: 'Content posted', value: '2 / 2', hint: 'this month' },
  { label: 'Events attended', value: '1 / 1', hint: 'this quarter' },
  { label: 'SYNC attendance', value: '4 / 4', hint: 'monthly ambassador call' },
]

export const directory = [
  { name: 'Jordan Lee', region: 'New York, NY', focus: 'Circuit events', since: '2025' },
  { name: 'Priya Nandan', region: 'Austin, TX', focus: 'Campus chapters', since: '2025' },
  { name: 'Marcus Webb', region: 'San Francisco, CA', focus: 'Content', since: '2024' },
  { name: 'Sofia Reyes', region: 'Denver, CO', focus: 'IRL activations', since: '2025' },
  { name: 'Kenji Ito', region: 'Singapore', focus: 'APAC circuit', since: '2026' },
  { name: 'Amara Okafor', region: 'Washington, D.C.', focus: 'Advocacy / SWC', since: '2025' },
]

export const activityFeed = [
  { title: 'Content posted to X', detail: 'Tagged @DigitalSpendersClub, counted toward this month.', time: '2 days ago' },
  { title: 'Onboarded a new member', detail: 'Tap-to-verify via your Membership Card at ETHDenver.', time: '5 days ago' },
  { title: 'Attended monthly SYNC call', detail: 'Growth + event opportunities agenda.', time: '1 week ago' },
  { title: 'Event report submitted', detail: 'Builder Week Side-Event Circuit, Denver, CO.', time: '1 week ago' },
  { title: 'Merch drop requested', detail: 'Restock: membership cards, flyers.', time: '2 weeks ago' },
]

export const budgetLines = [
  { category: 'Travel & tickets', allocated: '$1,200', used: '$430', status: 'On track' },
  { category: 'Event materials', allocated: '$400', used: '$180', status: 'On track' },
  { category: 'Merch restock', allocated: '$600', used: '$600', status: 'Fully used' },
  { category: 'Campus chapter kit', allocated: '$800', used: '$120', status: 'On track' },
]

export const myEvents = [
  { title: 'ETHDenver', role: 'Ambassador on-site', date: 'February 2026', status: 'Confirmed' },
  { title: 'Local SWC Chapter Meetup', role: 'Host', date: 'Ongoing, monthly', status: 'Recurring' },
  { title: 'Consensus', role: 'Requested', date: 'Spring 2026', status: 'Pending approval' },
]

export const expenseReports = [
  { item: 'Flight to ETHDenver', amount: '$210.00', status: 'Reimbursed' },
  { item: 'Printed flyers (250x)', amount: '$64.50', status: 'Reimbursed' },
  { item: 'Ground transport in Denver', amount: '$38.00', status: 'Pending review' },
]

export const submittedEventReports = [
  { event: 'ETHDenver: Builder Week', submitted: 'Feb 2026', status: 'Approved' },
  { event: 'Local SWC Chapter Meetup', submitted: 'Jan 2026', status: 'Approved' },
  { event: 'Founders Dinner Series', submitted: 'Dec 2025', status: 'Under review' },
]

export const growthHistory = [
  { month: 'Apr', onboarded: 3 },
  { month: 'May', onboarded: 5 },
  { month: 'Jun', onboarded: 4 },
  { month: 'Jul', onboarded: 7 },
  { month: 'Aug', onboarded: 6 },
  { month: 'Sep', onboarded: 12 },
]

export const galleryItems = [
  { src: '/dsc-culture.gif', caption: 'Pop-up, New York, NY' },
  { src: '/dsceventgif.gif', caption: 'ETHDenver builder week' },
  { src: '/apparelgif.gif', caption: 'Kit drop unboxing' },
  { src: '/dsc-culture.gif', caption: 'Campus chapter kickoff' },
  { src: '/dsceventgif.gif', caption: 'Local SWC meetup' },
  { src: '/apparelgif.gif', caption: 'Ambassador summit' },
]

export const brandAssets = [
  { name: 'Logo pack (white / black)', type: 'ZIP · PNG + SVG' },
  { name: 'Membership card artwork', type: 'PNG' },
  { name: 'Social templates', type: 'ZIP · PSD + PNG' },
  { name: 'Brand guidelines PDF', type: 'PDF' },
]
