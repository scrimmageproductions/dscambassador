import { PageHero } from '../components/ui/PageHero'
import { SectionLabel } from '../components/ui/SectionLabel'
import { HairlineCard } from '../components/ui/HairlineCard'
import { CampusInterestForm } from '../components/interactive/CampusInterestForm'
import { CampusTicker } from '../components/interactive/CampusTicker'
import { CampusCardCustomizer } from '../components/interactive/CampusCardCustomizer'
import { Reveal } from '../components/motion/Reveal'

const featureCards = [
  {
    label: 'Custom Chapter Cards',
    body: 'Co-branded membership cards tailored to your university club. Distributed hand-to-hand at campus meetups, hackathons, and after-parties to unlock the Digital Spenders Club experience.',
  },
  {
    label: 'Chapter Treasury Funding',
    body: 'Twenty percent revenue share on all apparel moved through your chapter. Direct capital deposited straight to your club to fund local events, hackathon travel, and campus activations. No points, no tiers, just real funding.',
  },
]

const flow = [
  {
    step: '01',
    title: 'Identify the Club',
    body: 'A university blockchain club or builder collective already driving local momentum.',
  },
  {
    step: '02',
    title: 'Issue Cards & Kit',
    body: 'Custom co-branded cards and core kit pieces shipped directly to the chapter lead.',
  },
  {
    step: '03',
    title: 'Onboard IRL',
    body: 'Hand-to-hand distribution at meetings and events with a simple tap-to-phone interaction.',
  },
  {
    step: '04',
    title: 'Unlock HQ Access',
    body: 'Chapter members gain direct access to global events, ambassador networks, and travel support.',
  },
]

export function Campus() {
  return (
    <div>
      <PageHero
        eyebrow="Campus"
        title="Where the next wave gathers."
        lede="Custom chapter cards, heavy apparel, and direct treasury funding for university blockchain groups moving culture forward."
      />

      <CampusTicker />

      <section className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <Reveal>
          <SectionLabel>What your chapter gets</SectionLabel>
        </Reveal>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {featureCards.map((c, i) => (
            <HairlineCard key={c.label} delay={i * 0.1}>
              <h3 className="font-display text-xl text-cream">{c.label}</h3>
              <p className="mt-3 text-sm leading-relaxed text-cream-3">{c.body}</p>
            </HairlineCard>
          ))}
        </div>
      </section>

      <section className="hairline-t bg-surface/20">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <Reveal>
            <SectionLabel>How a chapter works</SectionLabel>
          </Reveal>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {flow.map((f, i) => (
              <HairlineCard key={f.step} delay={i * 0.1}>
                <p className="label-mono text-[0.68rem] text-gold">{f.step} //</p>
                <h3 className="mt-4 font-display text-lg text-cream">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cream-3">{f.body}</p>
              </HairlineCard>
            ))}
          </div>
        </div>
      </section>

      <section className="hairline-t bg-surface/20">
        <div className="mx-auto max-w-3xl px-6 py-20 md:py-24">
          <Reveal stagger>
            <SectionLabel>Start a chapter</SectionLabel>
            <h2 className="mt-6 font-display text-3xl text-cream md:text-4xl">
              Tell us about your club.
            </h2>
          </Reveal>
          <div className="mt-10">
            <CampusCardCustomizer />
          </div>
          <div className="mt-10">
            <CampusInterestForm />
          </div>
        </div>
      </section>
    </div>
  )
}
