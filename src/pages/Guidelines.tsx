import { Button, LinkButton } from '../components/ui/Button'
import { Tagline } from '../components/ui/Tagline'
import { eligibility, commitments, contentRules, successMetrics, AGREEMENT_TEXT } from '../content/guidelines'

export function Guidelines() {
  return (
    <div>
      <div className="hairline-b bg-noise">
        <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
          <p className="label-mono text-[0.7rem] text-cream-wash">Official Guidelines</p>
          <h1 className="mt-4 font-display text-4xl text-cream md:text-5xl">
            Digital Spenders Club Ambassador Program
          </h1>
          <div className="no-print mt-8 flex flex-wrap gap-3">
            <Button variant="ghost" onClick={() => window.print()}>
              Print / save as PDF
            </Button>
            <LinkButton to="/apply" variant="solid">
              Apply
            </LinkButton>
          </div>
        </div>
      </div>

      <article className="mx-auto max-w-3xl px-6 py-16 md:py-20">
        <section>
          <h2 className="font-display text-2xl text-cream md:text-3xl">1. Who We&rsquo;re Looking For</h2>
          <ul className="mt-5 space-y-3 text-base leading-relaxed text-cream-2">
            {eligibility.map((e) => (
              <li key={e.title} className="flex gap-3">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-cream-wash" aria-hidden="true" />
                <span>{e.detail}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="hairline-t mt-12 pt-12">
          <h2 className="font-display text-2xl text-cream md:text-3xl">
            2. What You&rsquo;ll Do (Minimum Commitment)
          </h2>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="hairline-b">
                  <th scope="col" className="py-3 pr-4 label-mono text-[0.68rem] text-cream-wash">Frequency</th>
                  <th scope="col" className="py-3 pr-4 label-mono text-[0.68rem] text-cream-wash">Task</th>
                  <th scope="col" className="py-3 label-mono text-[0.68rem] text-cream-wash">Example</th>
                </tr>
              </thead>
              <tbody>
                {commitments.map((c) => (
                  <tr key={c.frequency} className="hairline-b align-top">
                    <td className="py-4 pr-4 font-display text-cream">{c.frequency}</td>
                    <td className="py-4 pr-4 text-cream-2">{c.task}</td>
                    <td className="py-4 text-cream-3">{c.example} {c.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 text-base text-cream-2">
            All posts must tag <strong className="text-cream">@DigitalSpendersClub</strong>.
          </p>
        </section>

        <section className="hairline-t mt-12 pt-12">
          <h2 className="font-display text-2xl text-cream md:text-3xl">3. Content Rules (Non-Negotiable)</h2>
          <ul className="mt-5 space-y-3 text-base leading-relaxed text-cream-2">
            {contentRules.map((rule) => (
              <li key={rule} className="flex gap-3">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-cream-wash" aria-hidden="true" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="hairline-t mt-12 pt-12">
          <h2 className="font-display text-2xl text-cream md:text-3xl">4. How We Measure Success</h2>
          <ul className="mt-5 space-y-4 text-base leading-relaxed text-cream-2">
            {successMetrics.map((m) => (
              <li key={m.title}>
                <strong className="text-cream">{m.title}</strong> — {m.detail}
              </li>
            ))}
          </ul>
        </section>

        <section className="hairline-t mt-12 pt-12">
          <p className="text-sm italic leading-relaxed text-cream-wash">{AGREEMENT_TEXT}</p>
          <div className="mt-8">
            <Tagline />
          </div>
          <p className="mt-4 text-sm text-cream-3">Questions? DM @YoungScrimmage.</p>
        </section>
      </article>
    </div>
  )
}
