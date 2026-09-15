import type { ApplicationDraft } from './types'
import { meetsFollowerMinimum } from './types'
import { TextField, PillGroup } from './fields'

export function StepPresence({
  draft,
  update,
}: {
  draft: ApplicationDraft
  update: <K extends keyof ApplicationDraft>(key: K, value: ApplicationDraft[K]) => void
}) {
  const underMinimum =
    (draft.instagramHandle || draft.tiktokHandle || draft.xHandle) && !meetsFollowerMinimum(draft)

  return (
    <div className="space-y-6">
      <div>
        <p className="label-mono text-[0.68rem] text-cream-wash">Step 2</p>
        <h2 className="mt-2 font-display text-3xl text-cream">Presence</h2>
        <p className="mt-2 text-sm text-cream-3">
          At least one platform, 500+ followers, for standard consideration.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Instagram handle" name="instagramHandle" value={draft.instagramHandle} onChange={(v) => update('instagramHandle', v)} placeholder="@handle" />
        <TextField label="Instagram followers" name="instagramFollowers" type="number" value={draft.instagramFollowers} onChange={(v) => update('instagramFollowers', v)} placeholder="0" />
        <TextField label="TikTok handle" name="tiktokHandle" value={draft.tiktokHandle} onChange={(v) => update('tiktokHandle', v)} placeholder="@handle" />
        <TextField label="TikTok followers" name="tiktokFollowers" type="number" value={draft.tiktokFollowers} onChange={(v) => update('tiktokFollowers', v)} placeholder="0" />
        <TextField label="X handle" name="xHandle" value={draft.xHandle} onChange={(v) => update('xHandle', v)} placeholder="@handle" />
        <TextField label="X followers" name="xFollowers" type="number" value={draft.xFollowers} onChange={(v) => update('xFollowers', v)} placeholder="0" />
      </div>

      {underMinimum ? (
        <p className="hairline bg-ink px-4 py-3 text-xs leading-relaxed text-cream-wash">
          Below the 500-follower minimum — reviewed case by case. You can still submit.
        </p>
      ) : null}

      <PillGroup
        label="Do you hold a conflicting ambassadorship right now?"
        required
        value={draft.conflictingAmbassadorship}
        onChange={(v) => update('conflictingAmbassadorship', v)}
        options={[
          { value: 'no', label: 'No' },
          { value: 'yes', label: 'Yes' },
        ]}
      />
    </div>
  )
}
