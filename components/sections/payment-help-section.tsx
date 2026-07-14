import { Reveal } from "@/components/shared/reveal"
import { PaymentHelp } from "@/components/shared/payment-help"

export function PaymentHelpSection() {
  return (
    <section className="section-y bg-surface">
      <div className="mx-auto max-w-2xl container-px">
        <Reveal className="rounded-2xl border border-border bg-white p-6 text-center shadow-sm sm:p-8">
          <PaymentHelp variant="home" className="flex flex-col items-center [&>div]:justify-center" />
        </Reveal>
      </div>
    </section>
  )
}
