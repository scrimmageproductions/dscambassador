import { useState } from 'react'
import { navGroups, type DashboardViewKey } from '../../data/dashboard'

export function DashboardSidebar({
  active,
  onSelect,
}: {
  active: DashboardViewKey
  onSelect: (key: DashboardViewKey) => void
}) {
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set())

  function toggleGroup(label: string) {
    setCollapsedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(label)) next.delete(label)
      else next.add(label)
      return next
    })
  }

  return (
    <nav className="hairline glass-card p-4 md:p-5" aria-label="Ambassador HQ sections">
      {navGroups.map((group) => {
        const collapsed = collapsedGroups.has(group.label)
        return (
          <div key={group.label} className="mb-2 last:mb-0">
            <button
              type="button"
              onClick={() => toggleGroup(group.label)}
              aria-expanded={!collapsed}
              className="label-mono flex w-full items-center justify-between px-2 py-2 text-[0.62rem] text-cream-wash/70 transition-colors hover:text-cream-wash"
            >
              {group.label}
              <span className={`transition-transform duration-200 ${collapsed ? '-rotate-90' : ''}`} aria-hidden="true">
                ▾
              </span>
            </button>
            {!collapsed ? (
              <ul className="mt-1 space-y-0.5">
                {group.items.map((item) => (
                  <li key={item.key}>
                    <button
                      type="button"
                      onClick={() => onSelect(item.key)}
                      aria-current={active === item.key ? 'page' : undefined}
                      className={`w-full rounded px-3 py-2 text-left text-sm transition-colors ${
                        active === item.key ? 'bg-cream text-ink' : 'text-cream hover:bg-cream/[0.06]'
                      }`}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        )
      })}
    </nav>
  )
}
