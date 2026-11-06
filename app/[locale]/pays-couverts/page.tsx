import type { Metadata } from "next"
import type { ReactNode } from "react"
import { getTranslations } from "next-intl/server"
import { useLocale, useTranslations } from "next-intl"
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
import {
  EU_COUNTRY_CODES,
  EXTENSION_COUNTRY_CODES,
  NEVER_COVERED_COUNTRY_CODES,
  NON_EU_COVERED_COUNTRY_CODES,
} from "@/lib/covered-countries"
import { getCountryLabel } from "@/lib/countries"
import { pageMetadata } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.paysCouverts")
  return pageMetadata({
    path: "/pays-couverts",
    title: { absolute: t("metaTitle") },
    description: t("metaDescription"),
  })
}

export default function PaysCouvertsPage() {
  const t = useTranslations("pages.paysCouverts")
  const tCommon = useTranslations("common")
  const locale = useLocale()
  const otherLabel = tCommon("otherCountry")

  const suspendedCountries = NEVER_COVERED_COUNTRY_CODES.filter((code) => code !== "UA")
    .map((code) => getCountryLabel(code, locale, otherLabel))
    .sort((a, b) => a.localeCompare(b, locale))
    .join(", ")
  const ukraine = getCountryLabel("UA", locale, otherLabel)

  const rich = {
    ...coverageRichTags,
    frontiere: (chunks: ReactNode) => (
      <Link href="/pays-couverts-frontiere" className="font-semibold text-primary hover:underline">
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
          <p className="mt-4 text-balance text-center leading-relaxed text-muted-foreground">
            {t.rich("introCard", rich)}
          </p>
          <p className="mt-3 text-balance text-center leading-relaxed text-muted-foreground">
            {t.rich("introCoverage", rich)}
          </p>

          <CoverageCallout heading={t("cardHeading")}>
            <CoverageText>{t("cardIntro")}</CoverageText>
            <CoverageList>
              <li>{t.rich("cardNotCrossed", rich)}</li>
              <li>{t.rich("cardCrossed", rich)}</li>
            </CoverageList>
            <CoverageText>{t("cardLocalRules")}</CoverageText>
          </CoverageCallout>

          <CoverageSection heading={t("euHeading")}>
            <CoverageText>{t.rich("euIntro", rich)}</CoverageText>
            <CountryGrid codes={EU_COUNTRY_CODES} />
          </CoverageSection>

          <CoverageSection heading={t("nonEuHeading")}>
            <CoverageText>{t.rich("nonEuIntro", rich)}</CoverageText>
            <CountryGrid codes={NON_EU_COVERED_COUNTRY_CODES} />
            <CoverageText>{t("nonEuCustoms")}</CoverageText>
            <CoverageNote>{t("partialNote")}</CoverageNote>
            <p className="mt-4 font-bold text-navy">{t("total")}</p>
          </CoverageSection>

          <CoverageCallout heading={t("extensionHeading")}>
            <CoverageText>{t.rich("extensionIntro", rich)}</CoverageText>
            <CountryGrid codes={EXTENSION_COUNTRY_CODES} />
            <CoverageList>
              <li>{t.rich("extensionWithout", rich)}</li>
              <li>{t.rich("extensionWith", rich)}</li>
            </CoverageList>
            <CoverageNote>{t("azerbaijanNote")}</CoverageNote>
          </CoverageCallout>

          <CoverageCallout heading={t("neverHeading")} tone="danger">
            <CoverageText>{t("neverIntro")}</CoverageText>
            <CountryInlineList codes={NEVER_COVERED_COUNTRY_CODES} className="text-destructive" />
            <CoverageList>
              <li>{t.rich("neverSuspended", { ...rich, countries: suspendedCountries })}</li>
              <li>{t.rich("neverUkraine", { ...rich, country: ukraine })}</li>
            </CoverageList>
          </CoverageCallout>

          <CoverageCallout heading={t("adviceHeading")}>
            <CoverageText>{t.rich("adviceBody", rich)}</CoverageText>
            <CoverageText>{t.rich("adviceExample", rich)}</CoverageText>
            <CoverageText>{t.rich("contact", rich)}</CoverageText>
          </CoverageCallout>

          <p className="mt-8 text-sm italic leading-relaxed text-muted-foreground">{t.rich("frontierReferral", rich)}</p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" variant="cta" className="rounded-full">
              <Link href="/#tarificateur">{t("ctaEstimate")}</Link>
            </Button>
            <WhatsappButton />
          </div>
        </Container>
      </section>
      <VehicleVignettes />
    </>
  )
}
