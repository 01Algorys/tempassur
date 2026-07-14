import Link from "next/link"
import { ArrowRight } from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { SectionHeading } from "@/components/shared/section-heading"
import { Reveal } from "@/components/shared/reveal"
import { HOME_FAQ } from "@/lib/constants"

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: HOME_FAQ.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
}

export function Faq() {
  return (
    <section id="faq" className="section-y bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <div className="mx-auto max-w-3xl container-px">
        <SectionHeading eyebrow="FAQ" title="Questions fréquentes" />

        <Reveal delay={0.1} className="mt-12">
          <Accordion type="single" collapsible defaultValue="home-faq-1" className="flex flex-col gap-3">
            {HOME_FAQ.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="rounded-2xl border border-border bg-white px-5 shadow-sm not-last:border-b data-[state=open]:border-primary/40"
              >
                <AccordionTrigger className="py-5 text-left text-base font-semibold text-navy hover:no-underline [&>svg]:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>

        <Reveal delay={0.15} className="mt-8 flex justify-center">
          <Link
            href="/faq"
            className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            Voir toutes les questions
            <ArrowRight className="size-3.5" />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
