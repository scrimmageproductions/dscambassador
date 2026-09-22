import type { ReactNode } from 'react'
import { SectionLabel } from './SectionLabel'
import { Reveal } from '../motion/Reveal'
import { TextDecode } from '../motion/TextDecode'

export function PageHero({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string
  title: string
  lede?: ReactNode
  children?: ReactNode
}) {
  return (
    <header className="hairline-b bg-noise">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <Reveal stagger>
          <SectionLabel>{eyebrow}</SectionLabel>
          <h1 className="mt-6 max-w-3xl text-4xl leading-[1.05] text-cream md:text-6xl">
            <TextDecode>{title}</TextDecode>
          </h1>
          {lede ? (
            <p className="mt-6 max-w-xl text-base leading-relaxed text-cream-3 md:text-lg">
              {lede}
            </p>
          ) : null}
          {children}
        </Reveal>
      </div>
    </header>
  )
}
