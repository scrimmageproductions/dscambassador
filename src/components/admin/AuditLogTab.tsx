import { useHQStore } from '../../context/useHQStore'

/** A short, deterministic reference tag per entry -- not real cryptography, just a stable id for the log's terminal-style look. */
function shortRef(id: string) {
  let hash = 0
  for (const ch of id) hash = (hash * 31 + ch.charCodeAt(0)) % 0xffffff
  return hash.toString(16).toUpperCase().padStart(6, '0')
}

export function AuditLogTab() {
  const { auditLog } = useHQStore()

  if (auditLog.length === 0) {
    return (
      <div className="border border-white/10 bg-[#0A0A0A] p-8 text-center">
        <p className="label-mono text-[0.62rem] text-white/40">[ No activity recorded this session ]</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-white/10 border border-white/10 bg-[#0A0A0A]">
      {auditLog.map((entry) => (
        <div key={entry.id} className="p-4">
          <p className="label-mono text-[0.62rem] text-white/60">
            &gt; {new Date(entry.timestamp).toISOString()} &middot; ref_{shortRef(entry.id)}
          </p>
          <p className="mt-1 text-sm text-[#E8E4D9]">{entry.action}</p>
        </div>
      ))}
    </div>
  )
}
