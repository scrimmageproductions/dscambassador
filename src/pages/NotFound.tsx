import { LinkButton } from '../components/ui/Button'

export function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-32 text-center">
      <p className="label-mono text-[0.7rem] text-cream-wash">404</p>
      <h1 className="mt-4 font-display text-4xl text-cream md:text-5xl">Page not found.</h1>
      <p className="mt-4 text-cream-3">Even members lose the thread sometimes.</p>
      <div className="mt-8">
        <LinkButton to="/" variant="solid">
          Back home
        </LinkButton>
      </div>
    </div>
  )
}
