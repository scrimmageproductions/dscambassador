import { createContext } from 'react'

export type AmbassadorSession = {
  name: string
  isAdmin: boolean
}

export type AmbassadorSessionContextValue = {
  session: AmbassadorSession | null
  signIn: (name: string, isAdmin?: boolean) => void
  signOut: () => void
  updateName: (name: string) => void
}

export const AmbassadorSessionContext = createContext<AmbassadorSessionContextValue | null>(null)
