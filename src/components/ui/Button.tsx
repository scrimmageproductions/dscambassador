import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Variant = 'solid' | 'ghost' | 'text'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 label-mono text-[0.72rem] transition-all duration-300 ease-out hover:scale-[1.035] active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100'

const variants: Record<Variant, string> = {
  solid: 'bg-cream text-ink hover:bg-cream-2 shadow-[0_0_0_0_rgba(243,237,227,0)] hover:shadow-[0_0_28px_-6px_rgba(243,237,227,0.4)]',
  ghost: 'btn-metallic text-cream hover:bg-cream/[0.05]',
  text: 'rounded-none text-cream underline underline-offset-4 decoration-cream/40 hover:decoration-cream px-0 py-0 hover:scale-100 active:scale-100',
}

type CommonProps = { variant?: Variant; children: ReactNode; className?: string }

export function Button({
  variant = 'solid',
  children,
  className = '',
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  )
}

export function LinkButton({
  variant = 'solid',
  children,
  className = '',
  to,
  ...rest
}: CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) {
  const isExternal = /^https?:\/\//.test(to)
  if (isExternal) {
    return (
      <a
        href={to}
        className={`${base} ${variants[variant]} ${className}`}
        target="_blank"
        rel="noreferrer"
        {...rest}
      >
        {children}
      </a>
    )
  }
  return (
    <Link to={to} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  )
}
