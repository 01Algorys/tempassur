import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

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
import { siteConfig } from "@/lib/site"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("faq.meta")
  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: `${siteConfig.url}/faq` },
  }
}

interface FaqItem {
  id: string
  question: string
  answer: string
}

interface FaqCategory {
  id: string
  title: string
  items: FaqItem[]
}

export default async function FaqPage() {
  const t = await getTranslations("faq")
  const categories = t.raw("categories") as FaqCategory[]

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: categories.flatMap((category) =>
      category.items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      }))
    ),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <PageHero eyebrow={t("eyebrow")} title={t("heading")} />
      <section className="section-y">
        <Container className="mx-auto flex max-w-3xl flex-col gap-14">
          {categories.map((category) => (
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
              {t.rich("otherQuestion", {
                phoneValue: siteConfig.phone,
                emailValue: siteConfig.email,
                phone: (chunks) => (
                  <TelLink phone={siteConfig.phone} className="font-semibold text-primary hover:underline">
                    {chunks}
                  </TelLink>
                ),
                email: (chunks) => (
                  <a href={`mailto:${siteConfig.email}`} className="font-semibold text-primary hover:underline">
                    {chunks}
                  </a>
                ),
              })}
            </p>
            <WhatsappButton />
          </div>
        </Container>
      </section>
    </>
  )
}
