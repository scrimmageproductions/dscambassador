import { PageHero } from '../components/ui/PageHero'
import { SectionLabel } from '../components/ui/SectionLabel'
import { HairlineCard } from '../components/ui/HairlineCard'
import { LinkButton } from '../components/ui/Button'
import { SWCHeatMap } from '../components/interactive/SWCHeatMap'
import { EventMaterialsRequest } from '../components/interactive/EventMaterialsRequest'
import { MembershipCardIllustration } from '../components/illustrations/Garments'
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
            <p className="label-mono text-[0.68rem] text-gold">Grassroots</p>
            <h3 className="mt-4 font-display text-xl text-cream">Stand With Crypto circuit</h3>
            <p className="mt-2 text-sm leading-relaxed text-cream-3">
              Priority coverage of SWC events across the United States. Ambassadors join local
              gatherings, represent the brand, and network with legislators, founders, and
              newcomers.
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
          Every activation ends with a card in someone&rsquo;s hand.
        </h2>
        <div className="mt-10 grid items-center gap-10 md:grid-cols-2">
          <div>
            <p className="text-sm leading-relaxed text-cream-3">
              This is the exact moment ambassadors create at events — a conversation, a DSC
              Membership Card, a new member. Give one to someone who will actually push the
              movement forward, and point them to{' '}
              <a
                href="https://spenders.club"
                target="_blank"
                rel="noreferrer"
                className="text-cream underline decoration-cream/40 underline-offset-4 hover:decoration-cream"
              >
                spenders.club
              </a>{' '}
              to follow the motion.
            </p>
          </div>
          <MembershipCardIllustration className="w-full" />
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
