import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getLocale, getTranslations } from "next-intl/server"
import { Check } from "lucide-react"

import { Link } from "@/i18n/navigation"
import { Container } from "@/components/shared/container"
import { WhatsappButton } from "@/components/shared/whatsapp-button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { LANDING_PAGES, type LandingSlug, type LandingTable } from "@/lib/landing-content"
import { pageMetadata } from "@/lib/seo"
import { breadcrumbJsonLd, localizedUrl } from "@/lib/seo-urls"
import { siteConfig } from "@/lib/site"

// These pages exist in French only: canonical on the French URL, no hreflang to
// translations that don't exist.
export async function getLandingMetadata(slug: LandingSlug): Promise<Metadata> {
  const page = LANDING_PAGES[slug]
  const metadata = await pageMetadata({
    path: page.route,
    title: { absolute: page.metaTitle },
    description: page.metaDescription,
  })
  return { ...metadata, alternates: { canonical: localizedUrl(page.route, "fr") } }
}

function PriceTable({ table }: { table: LandingTable }) {
  return (
    <>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface text-navy">
            <tr>
              {table.columns.map((column, index) => (
                <th
                  key={column}
                  scope="col"
                  className={`px-3 py-3 align-bottom leading-snug font-semibold sm:px-4 ${index === 0 ? "text-start" : "text-end"}`}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {table.rows.map((row) => (
              <tr key={row[0]}>
                {row.map((cell, index) =>
                  index === 0 ? (
                    <th
                      key={index}
                      scope="row"
                      className={`px-3 py-2.5 text-start font-medium text-foreground/80 sm:px-4 ${table.compactFirstColumn ? "whitespace-nowrap" : ""}`}
                    >
                      {cell}
                    </th>
                  ) : (
                    <td
                      key={index}
                      className="px-3 py-2.5 text-end whitespace-nowrap text-foreground/80 tabular-nums sm:px-4"
                    >
                      {cell}
                    </td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {table.note ? <p className="mt-3 text-xs text-muted-foreground">{table.note}</p> : null}
    </>
  )
}

export async function LandingPageTemplate({ slug }: { slug: LandingSlug }) {
  const page = LANDING_PAGES[slug]
  const locale = await getLocale()
  // A non-French browser lands on /en/... after locale detection: send it back to the
  // French page (the /fr prefix makes the middleware switch the locale cookie to fr).
  if (locale !== "fr") redirect(`/fr${page.route}`)

  const tSection = await getTranslations("product.sectionHeadings")
  const tNav = await getTranslations("nav")
  const pageUrl = localizedUrl(page.route, "fr")
  const parent = page.related[0]

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  }

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: page.h1,
    serviceType: page.label,
    url: pageUrl,
    provider: { "@type": "InsuranceAgency", name: siteConfig.name, url: siteConfig.url },
    offers: {
      "@type": "Offer",
      url: pageUrl,
      priceSpecification: { "@type": "PriceSpecification", minPrice: page.offerPrice, priceCurrency: "EUR" },
    },
  }

  const breadcrumb = breadcrumbJsonLd([
    { name: tNav("accueil"), url: localizedUrl("", "fr") },
    { name: parent.label, url: localizedUrl(parent.href, "fr") },
    { name: page.label, url: pageUrl },
  ])

  const ctas = (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
      <Button asChild size="lg" variant="cta" className="rounded-full">
        <Link href={page.cta.href}>{page.cta.label}</Link>
      </Button>
      <WhatsappButton message={page.whatsappMessage} />
    </div>
  )

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <section className="section-y pb-10">
        <Container className="mx-auto max-w-3xl text-center">
          <h1 className="text-balance text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">{page.h1}</h1>
          <p className="mt-4 text-balance leading-relaxed text-muted-foreground">{page.intro}</p>
          <p className="mt-3 text-xs text-muted-foreground">{page.priceLine}</p>
          {ctas}
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
            {section.items?.length ? (
              <ul className="mt-4 flex flex-col gap-2">
                {section.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-foreground/80">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={3} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            {section.table ? <PriceTable table={section.table} /> : null}
            {section.links?.length ? (
              <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm font-semibold text-primary hover:underline">
                      {link.label} →
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </Container>
        </section>
      ))}

      <section className="pb-10">
        <Container className="mx-auto max-w-3xl">
          <h2 className="text-xl font-bold text-navy">{tSection("eligibilityHeading")}</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">{page.eligibility}</p>
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
          {ctas}
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
