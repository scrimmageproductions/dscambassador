import { KitConfigurator } from '../../interactive/KitConfigurator'

export function MerchView() {
  return (
    <div>
      <p className="text-sm leading-relaxed text-cream-3">
        Preview your complimentary core piece, then request it below in Take Action &rarr; Merch drop.
      </p>
      <div className="mt-6">
        <KitConfigurator />
      </div>
    </div>
  )
}
