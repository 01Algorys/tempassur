import { Link } from "@/i18n/navigation"
import { Check } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { Container } from "@/components/shared/container"
import { WhatsappButton } from "@/components/shared/whatsapp-button"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { SubscriptionWizard } from "@/components/forms/subscription/subscription-wizard"
import { PRODUCT_ROUTES, VEHICLE_TYPES } from "@/lib/constants"
import { BLOG_ARTICLES } from "@/lib/blog-content"
import { PRODUCT_RELATIONS } from "@/lib/product-content"
import { breadcrumbJsonLd, localizedUrl } from "@/lib/seo-urls"
import { siteConfig } from "@/lib/site"
import { fillPricePlaceholders, getAvailableDurations, getMinPrice, getMinPricePerDay } from "@/lib/pricing"
import { whatsappQuoteMessage } from "@/lib/site"
import type { VehicleSlug } from "@/types"

const SOUSCRIPTION_ANCHOR = "souscrire"
const GUARANTEES_ANCHOR = "garanties"

interface ProductFaqItem {
  question: string
  answer: string
}

interface ProductGuaranteeOption {
  label: string
  description: string
}

interface ProductPageTemplateProps {
  slug: VehicleSlug
}

export function ProductPageTemplate({ slug }: ProductPageTemplateProps) {
  const t = useTranslations("product")
  const tSection = useTranslations("product.sectionHeadings")
  const tVehicles = useTranslations("vehicleTypes")
  const tNav = useTranslations("nav")
  const tArticles = useTranslations("blog.articles")
  const locale = useLocale()
  const currency = new Intl.NumberFormat(locale, { style: "currency", currency: "EUR", maximumFractionDigits: 0 })

  const vehicle = VEHICLE_TYPES.find((v) => v.slug === slug)!
  const vehicleLabel = tVehicles(`${vehicle.slug}.label`)
  const price = getMinPrice(slug)
  const pricePerDay = getMinPricePerDay(slug)
  const durations = getAvailableDurations(slug, { duree: null, isDomTom: false })

  const h1 = t(`${slug}.h1`)
  const intro = t(`${slug}.intro`)
  const guaranteesIncluded = t(`${slug}.guaranteesIncluded`)
  const whereCovered = t(`${slug}.whereCovered`)
  const eligibility = t(`${slug}.eligibility`)
  const vehiclesParagraph = t.has(`${slug}.vehiclesParagraph`) ? t(`${slug}.vehiclesParagraph`) : null
  const options = t.has(`${slug}.options`) ? (t.raw(`${slug}.options`) as ProductGuaranteeOption[]) : null
  const useCases = t.raw(`${slug}.useCases`) as string[]
  const faq = (t.raw(`${slug}.faq`) as ProductFaqItem[]).map((item) => ({
    ...item,
    answer: fillPricePlaceholders(item.answer, slug),
  }))
  const relatedProducts = PRODUCT_RELATIONS[slug]
  const relatedArticles = BLOG_ARTICLES.filter((article) => article.relatedProducts.includes(slug))
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 3)
  const coveredCountriesHref = slug === "assurance-frontiere" ? "/pays-couverts-frontiere" : "/pays-couverts"

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  }

  const pageUrl = localizedUrl(PRODUCT_ROUTES[slug], locale)

  // `price` is the cheapest contract of the category, not a daily rate: the frontière
  // product starts at a 30-day contract.
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: h1,
    serviceType: h1,
    url: pageUrl,
    provider: { "@type": "InsuranceAgency", name: "TempAssur", url: siteConfig.url },
    offers: {
      "@type": "Offer",
      url: pageUrl,
      priceSpecification: {
        "@type": "PriceSpecification",
        minPrice: price,
        priceCurrency: "EUR",
      },
    },
  }

  const breadcrumb = breadcrumbJsonLd([
    { name: tNav("accueil"), url: localizedUrl("", locale) },
    { name: vehicleLabel, url: pageUrl },
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <section className="section-y pb-10">
        <Container className="mx-auto max-w-3xl text-center">
          <h1 className="text-balance text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">{h1}</h1>
          <p className="mt-4 text-balance leading-relaxed text-muted-foreground">{intro}</p>
          <p className="mt-3 text-xs text-muted-foreground">
            {tSection("priceFrom", { price: currency.format(pricePerDay) })} ·{" "}
            {tSection("durationsAvailable", { durations: durations.join(", "), count: durations.length })}
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-sm font-semibold text-primary">
            <Link href={`#${GUARANTEES_ANCHOR}`} className="hover:underline">
              {tSection("guaranteesHeading")}
            </Link>
            <Link href={coveredCountriesHref} className="hover:underline">
              {tSection("coveredCountriesLink")}
            </Link>
          </div>
        </Container>
      </section>

      <section id={SOUSCRIPTION_ANCHOR} className="scroll-mt-24 pb-10">
        <Container>
          <SubscriptionWizard initialCategory={slug} />
        </Container>
      </section>

      {vehiclesParagraph ? (
        <section className="pb-10">
          <Container className="mx-auto max-w-3xl">
            <h2 className="text-xl font-bold text-navy">
              {slug === "assurance-frontiere" ? tSection("borderVehiclesHeading") : tSection("vehiclesHeading")}
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">{vehiclesParagraph}</p>
          </Container>
        </section>
      ) : null}

      <section id={GUARANTEES_ANCHOR} className="scroll-mt-24 pb-10">
        <Container className="mx-auto max-w-3xl">
          <h2 className="text-xl font-bold text-navy">{tSection("guaranteesHeading")}</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">{guaranteesIncluded}</p>
          {options ? (
            <ul className="mt-4 flex flex-col gap-2">
              {options.map((option) => (
                <li key={option.label} className="flex items-start gap-2 text-sm text-foreground/80">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={3} />
                  <span>
                    <strong className="font-semibold text-navy">{option.label}</strong>
                    {option.description ? ` — ${option.description}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </Container>
      </section>

      <section className="pb-10">
        <Container className="mx-auto max-w-3xl">
          <h2 className="text-xl font-bold text-navy">{tSection("whereCoveredHeading")}</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">{whereCovered}</p>
          <Link href={coveredCountriesHref} className="mt-2 inline-block text-sm font-semibold text-primary hover:underline">
            {tSection("coveredCountriesCta")}
          </Link>
        </Container>
      </section>

      {useCases.length > 0 ? (
        <section className="pb-10">
          <Container className="mx-auto max-w-3xl">
            <h2 className="text-xl font-bold text-navy">{tSection("useCasesHeading")}</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">{useCases.join(" · ")}</p>
          </Container>
        </section>
      ) : null}

      <section className="pb-10">
        <Container className="mx-auto max-w-3xl">
          <h2 className="text-xl font-bold text-navy">{tSection("eligibilityHeading")}</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">{eligibility}</p>
        </Container>
      </section>

      <section className="section-y bg-surface">
        <Container className="mx-auto max-w-3xl">
          <h2 className="text-xl font-bold text-navy">{tSection("faqHeading")}</h2>
          <Accordion type="single" collapsible className="mt-6 flex flex-col gap-3">
            {faq.map((item, index) => (
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
              <Link href={`#${SOUSCRIPTION_ANCHOR}`}>{tSection("ctaEstimate")}</Link>
            </Button>
            <WhatsappButton message={whatsappQuoteMessage(vehicleLabel, durations[0] ?? 1)} />
          </div>
        </Container>
      </section>

      <section className="section-y">
        <Container className="mx-auto max-w-3xl">
          <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">{tSection("seeAlso")}</h2>
          <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
            {relatedProducts.map((relatedSlug) => (
              <li key={relatedSlug}>
                <Link href={PRODUCT_ROUTES[relatedSlug]} className="text-sm font-semibold text-primary hover:underline">
                  {tVehicles(`${relatedSlug}.label`)}
                </Link>
              </li>
            ))}
            <li>
              <Link href={coveredCountriesHref} className="text-sm font-semibold text-primary hover:underline">
                {tSection("coveredCountriesLink")}
              </Link>
            </li>
            {relatedArticles.map((article) => (
              <li key={article.slug}>
                <Link href={`/blog/${article.slug}`} className="text-sm font-semibold text-primary hover:underline">
                  {tArticles(`${article.slug}.title`)}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  )
}
