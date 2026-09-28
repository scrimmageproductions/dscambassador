import { useHQStore } from '../../context/useHQStore'

/** Demo-only network rows shown alongside the live session's own node. */
const MOCK_NODES = [
  { region: 'Austin, TX', primary: 'Priya Nandan', co: '—', batch: 100, activations: 54 },
  { region: 'San Francisco, CA', primary: 'Marcus Webb', co: 'Elena Cho', batch: 200, activations: 160 },
  { region: 'Denver, CO', primary: 'Sofia Reyes', co: '—', batch: 120, activations: 70 },
]

const COLUMNS = ['Region', 'Primary ambassador', 'Co-ambassador', 'Card inventory', 'Activation rate']

export function RegionalNodeMatrixTab() {
  const { region, primaryAmbassadorName, coAmbassador, cardInventory } = useHQStore()

  const liveRow = {
    region,
    primary: primaryAmbassadorName,
    co: coAmbassador || '—',
    batch: cardInventory.batchSize,
    activations: cardInventory.activations,
    isLive: true,
  }

  const rows = [liveRow, ...MOCK_NODES.map((n) => ({ ...n, isLive: false }))]

  return (
    <div className="overflow-x-auto border border-white/10 bg-[#0A0A0A]">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-white/10">
            {COLUMNS.map((h) => (
              <th key={h} className="label-mono px-5 py-4 text-[0.6rem] text-white/50">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {rows.map((r) => (
            <tr key={r.region} className={r.isLive ? 'bg-white/[0.02]' : ''}>
              <td className="px-5 py-4 text-[#E8E4D9]">
                {r.region}
                {r.isLive ? <span className="label-mono ml-2 text-[0.55rem] text-gold">this session</span> : null}
              </td>
              <td className="px-5 py-4 text-cream-2">{r.primary}</td>
              <td className="px-5 py-4 text-cream-2">{r.co}</td>
              <td className="px-5 py-4 text-cream-2">
                {r.activations} / {r.batch}
              </td>
              <td className="px-5 py-4 text-cream-2">{((r.activations / r.batch) * 100).toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
