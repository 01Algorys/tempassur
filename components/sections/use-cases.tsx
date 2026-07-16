import { useTranslations } from "next-intl"

import { SectionHeading } from "@/components/shared/section-heading"
import { Stagger, StaggerItem } from "@/components/shared/reveal"

export function UseCases() {
  const t = useTranslations("home.useCases")
  const items = t.raw("items") as string[]

  return (
    <section className="section-y bg-white">
      <div className="mx-auto max-w-7xl container-px">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />

        <Stagger className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {items.map((useCase) => (
            <StaggerItem key={useCase} className="h-full">
              <div className="flex h-full items-center rounded-2xl border border-border bg-surface p-5 text-sm font-medium text-foreground/80">
                {useCase}
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
