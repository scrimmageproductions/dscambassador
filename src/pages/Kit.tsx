import { PageHero } from '../components/ui/PageHero'
import { SectionLabel } from '../components/ui/SectionLabel'
import { HairlineCard } from '../components/ui/HairlineCard'
import { LinkButton } from '../components/ui/Button'
import { KitConfigurator } from '../components/interactive/KitConfigurator'
import { MembershipCardIllustration } from '../components/illustrations/Garments'

const columns = [
  {
    label: 'Wearables',
    title: 'One core piece, issued from your form.',
    body: 'From the clothing size and region on the Ambassador Program form, DSC issues a complimentary shirt, sweater, or sweatshirt to wear during events and meetups. Other kit items may be included with a given drop — not guaranteed beyond the core piece.',
  },
  {
    label: 'Tools',
    title: 'What you use to move IRL.',
    body: 'Event materials — flyers, banners, extra membership cards — request through the Assets channel in the private Telegram group after approval. DSC Membership Cards come as an allotment to give out as you see fit, only to people who will actually push the movement forward. Be mindful.',
  },
  {
    label: 'Comms',
    title: 'Where the program actually happens.',
    body: 'The private Ambassador Program Telegram Group is HQ after approval — a global ambassador network. A monthly SYNC call covers growth, opportunities, and friction. A Discord role unlocks the private Ambassador voice channel where calls live.',
  },
]

export function Kit() {
  return (
    <div>
      <PageHero
        eyebrow="The Kit"
        title="What every ambassador carries."
        lede="Wearables for events, membership cards for onboarding, and a private line into the club. Nothing here is a gimmick — every piece has a job."
      />

      <section className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <div className="grid gap-px overflow-hidden hairline bg-cream/10 md:grid-cols-3">
          {columns.map((c) => (
            <div key={c.label} className="bg-ink p-8">
              <p className="label-mono text-[0.68rem] text-gold">{c.label}</p>
              <h3 className="mt-4 font-display text-xl text-cream">{c.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-cream-3">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="hairline-t hairline-b bg-surface/20">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <SectionLabel>Featured object</SectionLabel>
          <h2 className="mt-6 max-w-xl font-display text-3xl text-cream md:text-4xl">
            The DSC Membership Card.
          </h2>
          <div className="mt-10 grid items-center gap-10 md:grid-cols-2">
            <MembershipCardIllustration className="w-full" />
            <div>
              <h3 className="font-display text-2xl text-cream">A card that means something.</h3>
              <p className="mt-3 text-sm leading-relaxed text-cream-3">
                Every ambassador holds an allotment of DSC Membership Cards to give out at their
                own discretion — only to people who will actually push the movement forward. This
                is the IRL onboarding tool: hand one to someone at a conference, meetup, or club
                night, and they&rsquo;re in. Black and cream, numbered, unmistakably not a loyalty
                punch card.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="hairline-t bg-surface/20">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <SectionLabel>Configure yours</SectionLabel>
          <h2 className="mt-6 max-w-xl font-display text-3xl text-cream md:text-4xl">
            Preview your complimentary piece.
          </h2>
          <div className="mt-10">
            <KitConfigurator />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20 text-center md:py-28">
        <HairlineCard className="text-left md:text-center">
          <p className="label-mono text-[0.68rem] text-cream-wash">Assets, post-approval</p>
          <p className="mt-3 text-sm leading-relaxed text-cream-3 md:mx-auto md:max-w-md">
            Extra event assets — flyers, banners, more membership cards — are requested directly
            in the Telegram Assets channel once you&rsquo;re approved.
          </p>
        </HairlineCard>
        <div className="mt-8">
          <LinkButton to="/apply" variant="solid">
            Apply for the kit
          </LinkButton>
        </div>
      </section>
    </div>
  )
}
