import { useEffect, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function Modal({
  open,
  onClose,
  children,
  labelledBy,
}: {
  open: boolean
  onClose: () => void
  children: ReactNode
  labelledBy: string
}) {
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKey)
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-10">
          <motion.div
            className="absolute inset-0 bg-ink/80 backdrop-blur-sm"
            aria-hidden="true"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            className="hairline glass-card relative z-10 max-h-[85vh] w-full max-w-lg shadow-[0_0_60px_-12px_rgba(0,0,0,0.8)]"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="max-h-[85vh] overflow-y-auto p-6 md:p-8">{children}</div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  )
}
