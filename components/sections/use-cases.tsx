import { SectionHeading } from "@/components/shared/section-heading"
import { Stagger, StaggerItem } from "@/components/shared/reveal"
import { USE_CASES } from "@/lib/constants"

export function UseCases() {
  return (
    <section className="section-y bg-white">
      <div className="mx-auto max-w-7xl container-px">
        <SectionHeading eyebrow="Cas d'usage" title="Dans quelles situations ?" />

        <Stagger className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {USE_CASES.map((useCase) => (
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
