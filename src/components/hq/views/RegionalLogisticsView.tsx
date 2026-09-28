import { RegionalCardInventory } from '../RegionalCardInventory'

export function RegionalLogisticsView() {
  return (
    <div className="space-y-6">
      <p className="max-w-2xl text-sm leading-relaxed text-cream-3">
        Decentralized regional nodes each carry their own card batch, activation rate, and backup
        contact. Set a secondary node under Settings, then track your inventory and request a
        reorder here once your region clears the activation gate.
      </p>
      <RegionalCardInventory />
    </div>
  )
}
