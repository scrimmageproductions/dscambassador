import type { ApplicationDraft } from './types'
import { TextField, PillGroup } from './fields'

export function StepIdentity({
  draft,
  update,
}: {
  draft: ApplicationDraft
  update: <K extends keyof ApplicationDraft>(key: K, value: ApplicationDraft[K]) => void
}) {
  return (
    <div className="space-y-6">
      <div>
        <p className="label-mono text-[0.68rem] text-cream-wash">Step 1</p>
        <h2 className="mt-2 font-display text-3xl text-cream">Identity</h2>
      </div>

      <TextField label="Full name" name="name" value={draft.name} onChange={(v) => update('name', v)} placeholder="Your name" required />
      <TextField label="City / region" name="city" value={draft.city} onChange={(v) => update('city', v)} placeholder="e.g. Austin, TX" required />

      <label className="hairline flex items-start gap-3 rounded-lg px-4 py-4 text-sm text-cream-2">
        <input
          type="checkbox"
          checked={draft.isAdult}
          onChange={(e) => update('isAdult', e.target.checked)}
          className="mt-0.5 h-4 w-4 accent-[#F3EDE3]"
        />
        <span>I confirm I am 18 years of age or older. <span className="text-gold">*</span></span>
      </label>

      <PillGroup
        label="Are you a Digital Spenders Club member?"
        required
        value={draft.membership}
        onChange={(v) => update('membership', v)}
        options={[
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'Not yet' },
        ]}
      />
      {draft.membership === 'yes' ? (
        <TextField
          label="DSC Burner Wallet Address"
          name="dscBurnerWalletAddress"
          value={draft.dscBurnerWalletAddress}
          onChange={(v) => update('dscBurnerWalletAddress', v)}
          placeholder="Paste the wallet address linked to your Burner account"
          required
        />
      ) : null}

      {draft.membership === 'no' ? (
        <p className="text-xs leading-relaxed text-cream-wash/80">
          Ambassadors are genuine DSC members. You can still submit. Join the club at{' '}
          <a href="https://spenders.club" target="_blank" rel="noreferrer" className="underline decoration-cream/40 underline-offset-4 hover:text-cream">
            spenders.club
          </a>{' '}
          alongside your application.
        </p>
      ) : null}
    </div>
  )
}
