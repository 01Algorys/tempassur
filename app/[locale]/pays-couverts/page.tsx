import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { useLocale, useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"

import { Container } from "@/components/shared/container"
import { WhatsappButton } from "@/components/shared/whatsapp-button"
import { Button } from "@/components/ui/button"
import {
  COVERED_COUNTRY_CODES,
  EXTENSION_COUNTRY_CODES,
  NEVER_COVERED_COUNTRY_CODES,
  countryFlag,
} from "@/lib/covered-countries"
import { getCountryLabel } from "@/lib/countries"
import { siteConfig } from "@/lib/site"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.paysCouverts")
  return {
    title: { absolute: t("metaTitle") },
    description: t("metaDescription"),
    alternates: { canonical: `${siteConfig.url}/pays-couverts` },
  }
}

export default function PaysCouvertsPage() {
  const t = useTranslations("pages.paysCouverts")
  const tCommon = useTranslations("common")
  const locale = useLocale()
  const otherLabel = tCommon("otherCountry")

  const extensionCountries = EXTENSION_COUNTRY_CODES.map((code) => getCountryLabel(code, locale, otherLabel)).join(
    " · ",
  )
  const neverCoveredCountries = NEVER_COVERED_COUNTRY_CODES.map((code) =>
    getCountryLabel(code, locale, otherLabel),
  ).join(" · ")

  return (
    <section className="section-y">
      <Container className="mx-auto max-w-3xl">
        <h1 className="text-balance text-center text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
          {t("heroTitle")}
        </h1>
        <p className="mt-4 text-balance text-center leading-relaxed text-muted-foreground">{t("intro")}</p>

        <div className="mt-10">
          <h2 className="text-xl font-bold text-navy">{t("coveredHeading")}</h2>
          <ul className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 text-sm text-foreground/80 sm:grid-cols-3">
            {COVERED_COUNTRY_CODES.map((code) => (
              <li key={code} className="flex items-center gap-2">
                <span>{countryFlag(code)}</span>
                {getCountryLabel(code, locale, otherLabel)}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground italic">{t("assimilatedNote")}</p>
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-xl font-bold text-navy">{t("extensionHeading")}</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            {t("extensionParagraph", { countries: extensionCountries })}
          </p>
        </div>

        <div className="mt-10 rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
          <h2 className="text-xl font-bold text-navy">{t("neverCoveredHeading")}</h2>
          <p className="mt-3 leading-relaxed font-semibold text-destructive">{neverCoveredCountries}</p>
        </div>

        <p className="mt-8 text-sm leading-relaxed text-muted-foreground">{t("coverageVariationNotice")}</p>
        <p className="mt-2 text-sm italic leading-relaxed text-muted-foreground">{t("internationalCardNote")}</p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" variant="cta" className="rounded-full">
            <Link href="/#tarificateur">{t("ctaEstimate")}</Link>
          </Button>
          <WhatsappButton />
        </div>
      </Container>
    </section>
  )
}
