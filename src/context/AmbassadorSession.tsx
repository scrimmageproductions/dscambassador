import { useState, type ReactNode } from 'react'
import { AmbassadorSessionContext, type AmbassadorSession } from './AmbassadorSessionContext'

const STORAGE_KEY = 'dsc-ambassador-demo-session'
const DEFAULT_NAME = 'Ambassador'

function readStoredSession(): AmbassadorSession | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (typeof parsed?.name === 'string') return { name: parsed.name }
    return null
  } catch {
    return null
  }
}

/**
 * Client-only demo session for the HQ dashboard preview — there is no real
 * backend, so this just persists a name in localStorage on this device so
 * the demo state survives a refresh. Never treat this as real auth.
 */
export function AmbassadorSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AmbassadorSession | null>(() => readStoredSession())

  function signIn(name: string) {
    const clean = name.trim() || DEFAULT_NAME
    const next = { name: clean }
    setSession(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // localStorage unavailable (private mode, etc.) — session still works for this render
    }
  }

  function signOut() {
    setSession(null)
    try {
      window.localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
  }

  return (
    <AmbassadorSessionContext.Provider value={{ session, signIn, signOut, updateName: signIn }}>
      {children}
    </AmbassadorSessionContext.Provider>
  )
}
