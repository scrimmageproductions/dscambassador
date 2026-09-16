import { createContext } from 'react'

export type AmbassadorSession = {
  name: string
}

export type AmbassadorSessionContextValue = {
  session: AmbassadorSession | null
  signIn: (name: string) => void
  signOut: () => void
  updateName: (name: string) => void
}

export const AmbassadorSessionContext = createContext<AmbassadorSessionContextValue | null>(null)
