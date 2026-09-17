import { useState, type FormEvent } from 'react'
import { Button } from '../../ui/Button'
import { useAmbassadorSession } from '../../../context/useAmbassadorSession'

export function SettingsView() {
  const { session, updateName } = useAmbassadorSession()
  const [name, setName] = useState(session?.name ?? '')
  const [region, setRegion] = useState('United States')
  const [social, setSocial] = useState('')
  const [saved, setSaved] = useState(false)

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
      <div className="mt-6 flex items-center gap-4">
        <Button type="submit" variant="solid">
          Save changes
        </Button>
        {saved ? <p className="label-mono text-[0.65rem] text-gold">Saved ✓</p> : null}
      </div>
    </form>
  )
}
