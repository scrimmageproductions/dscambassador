import { useContext } from 'react'
import { AmbassadorSessionContext } from './AmbassadorSessionContext'

export function useAmbassadorSession() {
  const ctx = useContext(AmbassadorSessionContext)
  if (!ctx) throw new Error('useAmbassadorSession must be used within AmbassadorSessionProvider')
  return ctx
}
