import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getLocale, getTranslations } from "next-intl/server"

import { Link } from "@/i18n/navigation"
import { Container } from "@/components/shared/container"
import { WhatsappButton } from "@/components/shared/whatsapp-button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { getMinPrice } from "@/lib/pricing"
import { pageMetadata } from "@/lib/seo"
import { breadcrumbJsonLd, localizedUrl } from "@/lib/seo-urls"
import {
  USE_CASE_CONDITIONS,
  USE_CASE_PAGES,
  USE_CASE_PAGES_PUBLISHED,
  type UseCaseSlug,
} from "@/lib/use-case-content"

export async function getUseCaseMetadata(slug: UseCaseSlug): Promise<Metadata> {
  const page = USE_CASE_PAGES[slug]
  const metadata = await pageMetadata({
    path: page.route,
    title: { absolute: page.metaTitle },
    description: page.metaDescription,
    robots: USE_CASE_PAGES_PUBLISHED ? undefined : { index: false, follow: false },
  })

  // Brouillons français uniquement : pas de hreflang vers des traductions inexistantes.
  return USE_CASE_PAGES_PUBLISHED
    ? metadata
    : { ...metadata, alternates: { canonical: localizedUrl(page.route, "fr") } }
}

export async function UseCasePageTemplate({ slug }: { slug: UseCaseSlug }) {
  const locale = await getLocale()
  if (!USE_CASE_PAGES_PUBLISHED && locale !== "fr") notFound()

  const page = USE_CASE_PAGES[slug]
  const tSection = await getTranslations("product.sectionHeadings")
  const tNav = await getTranslations("nav")

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  }

  const breadcrumb = breadcrumbJsonLd([
    { name: tNav("accueil"), url: localizedUrl("", locale) },
    { name: page.label, url: localizedUrl(page.route, locale) },
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <section className="section-y pb-10">
        <Container className="mx-auto max-w-3xl text-center">
          <h1 className="text-balance text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">{page.h1}</h1>
          <p className="mt-4 text-balance leading-relaxed text-muted-foreground">{page.intro}</p>
          <p className="mt-3 text-xs text-muted-foreground">
            Automobile : à partir de {getMinPrice("automobiles")} €. Le tarif exact s’affiche dans le tarificateur.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" variant="cta" className="rounded-full">
              <Link href="/#tarificateur">{tSection("ctaEstimate")}</Link>
            </Button>
            <WhatsappButton />
          </div>
        </Container>
      </section>

      {page.sections.map((section) => (
        <section key={section.heading} className="pb-10">
          <Container className="mx-auto max-w-3xl">
            <h2 className="text-xl font-bold text-navy">{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mt-3 leading-relaxed text-muted-foreground">
                {paragraph}
              </p>
            ))}
            {section.items ? (
              <ul className="mt-3 list-disc space-y-1.5 ps-5 leading-relaxed text-muted-foreground">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </Container>
        </section>
      ))}

      <section className="pb-10">
        <Container className="mx-auto max-w-3xl">
          <h2 className="text-xl font-bold text-navy">{tSection("eligibilityHeading")}</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">{USE_CASE_CONDITIONS}</p>
        </Container>
      </section>

      <section className="section-y bg-surface">
        <Container className="mx-auto max-w-3xl">
          <h2 className="text-xl font-bold text-navy">{tSection("faqHeading")}</h2>
          <Accordion type="single" collapsible className="mt-6 flex flex-col gap-3">
            {page.faq.map((item, index) => (
              <AccordionItem
                key={item.question}
                value={`faq-${index}`}
                className="rounded-2xl border border-border bg-white px-5 shadow-sm"
              >
                <AccordionTrigger className="py-4 text-left text-sm font-semibold text-navy hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-sm leading-relaxed text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" variant="cta" className="rounded-full">
              <Link href="/#tarificateur">{tSection("ctaEstimate")}</Link>
            </Button>
            <WhatsappButton />
          </div>
        </Container>
      </section>

      <section className="section-y">
        <Container className="mx-auto max-w-3xl">
          <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">{tSection("seeAlso")}</h2>
          <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
            {page.related.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm font-semibold text-primary hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  )
}
