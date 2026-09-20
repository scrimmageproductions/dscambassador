import { LinkButton } from '../components/ui/Button'
import { Tagline } from '../components/ui/Tagline'
import { SectionLabel } from '../components/ui/SectionLabel'
import { HairlineCard } from '../components/ui/HairlineCard'
import { CommitmentStrip } from '../components/interactive/CommitmentStrip'
import { EligibilityChecker } from '../components/interactive/EligibilityChecker'
import { CultureMedia } from '../components/ui/CultureMedia'
import { MatrixTransition } from '../components/ui/MatrixTransition'
import { Reveal } from '../components/motion/Reveal'
import { ParallaxImage } from '../components/motion/ParallaxImage'
import { Link } from 'react-router-dom'

const tiles = [
  {
    to: '/program',
    label: 'Program',
    title: 'What ambassadors do',
    body: 'Content, IRL activations, and member onboarding: the criteria, the pace, the rules.',
  },
  {
    to: '/kit',
    label: 'Kit',
    title: 'What you carry',
    body: 'Wearables and the membership cards ambassadors hand out to bring new people into the club.',
  },
  {
    to: '/campus',
    label: 'Campus',
    title: 'The next wave',
    body: 'College blockchain clubs, chapter cards, and a merch kickback for the ones who build it.',
  },
]

export function Home() {
  return (
    <div>
      <section className="relative z-10 flex min-h-[80vh] flex-col items-center justify-center overflow-hidden bg-noise">
        <div
          className="glow-gold pointer-events-none absolute left-1/2 top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2"
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto w-full max-w-4xl px-6 py-24 text-center">
          <Reveal stagger>
            <SectionLabel className="justify-center">Digital Spenders Club</SectionLabel>
            <h1 className="mx-auto mt-8 max-w-3xl font-display text-5xl font-extrabold leading-[1.02] tracking-tight text-cream sm:text-6xl md:text-8xl">
              Ambassador Program
            </h1>
            <div className="mt-8">
              <Tagline className="text-sm md:text-base" />
            </div>
            <p className="mx-auto mt-8 max-w-lg text-base leading-relaxed text-cream-3 md:text-lg">
              The people committed to moving us forward, expanding our membership, and proud to
              represent the best culture in the blockchain ecosystem.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <LinkButton to="/apply" variant="solid">
                Apply
              </LinkButton>
              <LinkButton to="/guidelines" variant="ghost">
                Read the guidelines
              </LinkButton>
            </div>
          </Reveal>
        </div>
      </section>

      <MatrixTransition />

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-20 md:py-24">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <CultureMedia className="md:order-2" />
          <Reveal stagger className="md:order-1">
            <SectionLabel>IRL motion</SectionLabel>
            <h2 className="mt-6 max-w-md font-display text-3xl text-cream md:text-4xl">
              Real people. Real presence.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-cream-3">
              Pop-ups, drops, and ecosystem activations. We don&rsquo;t just talk about the
              movement. We show up.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="hairline-t">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
          <Reveal>
            <SectionLabel>Three ways in</SectionLabel>
          </Reveal>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {tiles.map((t, i) => (
              <Link key={t.to} to={t.to} className="block">
                <HairlineCard className="h-full" delay={i * 0.1}>
                  <p className="label-mono text-[0.68rem] text-gold">{t.label}</p>
                  <h3 className="mt-4 font-display text-2xl text-cream">{t.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-cream-3">{t.body}</p>
                  <span className="label-mono mt-6 inline-block text-[0.65rem] text-cream-wash underline underline-offset-4">
                    Read more
                  </span>
                </HairlineCard>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="hairline-t">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-20 md:grid-cols-2 md:py-24">
          <Reveal stagger>
            <SectionLabel>The shop</SectionLabel>
            <h2 className="mt-6 max-w-md font-display text-3xl text-cream md:text-4xl">
              The kit is one piece of a much bigger line.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-cream-3">
              Varsity jackets, collab bombers, full bundles: the club&rsquo;s actual shop floor.
              See what ambassadors are already wearing before you apply.
            </p>
            <div className="mt-6">
              <LinkButton to="https://www.spenders.club/collections/all" variant="ghost">
                Shop spenders.club
              </LinkButton>
            </div>
          </Reveal>
          <div className="hairline aspect-square w-full overflow-hidden rounded-2xl bg-surface/40">
            <ParallaxImage
              src="/apparelgif.gif"
              alt="Digital Spenders Club apparel"
              loading="lazy"
              className="h-full w-full object-contain"
            />
          </div>
        </div>
      </section>

      <section className="hairline-t hairline-b bg-surface/30">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <Reveal>
            <SectionLabel>The minimum commitment</SectionLabel>
          </Reveal>
          <div className="mt-8">
            <CommitmentStrip />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-20 md:py-28">
        <Reveal stagger>
          <SectionLabel>Check yourself</SectionLabel>
          <h2 className="mt-6 font-display text-3xl text-cream md:text-4xl">
            See where you stand before you apply.
          </h2>
        </Reveal>
        <div className="mt-8">
          <EligibilityChecker />
        </div>
      </section>

      <section className="hairline-t bg-ink">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center md:py-28">
          <Reveal>
            <p className="font-display text-3xl text-cream md:text-4xl">Questions?</p>
            <p className="mt-3 text-lg text-cream-3">
              DM{' '}
              <a
                href="https://twitter.com/YoungScrimmage"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-cream/40 underline-offset-4 hover:text-cream"
              >
                @YoungScrimmage
              </a>
              .
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
