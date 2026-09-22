import { lazy, Suspense, useState } from 'react'
import { PageHero } from '../components/ui/PageHero'
import { HairlineCard } from '../components/ui/HairlineCard'
import { Button, LinkButton } from '../components/ui/Button'
import { SyncAgendaAccordion } from '../components/interactive/SyncAgendaAccordion'
import { ReferralCounterPreview } from '../components/interactive/ReferralCounterPreview'
import { Reveal } from '../components/motion/Reveal'
import { useAmbassadorSession } from '../context/useAmbassadorSession'
import { SignInModal } from '../components/hq/SignInModal'

const AmbassadorDashboard = lazy(() =>
  import('../components/hq/AmbassadorDashboard').then((m) => ({ default: m.AmbassadorDashboard })),
)

export function HQ() {
  const { session, signOut } = useAmbassadorSession()
  const [modalOpen, setModalOpen] = useState(false)

  if (session) {
    return (
      <Suspense
        fallback={
          <div className="mx-auto flex max-w-7xl items-center justify-center px-6 py-32">
            <p className="label-mono text-[0.65rem] text-cream-wash">Loading HQ…</p>
          </div>
        }
      >
        <AmbassadorDashboard name={session.name} onSignOut={signOut} />
      </Suspense>
    )
  }

  return (
    <div>
      <PageHero
        eyebrow="Ambassador HQ"
        title="A preview of what opens after approval."
        lede="This is a look, not a login. Sign in with a demo account below to try the full ambassador dashboard, or apply to get the real thing."
      >
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button variant="solid" onClick={() => setModalOpen(true)}>
            Sign in to HQ
          </Button>
          <p className="label-mono text-[0.65rem] text-gold">Access granted after approval</p>
        </div>
      </PageHero>

      <section className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <div className="grid gap-5 sm:grid-cols-3">
          <HairlineCard className="h-full" delay={0}>
            <p className="label-mono text-[0.68rem] text-gold">Telegram</p>
            <h3 className="mt-4 font-display text-xl text-cream">The Ambassador Program group</h3>
            <p className="mt-2 text-sm leading-relaxed text-cream-3">
              A private, global network of ambassadors. This is where Assets requests, program
              announcements, and day-to-day coordination happen.
            </p>
          </HairlineCard>
          <HairlineCard className="h-full" delay={0.1}>
            <p className="label-mono text-[0.68rem] text-gold">Monthly</p>
            <h3 className="mt-4 font-display text-xl text-cream">The SYNC call</h3>
            <p className="mt-2 text-sm leading-relaxed text-cream-3">
              Growth, event opportunities, friction, suggestions, and program updates. Additional
              calls as needed. Attendance is expected.
            </p>
          </HairlineCard>
          <HairlineCard className="h-full" delay={0.2}>
            <p className="label-mono text-[0.68rem] text-gold">Discord</p>
            <h3 className="mt-4 font-display text-xl text-cream">Ambassador voice channel</h3>
            <p className="mt-2 text-sm leading-relaxed text-cream-3">
              After approval, a Discord role unlocks the private Ambassador voice channel. Calls
              live there.
            </p>
          </HairlineCard>
        </div>
      </section>

      <section className="hairline-t hairline-b bg-surface/20">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <Reveal stagger>
            <h2 className="max-w-xl font-display text-3xl text-cream md:text-4xl">
              What actually gets discussed.
            </h2>
          </Reveal>
          <div className="mt-10">
            <SyncAgendaAccordion />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <Reveal stagger>
          <h2 className="max-w-xl font-display text-3xl text-cream md:text-4xl">
            Tracking, once you&rsquo;re in.
          </h2>
        </Reveal>
        <div className="mt-10">
          <ReferralCounterPreview />
        </div>
        <div className="mt-6">
          <Button variant="ghost" onClick={() => setModalOpen(true)}>
            Try the full dashboard
          </Button>
        </div>
      </section>

      <section className="hairline-t bg-ink">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center md:py-28">
          <Reveal stagger>
            <p className="font-display text-3xl text-cream md:text-4xl">Not in yet?</p>
            <p className="mt-3 text-cream-3">The application takes about five minutes.</p>
            <div className="mt-8 flex justify-center">
              <LinkButton to="/apply" variant="solid">
                Apply
              </LinkButton>
            </div>
          </Reveal>
        </div>
      </section>

      <SignInModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
