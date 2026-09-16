import { useState } from 'react'
import { DashboardHeader } from './DashboardHeader'
import { DashboardSidebar } from './DashboardSidebar'
import { TakeActionView } from './views/TakeActionView'
import { DirectoryView } from './views/DirectoryView'
import { ActivityView } from './views/ActivityView'
import { BudgetView } from './views/BudgetView'
import { EventsView } from './views/EventsView'
import { EventReportsView } from './views/EventReportsView'
import { ReimbursementView } from './views/ReimbursementView'
import { MyExpensesView } from './views/MyExpensesView'
import { GalleryView } from './views/GalleryView'
import { MerchView } from './views/MerchView'
import { GrowthView } from './views/GrowthView'
import { BrandAssetsView } from './views/BrandAssetsView'
import { SettingsView } from './views/SettingsView'
import { MailingAddressView } from './views/MailingAddressView'
import { viewLabels, type DashboardViewKey } from '../../data/dashboard'
import { Reveal } from '../motion/Reveal'

function renderView(key: DashboardViewKey, name: string) {
  switch (key) {
    case 'take-action':
      return <TakeActionView name={name} />
    case 'directory':
      return <DirectoryView />
    case 'activity':
      return <ActivityView />
    case 'budget':
      return <BudgetView />
    case 'events':
      return <EventsView />
    case 'event-reports':
      return <EventReportsView />
    case 'reimbursement':
      return <ReimbursementView />
    case 'my-expenses':
      return <MyExpensesView />
    case 'gallery':
      return <GalleryView />
    case 'merch':
      return <MerchView />
    case 'growth':
      return <GrowthView />
    case 'brand-assets':
      return <BrandAssetsView />
    case 'settings':
      return <SettingsView />
    case 'mailing-address':
      return <MailingAddressView />
    default:
      return null
  }
}

export function AmbassadorDashboard({ name, onSignOut }: { name: string; onSignOut: () => void }) {
  const [active, setActive] = useState<DashboardViewKey>('take-action')

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
      <DashboardHeader name={name} onSignOut={onSignOut} />

      <div className="mt-10 grid gap-6 md:grid-cols-[240px_1fr] md:items-start">
        <DashboardSidebar active={active} onSelect={setActive} />

        <div className="min-w-0">
          <Reveal key={active} amount={0.05}>
            <h2 className="font-display text-2xl text-cream md:text-3xl">{viewLabels[active]}</h2>
            <div className="mt-6">{renderView(active, name)}</div>
          </Reveal>
        </div>
      </div>
    </div>
  )
}
