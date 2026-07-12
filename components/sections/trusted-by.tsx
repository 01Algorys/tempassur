import { Reveal } from "@/components/shared/reveal"
import { PARTNER_NAMES } from "@/lib/constants"

export function TrustedBy() {
  return (
    <section className="border-b border-border bg-white py-10">
      <div className="mx-auto max-w-7xl container-px">
        <Reveal>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {PARTNER_NAMES.map((name) => (
              <span key={name} className="text-sm font-semibold tracking-wide text-muted-foreground/70">
                {name}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
