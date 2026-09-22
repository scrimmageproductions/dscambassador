import { PageHero } from '../components/ui/PageHero'
import { SectionLabel } from '../components/ui/SectionLabel'
import { HairlineCard } from '../components/ui/HairlineCard'
import { LinkButton } from '../components/ui/Button'
import { CardTapDemo } from '../components/interactive/CardTapDemo'
import { BurnerVideoEmbed } from '../components/interactive/BurnerVideoEmbed'
import { ExternalImage } from '../components/ui/ExternalImage'
import { Reveal } from '../components/motion/Reveal'
import { TiltCard } from '../components/motion/TiltCard'
import { ParallaxImage } from '../components/motion/ParallaxImage'

const drops = [
  {
    src: 'https://www.spenders.club/cdn/shop/files/Digital_Spenders_Club_7-23_bitcoin_jacket_1.png',
    label: 'BTC Varsity Jacket',
    note: 'Heavyweight varsity, the kind of piece that reads across a conference floor.',
  },
  {
    src: 'https://www.spenders.club/cdn/shop/files/Digital_Spenders_Club_7-23_Real_Jacket_1_78e08668-3abe-490a-a9fa-04dc3a4854ca.png',
    label: 'DSC x Barriers "Real" Bomber',
    note: 'A collaboration drop, limited by nature.',
  },
  {
    src: 'https://www.spenders.club/cdn/shop/files/Bag_1x1_f42b5c50-65b3-424f-ba87-ce6788295c892.png',
    label: 'Abundance Bundle',
    note: 'The full kit, for members who want more than the ambassador core piece.',
  },
]

const columns = [
  {
    label: 'Wearables',
    title: 'One core piece, issued from your form.',
    body: 'From the clothing size and region on the Ambassador Program form, DSC issues a complimentary shirt, sweater, or sweatshirt to wear during events and meetups. Other kit items may be included with a given drop, not guaranteed beyond the core piece.',
  },
  {
    label: 'Tools',
    title: 'What you use to move IRL.',
    body: 'Event materials (flyers, banners, extra membership cards) request through the Assets channel in the private Telegram group after approval. DSC Membership Cards come as an allotment to give out as you see fit, only to people who will actually push the movement forward. Be mindful.',
  },
  {
    label: 'Comms',
    title: 'Where the program actually happens.',
    body: 'The private Ambassador Program Telegram Group is HQ after approval, a global ambassador network. A monthly SYNC call covers growth, opportunities, and friction. A Discord role unlocks the private Ambassador voice channel where calls live.',
  },
]

export function Kit() {
  return (
    <div>
      <PageHero
        eyebrow="The Kit"
        title="The official uniform of the movement."
        lede="Premium wearables and official Digital Spenders Club membership cards issued upon approval to those moving our culture forward."
      />

      <section className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <div className="grid gap-px overflow-hidden rounded-2xl hairline bg-cream/10 md:grid-cols-3">
          {columns.map((c, i) => (
            <Reveal key={c.label} as="div" className="h-full" delay={i * 0.1} amount={0.2}>
              <div className="h-full bg-ink p-8">
                <p className="label-mono text-[0.68rem] text-gold">{c.label}</p>
                <h3 className="mt-4 font-display text-xl text-cream">{c.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-cream-3">{c.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="hairline-t hairline-b bg-surface/20">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <div className="mb-10">
            <BurnerVideoEmbed />
          </div>
          <Reveal stagger>
            <h2 className="max-w-xl font-display text-3xl text-cream md:text-4xl">
              The DSC Membership Card.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-cream-3">
              The physical DSC Membership Card is the primary key to Burner, the club&rsquo;s
              member-exclusive app. Every member, ambassador or not, taps their card to their
              phone to get in. There&rsquo;s no separate login, no password to lose. The card
              is the key.
            </p>
          </Reveal>
          <div className="mt-10">
            <CardTapDemo />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <Reveal>
          <SectionLabel>Membership object</SectionLabel>
        </Reveal>
        <div className="mt-8 grid items-center gap-10 md:grid-cols-2">
          <Reveal>
            <TiltCard maxTilt={10} className="hairline overflow-hidden rounded-2xl bg-surface/40">
              <ParallaxImage
                src="/spendersclubcard.jpeg"
                alt="Digital Spenders Club membership card"
                loading="lazy"
                className="aspect-square w-full rounded-2xl object-cover"
              />
            </TiltCard>
          </Reveal>
          <Reveal delay={0.1}>
            <h3 className="font-display text-2xl text-cream">Make the connection count.</h3>
            <p className="mt-3 text-sm leading-relaxed text-cream-3">
              Every ambassador carries an allotment of physical DSC Membership Cards to distribute
              at their discretion. As the initial physical face of the club, you&rsquo;re often
              the first person a new member ever interacts with, and the card in your hand is
              their primary key into Burner, the member-exclusive app. Walking someone through
              that first tap, phone to card, is what makes their onboarding seamless, and doing
              that well, ambassador by ambassador, is essential to how the club actually grows
              worldwide.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="hairline-t mx-auto max-w-6xl px-6 py-20 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Reveal stagger>
            <h2 className="max-w-xl font-display text-3xl text-cream md:text-4xl">
              What the club actually wears.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-cream-3">
              The complimentary piece above is the guaranteed core. The rest of the line, drops
              like these, lives at the shop.
            </p>
          </Reveal>
          <LinkButton to="https://www.spenders.club/collections/all" variant="ghost">
            Shop the collection
          </LinkButton>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {drops.map((d, i) => (
            <Reveal key={d.label} delay={i * 0.1} amount={0.2}>
              <div className="hairline overflow-hidden rounded-2xl bg-surface/40">
                <ExternalImage
                  src={d.src}
                  alt={d.label}
                  fallbackLabel={d.label}
                  className="aspect-square w-full bg-ink object-cover"
                />
                <div className="p-5">
                  <h3 className="font-display text-lg text-cream">{d.label}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-cream-3">{d.note}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="hairline-t">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center md:py-28">
          <HairlineCard className="text-left md:text-center">
            <p className="label-mono text-[0.68rem] text-cream-wash">Assets, post-approval</p>
            <p className="mt-3 text-sm leading-relaxed text-cream-3 md:mx-auto md:max-w-md">
              Extra event assets (flyers, banners, more membership cards) are requested directly
              in the Telegram Assets channel once you&rsquo;re approved.
            </p>
          </HairlineCard>
          <div className="mt-8">
            <LinkButton to="/apply" variant="solid">
              Apply for the kit
            </LinkButton>
          </div>
        </div>
      </section>
    </div>
  )
}
