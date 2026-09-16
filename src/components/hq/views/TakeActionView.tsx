import { MetricsBar } from '../MetricsBar'
import { ActionModule } from '../ActionModule'
import { SectionLabel } from '../../ui/SectionLabel'

export function TakeActionView({ name }: { name: string }) {
  return (
    <div className="space-y-10">
      <div>
        <SectionLabel>Your numbers</SectionLabel>
        <div className="mt-4">
          <MetricsBar />
        </div>
      </div>
      <div>
        <SectionLabel>Take action</SectionLabel>
        <div className="mt-4">
          <ActionModule name={name} />
        </div>
      </div>
    </div>
  )
}
