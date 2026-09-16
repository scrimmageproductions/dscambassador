import { useEffect, useState } from 'react'
import { type ApplicationDraft, emptyDraft, DRAFT_KEY } from './types'

function loadDraft(): ApplicationDraft {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (!raw) return emptyDraft
    return { ...emptyDraft, ...JSON.parse(raw) }
  } catch {
    return emptyDraft
  }
}

export function useDraft() {
  const [draft, setDraft] = useState<ApplicationDraft>(loadDraft)

  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
    } catch {
      // localStorage unavailable, draft simply won't persist across refresh
    }
  }, [draft])

  function update<K extends keyof ApplicationDraft>(key: K, value: ApplicationDraft[K]) {
    setDraft((d) => ({ ...d, [key]: value }))
  }

  function clear() {
    try {
      localStorage.removeItem(DRAFT_KEY)
    } catch {
      // ignore
    }
    setDraft(emptyDraft)
  }

  return { draft, update, clear }
}
