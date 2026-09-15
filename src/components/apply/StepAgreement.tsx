import type { ApplicationDraft } from './types'
import { eligibility, commitments, contentRules, successMetrics } from '../../content/guidelines'

export function StepAgreement({
  draft,
  update,
}: {
  draft: ApplicationDraft
  update: <K extends keyof ApplicationDraft>(key: K, value: ApplicationDraft[K]) => void
}) {
  return (
    <div className="space-y-6">
      <div>
        <p className="label-mono text-[0.68rem] text-cream-wash">Step 4</p>
        <h2 className="mt-2 font-display text-3xl text-cream">Agreement</h2>
        <p className="mt-2 text-sm text-cream-3">Read the official guidelines before you submit.</p>
      </div>

      <div className="hairline max-h-72 overflow-y-auto bg-ink p-6 text-sm leading-relaxed text-cream-3">
        <section>
          <h3 className="label-mono text-[0.68rem] text-cream-wash">1. Who we&rsquo;re looking for</h3>
          <ul className="mt-2 list-disc space-y-1 pl-4">
            {eligibility.map((e) => (
              <li key={e.title}>{e.detail}</li>
            ))}
          </ul>
        </section>

        <section className="mt-5">
          <h3 className="label-mono text-[0.68rem] text-cream-wash">2. What you&rsquo;ll do (minimum commitment)</h3>
          <ul className="mt-2 list-disc space-y-1 pl-4">
            {commitments.map((c) => (
              <li key={c.frequency}>
                <span className="text-cream-2">{c.frequency}:</span> {c.task}. {c.example}
              </li>
            ))}
          </ul>
          <p className="mt-2">All posts must tag @DigitalSpendersClub.</p>
        </section>

        <section className="mt-5">
          <h3 className="label-mono text-[0.68rem] text-cream-wash">3. Content rules (non-negotiable)</h3>
          <ul className="mt-2 list-disc space-y-1 pl-4">
            {contentRules.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </section>

        <section className="mt-5">
          <h3 className="label-mono text-[0.68rem] text-cream-wash">4. How we measure success</h3>
          <ul className="mt-2 list-disc space-y-1 pl-4">
            {successMetrics.map((m) => (
              <li key={m.title}>
                <span className="text-cream-2">{m.title}:</span> {m.detail}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <label className="hairline flex items-start gap-3 bg-surface/40 px-4 py-4 text-sm text-cream-2">
        <input
          type="checkbox"
          checked={draft.agreed}
          onChange={(e) => update('agreed', e.target.checked)}
          className="mt-0.5 h-4 w-4 accent-[#F3EDE3]"
        />
        <span>
          I have read and accept the Ambassador Program guidelines. <span className="text-gold">*</span>
        </span>
      </label>

      <div>
        <label htmlFor="note" className="label-mono text-[0.68rem] text-cream-wash">
          Anything else we should know? (optional)
        </label>
        <textarea
          id="note"
          value={draft.note}
          onChange={(e) => update('note', e.target.value)}
          rows={3}
          className="hairline mt-2 w-full resize-none bg-surface px-4 py-3 text-sm text-cream focus-visible:outline-cream"
        />
      </div>
    </div>
  )
}
