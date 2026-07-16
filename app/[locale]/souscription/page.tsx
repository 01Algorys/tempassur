import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import { Link } from "@/i18n/navigation"
import { Container } from "@/components/shared/container"
import { SubscriptionWizard } from "@/components/forms/subscription/subscription-wizard"
import { COVERED_COUNTRY_CODES } from "@/lib/covered-countries"
import { siteConfig } from "@/lib/site"
import { VEHICLE_SLUGS } from "@/types"
import type { VehicleSlug } from "@/types"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.souscription")
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: `${siteConfig.url}/souscription` },
  }
}

interface SouscriptionPageProps {
  searchParams: Promise<{ categorie?: string; duree?: string }>
}

function isVehicleSlug(value: string | undefined): value is VehicleSlug {
  return !!value && (VEHICLE_SLUGS as readonly string[]).includes(value)
}

export default async function SouscriptionPage({ searchParams }: SouscriptionPageProps) {
  const { categorie, duree } = await searchParams
  const initialCategory = isVehicleSlug(categorie) ? categorie : "automobiles"
  const initialDuree = duree ? Number(duree) : undefined
  const t = await getTranslations("pages.souscription")

  return (
    <section className="section-y">
      <Container>
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h1 className="text-balance text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t("description")}</p>
        </div>

        <SubscriptionWizard initialCategory={initialCategory} initialDuree={initialDuree} />

        <div className="mx-auto mt-16 max-w-3xl border-t border-border pt-10 text-sm leading-relaxed text-muted-foreground">
          <h2 className="text-lg font-bold text-navy">{t("guaranteesHeading")}</h2>
          <p className="mt-3">{t("guaranteesParagraph")}</p>
          <p className="mt-3">{t("coverageParagraph", { count: COVERED_COUNTRY_CODES.length })}</p>
          <p className="mt-3">{t("coverageVariationNotice")}</p>
          <Link href="/pays-couverts" className="mt-2 inline-block font-semibold text-primary hover:underline">
            {t("coveredCountriesCta")}
          </Link>
        </div>
      </Container>
    </section>
  )
}
