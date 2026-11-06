import type { Metadata } from "next"
import type { ReactNode } from "react"
import { getTranslations } from "next-intl/server"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"

import {
  CountryGrid,
  CountryInlineList,
  CoverageCallout,
  CoverageList,
  CoverageNote,
  CoverageSection,
  CoverageText,
  coverageRichTags,
} from "@/components/coverage/coverage-ui"
import { Container } from "@/components/shared/container"
import { VehicleVignettes } from "@/components/sections/vehicle-vignettes"
import { WhatsappButton } from "@/components/shared/whatsapp-button"
import { Button } from "@/components/ui/button"
import { PRODUCT_ROUTES } from "@/lib/constants"
import { EU_COUNTRY_CODES, EXCLUDED_COUNTRIES, NON_EU_COVERED_COUNTRY_CODES } from "@/lib/covered-countries"
import { pageMetadata } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.paysCouvertsFrontiere")
  return pageMetadata({
    path: "/pays-couverts-frontiere",
    title: { absolute: t("metaTitle") },
    description: t("metaDescription"),
  })
}

const VEHICLE_REGIONS = ["vehiclesMaghreb", "vehiclesBalkans", "vehiclesAfrica", "vehiclesWorld"] as const

export default function PaysCouvertsFrontierePage() {
  const t = useTranslations("pages.paysCouvertsFrontiere")
  const rich = {
    ...coverageRichTags,
    temporaire: (chunks: ReactNode) => (
      <Link href="/pays-couverts" className="font-semibold text-primary hover:underline">
        {chunks}
      </Link>
    ),
  }

  return (
    <>
      <section className="section-y">
        <Container className="mx-auto max-w-3xl">
          <h1 className="text-balance text-center text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
            {t("heroTitle")}
          </h1>
          <p className="mt-4 text-balance text-center leading-relaxed text-muted-foreground">{t.rich("intro", rich)}</p>
          <p className="mt-3 text-balance text-center leading-relaxed text-muted-foreground">
            {t.rich("introCard", rich)}
          </p>

          <CoverageSection heading={t("vehiclesHeading")}>
            <CoverageText>{t.rich("vehiclesIntro", rich)}</CoverageText>
            <CoverageList>
              {VEHICLE_REGIONS.map((key) => (
                <li key={key}>{t.rich(key, rich)}</li>
              ))}
            </CoverageList>
          </CoverageSection>

          <CoverageCallout heading={t("europeHeading")}>
            <CoverageText>{t.rich("europeBody", rich)}</CoverageText>
          </CoverageCallout>

          <CoverageSection heading={t("euHeading")}>
            <CoverageText>{t.rich("euIntro", rich)}</CoverageText>
            <CountryGrid codes={EU_COUNTRY_CODES} />
          </CoverageSection>

          <CoverageSection heading={t("nonEuHeading")}>
            <CoverageText>{t("nonEuIntro")}</CoverageText>
            <CountryGrid codes={NON_EU_COVERED_COUNTRY_CODES} />
            <CoverageNote>{t("partialNote")}</CoverageNote>
            <p className="mt-4 font-bold text-navy">{t("total")}</p>
          </CoverageSection>

          <CoverageCallout heading={t("cardHeading")}>
            <CoverageList>
              <li>{t.rich("cardNotCrossed", rich)}</li>
              <li>{t.rich("cardCrossed", rich)}</li>
            </CoverageList>
          </CoverageCallout>

          <CoverageCallout heading={t("notCoveredHeading")} tone="danger">
            <CoverageText>{t.rich("notCoveredIntro", rich)}</CoverageText>
            <CountryInlineList codes={EXCLUDED_COUNTRIES.map((c) => c.code)} className="text-destructive" />
            <CoverageText>{t("notCoveredLocal")}</CoverageText>
          </CoverageCallout>

          <CoverageCallout heading={t("whenHeading")}>
            <CoverageText>{t.rich("whenBody", rich)}</CoverageText>
            <CoverageText>{t.rich("whenExample", rich)}</CoverageText>
            <CoverageText>{t.rich("contact", rich)}</CoverageText>
          </CoverageCallout>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" variant="cta" className="rounded-full">
              <Link href={PRODUCT_ROUTES["assurance-frontiere"]}>{t("cta")}</Link>
            </Button>
            <WhatsappButton />
          </div>
        </Container>
      </section>
      <VehicleVignettes />
    </>
  )
}
