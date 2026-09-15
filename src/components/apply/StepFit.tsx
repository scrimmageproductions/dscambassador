import type { ApplicationDraft } from './types'
import { TextField, SelectField, PillGroup } from './fields'

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((s) => ({ value: s, label: s }))

export function StepFit({
  draft,
  update,
}: {
  draft: ApplicationDraft
  update: <K extends keyof ApplicationDraft>(key: K, value: ApplicationDraft[K]) => void
}) {
  return (
    <div className="space-y-6">
      <div>
        <p className="label-mono text-[0.68rem] text-cream-wash">Step 3</p>
        <h2 className="mt-2 font-display text-3xl text-cream">Fit</h2>
      </div>

      <SelectField label="Clothing size" name="size" value={draft.size} onChange={(v) => update('size', v)} options={sizes} required />
      <TextField label="Shipping region" name="region" value={draft.region} onChange={(v) => update('region', v)} placeholder="Country / region" required />

      <PillGroup
        label="Garment preference"
        required
        value={draft.garmentPreference}
        onChange={(v) => update('garmentPreference', v)}
        options={[
          { value: 'tee', label: 'Tee' },
          { value: 'sweater', label: 'Crewneck' },
          { value: 'sweatshirt', label: 'Hoodie' },
        ]}
      />

      <div>
        <label htmlFor="upcomingEvents" className="label-mono text-[0.68rem] text-cream-wash">
          Events you already plan to attend
        </label>
        <textarea
          id="upcomingEvents"
          value={draft.upcomingEvents}
          onChange={(e) => update('upcomingEvents', e.target.value)}
          rows={3}
          placeholder="Conferences, local SWC gatherings, hackathons…"
          className="hairline mt-2 w-full resize-none bg-surface px-4 py-3 text-sm text-cream placeholder:text-cream-wash/40 focus-visible:outline-cream"
        />
      </div>
    </div>
  )
}
