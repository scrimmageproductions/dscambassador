import { lazy, Suspense, useState } from 'react'
import { PageHero } from '../components/ui/PageHero'
import { SectionLabel } from '../components/ui/SectionLabel'
import { HairlineCard } from '../components/ui/HairlineCard'
import { LinkButton } from '../components/ui/Button'
import { EventMaterialsRequest } from '../components/interactive/EventMaterialsRequest'
import { CardTapDemo } from '../components/interactive/CardTapDemo'
import { CultureMedia } from '../components/ui/CultureMedia'
import { EventFeed } from '../components/interactive/EventFeed'
import type { EventSource } from '../data/events'
import { Reveal } from '../components/motion/Reveal'

const CircuitMap = lazy(() =>
  import('../components/interactive/CircuitMap').then((m) => ({ default: m.CircuitMap })),
)

export function Events() {
  const [activeFilter, setActiveFilter] = useState<EventSource | 'All'>('All')
  const [highlightIds, setHighlightIds] = useState<string[]>([])

  function handleFilterChange(value: EventSource | 'All') {
    setActiveFilter(value)
    setHighlightIds([])
  }

  return (
    <div>
      <PageHero
        eyebrow="Events"
        title="Presence on the ground."
        lede="Ambassadors anchor the movement at major conferences, key side-events, and local gatherings worldwide."
      />

      <section className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <div className="grid gap-5 sm:grid-cols-3">
          <HairlineCard delay={0}>
            <p className="label-mono text-[0.68rem] text-gold">Circuit</p>
            <h3 className="mt-4 font-display text-xl text-cream">Ecosystem events</h3>
            <p className="mt-2 text-sm leading-relaxed text-cream-3">
              Global conference circuits, side-events, and local meetups. Wear the kit, onboard
              new members, and connect directly with the ecosystem.
            </p>
          </HairlineCard>
          <HairlineCard delay={0.1}>
            <p className="label-mono text-[0.68rem] text-gold">Builders</p>
            <h3 className="mt-4 font-display text-xl text-cream">Hackathons</h3>
            <p className="mt-2 text-sm leading-relaxed text-cream-3">
              Representing the club where the next wave is being built. Outfitting founders and
              developers on the frontlines.
            </p>
          </HairlineCard>
          <HairlineCard delay={0.2}>
            <p className="label-mono text-[0.68rem] text-gold">Campus</p>
            <h3 className="mt-4 font-display text-xl text-cream">University clubs</h3>
            <p className="mt-2 text-sm leading-relaxed text-cream-3">
              Custom campus activations and university blockchain partnerships. Bringing DSC
              culture directly to student networks.
            </p>
          </HairlineCard>
        </div>
      </section>

      <section className="hairline-t bg-surface/20">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <Reveal stagger>
            <SectionLabel>The circuit feed</SectionLabel>
            <h2 className="mt-6 max-w-xl font-display text-3xl text-cream md:text-4xl">
              What&rsquo;s next, by category.
            </h2>
          </Reveal>
          <div className="mt-10">
            <EventFeed
              active={activeFilter}
              onActiveChange={handleFilterChange}
              highlightIds={highlightIds}
            />
          </div>
        </div>
      </section>

      <section className="hairline-t">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-20 md:grid-cols-2 md:py-24">
          <Reveal stagger>
            <SectionLabel>IRL motion</SectionLabel>
            <h2 className="mt-6 max-w-md font-display text-3xl text-cream md:text-4xl">
              This is what an activation looks like.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-cream-3">
              A folding table, a rack of kit, and people who showed up. No side-event vendor
              energy, just the club, in a room, moving.
            </p>
          </Reveal>
          <CultureMedia
            src="/dsceventgif.gif"
            alt="Digital Spenders Club IRL activation"
            aspectClassName="aspect-[3/2]"
          />
        </div>
      </section>

      <section className="hairline-t hairline-b bg-surface/20">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <Reveal stagger>
            <SectionLabel>Where ambassadors show up</SectionLabel>
            <h2 className="mt-6 max-w-xl font-display text-3xl text-cream md:text-4xl">
              The circuit, mapped.
            </h2>
          </Reveal>
          <div className="mt-10">
            <Suspense
              fallback={
                <div className="hairline flex aspect-[2/1] items-center justify-center bg-surface/40">
                  <p className="label-mono text-[0.65rem] text-cream-wash">Loading map…</p>
                </div>
              }
            >
              <CircuitMap active={activeFilter} onSelectEvents={setHighlightIds} />
            </Suspense>
          </div>
          <p className="mt-6 text-sm leading-relaxed text-cream-3">
            For the full, weekly-updated calendar of Web3 events, ambassadors track{' '}
            <a
              href="https://sheeets.xyz"
              target="_blank"
              rel="noreferrer"
              className="text-cream underline decoration-cream/40 underline-offset-4 hover:decoration-cream"
            >
              sheeets.xyz
            </a>
            , the ecosystem calendar.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <Reveal stagger>
          <SectionLabel>Onboard with the card</SectionLabel>
          <h2 className="mt-6 max-w-xl font-display text-3xl text-cream md:text-4xl">
            Every activation ends in a tap.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-cream-3">
            Hand someone a DSC Membership Card at a conference, meetup, or club night, and their
            first tap to their own phone is what opens Burner and makes them a member. No
            separate sign-up flow. The card is the onboarding.
          </p>
        </Reveal>
        <div className="mt-10">
          <CardTapDemo />
        </div>
      </section>

      <section className="hairline-t bg-surface/20">
        <div className="mx-auto max-w-3xl px-6 py-20 md:py-24">
          <Reveal stagger>
            <SectionLabel>Materials</SectionLabel>
            <h2 className="mt-6 font-display text-3xl text-cream md:text-4xl">
              Requesting event assets.
            </h2>
          </Reveal>
          <div className="mt-8">
            <EventMaterialsRequest />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20 text-center md:py-28">
        <Reveal stagger>
          <h2 className="font-display text-3xl text-cream md:text-4xl">
            Have an event on the calendar?
          </h2>
          <div className="mt-8">
            <LinkButton to="/apply" variant="solid">
              Apply and list it
            </LinkButton>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
