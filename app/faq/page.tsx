import type { Metadata } from "next"

import { Container } from "@/components/shared/container"
import { PageHero } from "@/components/layout/page-hero"
import { TelLink } from "@/components/shared/tel-link"
import { WhatsappButton } from "@/components/shared/whatsapp-button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { FAQ_CATEGORIES } from "@/lib/faq-content"
import { siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: "Questions fréquentes",
  description:
    "Toutes les réponses sur la souscription, les prix, la couverture, les documents et l'annulation de votre assurance temporaire TempAssur.",
  alternates: { canonical: `${siteConfig.url}/faq` },
}

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_CATEGORIES.flatMap((category) =>
    category.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    }))
  ),
}

export default function FaqPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <PageHero eyebrow="FAQ" title="Questions fréquentes" />
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

          <div className="flex flex-col items-center gap-3 text-center">
            <p className="text-sm text-muted-foreground">
              Une autre question ?{" "}
              <TelLink phone={siteConfig.phone} className="font-semibold text-primary hover:underline">
                {siteConfig.phone}
              </TelLink>{" "}
              (7j/7) ou{" "}
              <a href={`mailto:${siteConfig.email}`} className="font-semibold text-primary hover:underline">
                {siteConfig.email}
              </a>
              .
            </p>
            <WhatsappButton />
          </div>
        </Container>
      </section>
    </>
  )
}
