import type { LucideIcon } from "lucide-react"

import { Container } from "@/components/shared/container"
import { Reveal } from "@/components/shared/reveal"

interface PageHeroProps {
  eyebrow?: string
  title: string
  description?: string
  icon?: LucideIcon
}

export function PageHero({ eyebrow, title, description, icon: Icon }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-navy pt-32 pb-16 sm:pt-36 sm:pb-20">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-[0.06]" />
      <div className="pointer-events-none absolute -top-24 right-0 size-80 rounded-full bg-orange/20 blur-3xl" />

      <Container className="relative flex flex-col items-center gap-4 text-center">
        {Icon ? (
          <Reveal>
            <span className="flex size-14 items-center justify-center rounded-2xl bg-white/10 text-orange-light">
              <Icon className="size-7" />
            </span>
          </Reveal>
        ) : null}
        {eyebrow ? (
          <Reveal delay={0.06}>
            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-orange-light uppercase">
              {eyebrow}
            </span>
          </Reveal>
        ) : null}
        <Reveal delay={0.12}>
          <h1 className="text-balance text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {title}
          </h1>
        </Reveal>
        {description ? (
          <Reveal delay={0.18}>
            <p className="max-w-2xl text-balance text-white/70 sm:text-lg">{description}</p>
          </Reveal>
        ) : null}
      </Container>
    </section>
  )
}
