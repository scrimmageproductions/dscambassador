import { useContext } from 'react'
import { HQStoreContext } from './HQStoreContext'

export function useHQStore() {
  const ctx = useContext(HQStoreContext)
  if (!ctx) throw new Error('useHQStore must be used within HQStoreProvider')
  return ctx
}
