import type { Metadata } from "next"

import { Container } from "@/components/shared/container"
import { PageHero } from "@/components/layout/page-hero"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { FAQ_CATEGORIES } from "@/lib/faq-content"
import { siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: "FAQ — Assurance temporaire auto",
  description: `Toutes les réponses sur l'assurance auto temporaire ${siteConfig.name} : pays couverts, éligibilité, documents requis, véhicules de location et assurance frontière.`,
}

export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Questions fréquentes"
        description="Toutes les réponses sur l'assurance auto temporaire, l'assurance frontière, les pays couverts et les conditions de souscription."
      />
      <section className="section-y">
        <Container className="mx-auto flex max-w-3xl flex-col gap-14">
          {FAQ_CATEGORIES.map((category) => (
            <div key={category.id} className="flex flex-col gap-6">
              <h2 className="text-balance text-xl font-extrabold tracking-tight text-navy sm:text-2xl">
                {category.title}
              </h2>
              <Accordion type="single" collapsible className="flex flex-col gap-3">
                {category.items.map((item) => (
                  <AccordionItem
                    key={item.id}
                    value={item.id}
                    className="rounded-2xl border border-border bg-white px-5 shadow-sm not-last:border-b data-[state=open]:border-primary/40"
                  >
                    <AccordionTrigger className="py-5 text-left text-base font-semibold text-navy hover:no-underline [&>svg]:text-primary">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </Container>
      </section>
    </>
  )
}
