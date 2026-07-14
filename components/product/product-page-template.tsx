import Link from "next/link"
import { Check } from "lucide-react"

import { Container } from "@/components/shared/container"
import { WhatsappButton } from "@/components/shared/whatsapp-button"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { PRODUCT_ROUTES, VEHICLE_TYPES } from "@/lib/constants"
import type { ProductContent } from "@/lib/product-content"
import { fillPricePlaceholders, getAvailableDurations, getMinPrice } from "@/lib/pricing"
import { whatsappQuoteMessage } from "@/lib/site"
import type { VehicleSlug } from "@/types"

const currency = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 })

interface ProductPageTemplateProps {
  slug: VehicleSlug
  content: ProductContent
}

export function ProductPageTemplate({ slug, content }: ProductPageTemplateProps) {
  const vehicle = VEHICLE_TYPES.find((v) => v.slug === slug)!
  const price = getMinPrice(slug)
  const durations = getAvailableDurations(slug, { duree: null, isDomTom: false })

  const faq = content.faq.map((item) => ({ ...item, answer: fillPricePlaceholders(item.answer, slug) }))

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  }

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: content.h1,
    provider: { "@type": "InsuranceAgency", name: "TempAssur" },
    offers: {
      "@type": "Offer",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price,
        priceCurrency: "EUR",
        unitText: "DAY",
      },
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />

      <section className="section-y pb-10">
        <Container className="mx-auto max-w-3xl text-center">
          <h1 className="text-balance text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">{content.h1}</h1>
          <p className="mt-4 text-balance leading-relaxed text-muted-foreground">{content.intro}</p>
        </Container>
      </section>

      <section className="pb-10">
        <Container className="mx-auto max-w-2xl">
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-surface p-6 text-center sm:p-8">
            <p className="text-2xl font-extrabold tracking-tight text-navy">
              À partir de {currency.format(price)}/jour
            </p>
            <p className="text-xs text-muted-foreground">
              Durées disponibles : {durations.join(", ")} jour{durations.length > 1 ? "s" : ""}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" variant="cta" className="rounded-full">
                <Link href={`/souscription?categorie=${slug}`}>Estimer mon tarif</Link>
              </Button>
              <WhatsappButton message={whatsappQuoteMessage(vehicle.label, durations[0] ?? 1)} />
            </div>
          </div>
        </Container>
      </section>

      {content.vehiclesParagraph ? (
        <section className="pb-10">
          <Container className="mx-auto max-w-3xl">
            <h2 className="text-xl font-bold text-navy">
              {slug === "assurance-frontiere" ? "À qui s'adresse l'assurance frontière ?" : "Quels véhicules ?"}
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">{content.vehiclesParagraph}</p>
          </Container>
        </section>
      ) : null}

      <section className="pb-10">
        <Container className="mx-auto max-w-3xl">
          <h2 className="text-xl font-bold text-navy">Vos garanties</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">{content.guaranteesIncluded}</p>
          {content.options ? (
            <ul className="mt-4 flex flex-col gap-2">
              {content.options.map((option) => (
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
          <h2 className="text-xl font-bold text-navy">Où êtes-vous couvert ?</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">{content.whereCovered}</p>
          <Link href="/pays-couverts" className="mt-2 inline-block text-sm font-semibold text-primary hover:underline">
            Voir la liste complète des pays couverts →
          </Link>
        </Container>
      </section>

      {content.useCases.length > 0 ? (
        <section className="pb-10">
          <Container className="mx-auto max-w-3xl">
            <h2 className="text-xl font-bold text-navy">Dans quelles situations ?</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">{content.useCases.join(" · ")}</p>
          </Container>
        </section>
      ) : null}

      <section className="pb-10">
        <Container className="mx-auto max-w-3xl">
          <h2 className="text-xl font-bold text-navy">Qui peut souscrire ?</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">{content.eligibility}</p>
        </Container>
      </section>

      <section className="section-y bg-surface">
        <Container className="mx-auto max-w-3xl">
          <h2 className="text-xl font-bold text-navy">Questions fréquentes</h2>
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
              <Link href={`/souscription?categorie=${slug}`}>Estimer mon tarif en 30 secondes</Link>
            </Button>
            <WhatsappButton message={whatsappQuoteMessage(vehicle.label, durations[0] ?? 1)} />
          </div>
        </Container>
      </section>

      <section className="section-y">
        <Container className="mx-auto max-w-3xl">
          <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Voir aussi</h2>
          <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
            {content.relatedProducts.map((relatedSlug) => {
              const related = VEHICLE_TYPES.find((v) => v.slug === relatedSlug)!
              return (
                <li key={relatedSlug}>
                  <Link href={PRODUCT_ROUTES[relatedSlug]} className="text-sm font-semibold text-primary hover:underline">
                    {related.label}
                  </Link>
                </li>
              )
            })}
            <li>
              <Link href="/pays-couverts" className="text-sm font-semibold text-primary hover:underline">
                Pays couverts
              </Link>
            </li>
          </ul>
        </Container>
      </section>
    </>
  )
}
