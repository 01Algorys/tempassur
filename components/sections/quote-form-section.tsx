import { QuoteRequestForm } from "@/components/forms/quote-request-form"
import { Reveal } from "@/components/shared/reveal"

export function QuoteFormSection() {
  return (
    <section id="quote" className="section-y bg-surface">
      <div className="mx-auto max-w-6xl container-px">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-navy p-8 shadow-2xl shadow-primary/25 sm:p-12 lg:p-14">
            <div className="bg-grid pointer-events-none absolute inset-0 opacity-[0.06]" />
            <div className="pointer-events-none absolute -top-24 right-0 size-80 rounded-full bg-orange/20 blur-3xl" />

            <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
              <div className="flex flex-col gap-3 text-center lg:text-left">
                <h2 className="text-balance text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Get A Free Quote Now
                </h2>
                <p className="text-balance text-white/75">
                  Start your journey towards the ideal insurance coverage with our quick, simple
                  and hassle-free process.
                </p>
              </div>

              <QuoteRequestForm />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
