import { PageHero } from '../components/ui/PageHero'
import { SectionLabel } from '../components/ui/SectionLabel'
import { HairlineCard } from '../components/ui/HairlineCard'
import { LinkButton } from '../components/ui/Button'
import { CommitmentTable } from '../components/interactive/CommitmentTable'
import { CommitmentCalendar } from '../components/interactive/CommitmentCalendar'
import { eligibility, contentRules, successMetrics } from '../content/guidelines'
import { Reveal } from '../components/motion/Reveal'

export function Program() {
  return (
    <div>
      <PageHero
        eyebrow="The Program"
        title="Culture moves through action."
        lede="Original content, IRL activations, and member onboarding. Driving real-world motion wherever spenders gather."
      >
        <div className="mt-8">
          <LinkButton to="/apply" variant="solid">
            Apply
          </LinkButton>
        </div>
      </PageHero>

      <section className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <Reveal>
          <SectionLabel>Who we&rsquo;re looking for</SectionLabel>
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {eligibility.map((e, i) => (
            <HairlineCard key={e.title} delay={i * 0.1}>
              <h3 className="font-display text-xl text-cream">{e.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-cream-3">{e.detail}</p>
            </HairlineCard>
          ))}
        </div>
      </section>

      <section className="hairline-t hairline-b bg-surface/20">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <Reveal stagger>
            <SectionLabel>What you&rsquo;ll do — minimum commitment</SectionLabel>
            <h2 className="mt-6 max-w-2xl font-display text-3xl text-cream md:text-4xl">
              Three cadences. Nothing hidden.
            </h2>
          </Reveal>
          <div className="mt-10">
            <CommitmentTable />
          </div>
          <div className="mt-8">
            <CommitmentCalendar />
          </div>
          <p className="mt-6 text-sm text-cream-3">
            All posts must tag <span className="text-cream">@DigitalSpendersClub</span>.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <Reveal>
          <SectionLabel>Content rules — non-negotiable</SectionLabel>
        </Reveal>
        <div className="mt-8 grid gap-px overflow-hidden hairline bg-cream/10 md:grid-cols-3">
          {contentRules.map((rule, i) => (
            <Reveal key={rule} as="div" delay={i * 0.1} amount={0.2}>
              <div className="bg-ink p-8">
                <p className="label-mono text-[0.68rem] text-gold">0{i + 1}</p>
                <p className="mt-4 text-base leading-relaxed text-cream-2">{rule}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="hairline-t bg-surface/20">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <Reveal>
            <SectionLabel>How we measure success</SectionLabel>
          </Reveal>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {successMetrics.map((m, i) => (
              <HairlineCard key={m.title} delay={i * 0.1}>
                <h3 className="font-display text-lg text-cream">{m.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cream-3">{m.detail}</p>
              </HairlineCard>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20 text-center md:py-28">
        <h2 className="font-display text-3xl text-cream md:text-4xl">Ready to move?</h2>
        <div className="mt-8 flex justify-center gap-4">
          <LinkButton to="/apply" variant="solid">
            Apply
          </LinkButton>
          <LinkButton to="/guidelines" variant="ghost">
            Full guidelines
          </LinkButton>
        </div>
      </section>
    </div>
  )
}
