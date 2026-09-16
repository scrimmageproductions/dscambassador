import { brandAssets } from '../../../data/dashboard'
import { LinkButton } from '../../ui/Button'

export function BrandAssetsView() {
  return (
    <div>
      <div className="hairline divide-y divide-cream/10 bg-surface/40">
        {brandAssets.map((asset) => (
          <div key={asset.name} className="flex items-center justify-between gap-4 px-6 py-4">
            <div>
              <p className="font-display text-base text-cream">{asset.name}</p>
              <p className="label-mono mt-1 text-[0.6rem] text-cream-wash">{asset.type}</p>
            </div>
            <button
              type="button"
              disabled
              className="label-mono cursor-not-allowed border border-cream/15 px-4 py-2 text-[0.62rem] text-cream-wash/50"
            >
              Download
            </button>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs leading-relaxed text-cream-wash/70">
        Full asset downloads open once your application is approved and you&rsquo;re added to the
        Telegram Assets channel.
      </p>
      <div className="mt-6">
        <LinkButton to="/guidelines" variant="ghost">
          Read the full guidelines
        </LinkButton>
      </div>
    </div>
  )
}
