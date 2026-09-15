const materials = ['Flyers', 'Banners', 'Extra membership cards', 'Signage']

export function EventMaterialsRequest() {
  return (
    <div className="hairline relative overflow-hidden bg-surface/40 p-6 md:p-8">
      <p className="label-mono text-[0.68rem] text-cream-wash">Event materials request</p>
      <p className="mt-2 text-sm text-cream-3">
        Preview only. This request unlocks in the private Telegram Assets channel after approval.
      </p>

      <fieldset disabled className="mt-6 grid gap-3 opacity-50 sm:grid-cols-2" aria-disabled="true">
        {materials.map((m) => (
          <label key={m} className="hairline flex items-center gap-3 px-4 py-3 text-sm text-cream-3">
            <input type="checkbox" className="h-4 w-4" />
            {m}
          </label>
        ))}
      </fieldset>

      <button
        type="button"
        disabled
        className="label-mono mt-6 cursor-not-allowed border border-cream/15 px-7 py-3.5 text-[0.72rem] text-cream-wash/50"
      >
        Request materials
      </button>

      <p className="mt-4 text-xs text-cream-wash/70">
        Approved ambassadors request assets directly in Telegram — no waiting on a form.
      </p>
    </div>
  )
}
