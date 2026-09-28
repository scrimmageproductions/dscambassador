import { useState, type FormEvent } from 'react'
import { Button } from '../../ui/Button'
import { useAmbassadorSession } from '../../../context/useAmbassadorSession'

export function SettingsView() {
  const { session, updateName } = useAmbassadorSession()
  const [name, setName] = useState(session?.name ?? '')
  const [region, setRegion] = useState('United States')
  const [social, setSocial] = useState('')
  const [coAmbassador, setCoAmbassador] = useState('')
  const [telegramLink, setTelegramLink] = useState('')
  const [saved, setSaved] = useState(false)
  const dualNode = coAmbassador.trim().length > 0

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    updateName(name)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <form onSubmit={handleSubmit} className="hairline max-w-xl glass-card p-6 md:p-8">
      <div>
        <label htmlFor="settings-name" className="label-mono text-[0.68rem] text-cream-wash">
          Display name
        </label>
        <input
          id="settings-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="hairline mt-2 w-full bg-ink px-4 py-3 text-sm text-cream focus-visible:outline-cream"
        />
      </div>
      <div className="mt-5">
        <label htmlFor="settings-region" className="label-mono text-[0.68rem] text-cream-wash">
          Region
        </label>
        <select
          id="settings-region"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="hairline mt-2 w-full bg-ink px-4 py-3 text-sm text-cream focus-visible:outline-cream"
        >
          {['United States', 'Canada', 'United Kingdom', 'European Union', 'Rest of world'].map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-5">
        <label htmlFor="settings-social" className="label-mono text-[0.68rem] text-cream-wash">
          Primary social handle
        </label>
        <input
          id="settings-social"
          value={social}
          onChange={(e) => setSocial(e.target.value)}
          placeholder="@yourhandle"
          className="hairline mt-2 w-full bg-ink px-4 py-3 text-sm text-cream placeholder:text-cream-wash/40 focus-visible:outline-cream"
        />
      </div>
      <div className="mt-8 hairline-t pt-6">
        <p className="label-mono text-[0.68rem] text-cream-wash">Regional node</p>

        <div className="mt-5">
          <label htmlFor="settings-co-ambassador" className="label-mono text-[0.68rem] text-cream-wash">
            Co-Ambassador (secondary node)
          </label>
          <p className="mt-1.5 text-xs leading-relaxed text-cream-wash/60">
            To ensure regional continuity, assign a secondary club member in your region who can
            receive backup shipments or manage inventory if you are offline.
          </p>
          <input
            id="settings-co-ambassador"
            value={coAmbassador}
            onChange={(e) => setCoAmbassador(e.target.value)}
            placeholder="Name or handle"
            className="hairline mt-2 w-full bg-ink px-4 py-3 text-sm text-cream placeholder:text-cream-wash/40 focus-visible:outline-cream"
          />
          <p className={`label-mono mt-2 text-[0.62rem] ${dualNode ? 'text-cream' : 'text-gold'}`}>
            {dualNode ? '[ Dual node active ]' : '[ Single node - add backup ]'}
          </p>
        </div>

        <div className="mt-5">
          <label htmlFor="settings-telegram" className="label-mono text-[0.68rem] text-cream-wash">
            Local Telegram / comms link
          </label>
          <p className="mt-1.5 text-xs leading-relaxed text-cream-wash/60">
            Link your regional Telegram or private chat group so HQ can verify local member
            onboarding and coordinate regional pivots.
          </p>
          <input
            id="settings-telegram"
            type="url"
            value={telegramLink}
            onChange={(e) => setTelegramLink(e.target.value)}
            placeholder="https://t.me/your-region"
            className="hairline mt-2 w-full bg-ink px-4 py-3 text-sm text-cream placeholder:text-cream-wash/40 focus-visible:outline-cream"
          />
        </div>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <Button type="submit" variant="solid">
          Save changes
        </Button>
        {saved ? <p className="label-mono text-[0.65rem] text-gold">Saved ✓</p> : null}
      </div>
    </form>
  )
}
