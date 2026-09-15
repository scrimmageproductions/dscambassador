import { PageHero } from '../components/ui/PageHero'
import { SectionLabel } from '../components/ui/SectionLabel'
import { HairlineCard } from '../components/ui/HairlineCard'
import { LinkButton } from '../components/ui/Button'
import { SWCHeatMap } from '../components/interactive/SWCHeatMap'
import { EventMaterialsRequest } from '../components/interactive/EventMaterialsRequest'
import { CardTapDemo } from '../components/interactive/CardTapDemo'
import { CultureMedia } from '../components/ui/CultureMedia'
import { EventFeed } from '../components/interactive/EventFeed'
import { Link } from 'react-router-dom'

export function Events() {
  return (
    <div>
      <PageHero
        eyebrow="Events"
        title="One IRL activation, every quarter."
        lede="Ambassadors represent DSC at major conferences and local crypto events — building a presence, not running a booth at every stop."
      />

      <section className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <div className="grid gap-5 sm:grid-cols-3">
          <HairlineCard>
            <p className="label-mono text-[0.68rem] text-gold">Circuit</p>
            <h3 className="mt-4 font-display text-xl text-cream">Ecosystem events</h3>
            <p className="mt-2 text-sm leading-relaxed text-cream-3">
              Priority coverage of major conferences, side-events, and grassroots meetups.
              Ambassadors represent the brand, onboard members, and network with founders,
              builders, and newcomers across the globe.
            </p>
          </HairlineCard>
          <HairlineCard>
            <p className="label-mono text-[0.68rem] text-gold">Builders</p>
            <h3 className="mt-4 font-display text-xl text-cream">Hackathons</h3>
            <p className="mt-2 text-sm leading-relaxed text-cream-3">
              Position DSC as the default kit for builders — showing up where the next cycle of
              product people actually spend their weekends.
            </p>
          </HairlineCard>
          <HairlineCard>
            <p className="label-mono text-[0.68rem] text-gold">Campus</p>
            <h3 className="mt-4 font-display text-xl text-cream">University clubs</h3>
            <p className="mt-2 text-sm leading-relaxed text-cream-3">
              College blockchain clubs are a high-value expansion surface — see the{' '}
              <Link to="/campus" className="underline decoration-cream/40 underline-offset-4 hover:text-cream">
                Campus
              </Link>{' '}
              page for how chapters work.
            </p>
          </HairlineCard>
        </div>
      </section>

      <section className="hairline-t bg-surface/20">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <SectionLabel>The circuit feed</SectionLabel>
          <h2 className="mt-6 max-w-xl font-display text-3xl text-cream md:text-4xl">
            What&rsquo;s next, by category.
          </h2>
          <div className="mt-10">
            <EventFeed />
          </div>
        </div>
      </section>

      <section className="hairline-t">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-20 md:grid-cols-2 md:py-24">
          <div>
            <SectionLabel>IRL motion</SectionLabel>
            <h2 className="mt-6 max-w-md font-display text-3xl text-cream md:text-4xl">
              This is what an activation looks like.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-cream-3">
              A folding table, a rack of kit, and people who showed up. No side-event vendor
              energy — just the club, in a room, moving.
            </p>
          </div>
          <CultureMedia />
        </div>
      </section>

      <section className="hairline-t hairline-b bg-surface/20">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <SectionLabel>Where ambassadors show up</SectionLabel>
          <h2 className="mt-6 max-w-xl font-display text-3xl text-cream md:text-4xl">
            The circuit, mapped.
          </h2>
          <div className="mt-10">
            <SWCHeatMap />
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
        <SectionLabel>Onboard with the card</SectionLabel>
        <h2 className="mt-6 max-w-xl font-display text-3xl text-cream md:text-4xl">
          Every activation ends in a tap.
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-cream-3">
          Hand someone a DSC Membership Card at a conference, meetup, or club night, and their
          first tap to their own phone is what opens Burner and makes them a member. No
          separate sign-up flow — the card is the onboarding.
        </p>
        <div className="mt-10">
          <CardTapDemo />
        </div>
      </section>

      <section className="hairline-t bg-surface/20">
        <div className="mx-auto max-w-3xl px-6 py-20 md:py-24">
          <SectionLabel>Materials</SectionLabel>
          <h2 className="mt-6 font-display text-3xl text-cream md:text-4xl">
            Requesting event assets.
          </h2>
          <div className="mt-8">
            <EventMaterialsRequest />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20 text-center md:py-28">
        <h2 className="font-display text-3xl text-cream md:text-4xl">
          Have an event on the calendar?
        </h2>
        <div className="mt-8">
          <LinkButton to="/apply" variant="solid">
            Apply and list it
          </LinkButton>
        </div>
      </section>
    </div>
  )
}
