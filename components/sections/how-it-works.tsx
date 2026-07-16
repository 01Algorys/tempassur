import { useTranslations } from "next-intl"

import { SectionHeading } from "@/components/shared/section-heading"
import { Stagger, StaggerItem } from "@/components/shared/reveal"

export function HowItWorks() {
  const t = useTranslations("home.howItWorks")
  const steps = t.raw("steps") as { title: string; description: string }[]

  return (
    <section className="section-y bg-surface">
      <div className="mx-auto max-w-5xl container-px">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />

        <Stagger className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {steps.map((step, index) => (
            <StaggerItem key={step.title} className="h-full">
              <div className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-white p-6 text-center shadow-sm">
                <span className="mx-auto flex size-10 items-center justify-center rounded-full bg-orange text-sm font-extrabold text-white">
                  {index + 1}
                </span>
                <h3 className="text-base font-bold text-navy">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
