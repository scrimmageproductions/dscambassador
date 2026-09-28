import { useState } from 'react'
import { useAmbassadorSession } from '../context/useAmbassadorSession'
import { AdminDashboard } from '../components/admin/AdminDashboard'
import { SignInModal } from '../components/hq/SignInModal'
import { Button, LinkButton } from '../components/ui/Button'

export function Admin() {
  const { session } = useAmbassadorSession()
  const [modalOpen, setModalOpen] = useState(false)

  if (session?.isAdmin) {
    return <AdminDashboard />
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 py-24 text-center">
      <p className="label-mono text-[0.65rem] text-gold">[ Access denied // registry restricted ]</p>
      <h1 className="mt-4 font-display text-3xl text-cream md:text-4xl">Admin registry access required.</h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-cream-3">
        This surface is restricted to HQ administrators. Sign in with an admin demo account to
        preview the panel, or head back to Ambassador HQ.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Button variant="solid" onClick={() => setModalOpen(true)}>
          Sign in
        </Button>
        <LinkButton to="/hq" variant="ghost">
          Back to HQ
        </LinkButton>
      </div>
      <SignInModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
