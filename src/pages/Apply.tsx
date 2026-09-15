import { PageHero } from '../components/ui/PageHero'
import { ApplyWizard } from '../components/apply/ApplyWizard'

export function Apply() {
  return (
    <div>
      <PageHero
        eyebrow="Apply"
        title="Four steps. Straight answers."
        lede="Identity, presence, fit, and the guidelines agreement. Your draft saves on this device as you go."
      />
      <section className="mx-auto max-w-3xl px-6 py-16 md:py-20">
        <ApplyWizard />
      </section>
    </div>
  )
}
