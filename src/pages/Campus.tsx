import { PageHero } from '../components/ui/PageHero'
import { SectionLabel } from '../components/ui/SectionLabel'
import { HairlineCard } from '../components/ui/HairlineCard'
import { CampusInterestForm } from '../components/interactive/CampusInterestForm'
import { MembershipCardIllustration } from '../components/illustrations/Garments'
import { Reveal } from '../components/motion/Reveal'
import { TiltCard } from '../components/motion/TiltCard'

const flow = [
  { step: '01', title: 'Identify the club', body: 'A university blockchain club, crypto society, or builder group already gathering the next wave of spenders.' },
  { step: '02', title: 'Issue cards + kit', body: 'Custom chapter membership cards and core kit pieces, sized and shipped to the chapter lead.' },
  { step: '03', title: 'Distribute IRL', body: 'Club meetings and after-parties, where cards move hand to hand, not through a form.' },
  { step: '04', title: 'Referral apparel', body: 'Members onboarded through the chapter unlock additional apparel for the people who brought them in.' },
]

export function Campus() {
  return (
    <div>
      <PageHero
        eyebrow="Campus"
        title="Clubs are where the next wave of spenders already gathers."
        lede="University blockchain clubs are a high-value expansion surface. Campus chapters put custom cards, kit, and a merch program directly into that existing energy."
      />

      <section className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <Reveal>
          <SectionLabel>Custom chapter cards</SectionLabel>
        </Reveal>
        <div className="mt-8 grid items-center gap-10 md:grid-cols-2">
          <Reveal stagger>
            <h2 className="font-display text-3xl text-cream md:text-4xl">
              Every chapter gets its own membership card.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-cream-3">
              Custom membership cards for each college blockchain club, distributed at meetings and
              after-parties. Conference-ready DSC cards can also carry a loaded activation
              experience, presented as example activations for campus conference presence, not a
              standing promise on any single card.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <TiltCard maxTilt={10} className="rounded-2xl">
              <MembershipCardIllustration className="w-full" />
            </TiltCard>
          </Reveal>
        </div>
      </section>

      <section className="hairline-t hairline-b bg-surface/20">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <Reveal stagger>
            <SectionLabel>Merch kickback</SectionLabel>
            <h2 className="mt-6 max-w-xl font-display text-3xl text-cream md:text-4xl">
              20% profit share on merch sold through the chapter.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-cream-3">
              Simple math: a chapter moves DSC merch through its own network, and keeps 20% of the
              profit. No points, no tiers, just a straight kickback for chapters that actually sell.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <Reveal>
          <SectionLabel>How a chapter works</SectionLabel>
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {flow.map((f, i) => (
            <HairlineCard key={f.step} delay={i * 0.1}>
              <p className="label-mono text-[0.68rem] text-gold">{f.step}</p>
              <h3 className="mt-4 font-display text-lg text-cream">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-cream-3">{f.body}</p>
            </HairlineCard>
          ))}
        </div>
        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-cream-wash/80">
          Conference support may include approved travel or ticket reimbursement against receipts,
          capped and reviewed case by case. Campus chapters sit inside the broader advocacy and
          builder-club circuit, the same grassroots energy behind Stand With Crypto and campus
          chapter operations elsewhere in the ecosystem, and can operate as the adults in the room
          for club-level logistics.
        </p>
      </section>

      <section className="hairline-t bg-surface/20">
        <div className="mx-auto max-w-3xl px-6 py-20 md:py-24">
          <Reveal stagger>
            <SectionLabel>Start a chapter</SectionLabel>
            <h2 className="mt-6 font-display text-3xl text-cream md:text-4xl">
              Tell us about your club.
            </h2>
          </Reveal>
          <div className="mt-8">
            <CampusInterestForm />
          </div>
        </div>
      </section>
    </div>
  )
}
