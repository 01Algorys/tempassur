import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { useLocale, useTranslations } from "next-intl"

import { Link } from "@/i18n/navigation"
import { Container } from "@/components/shared/container"
import { WhatsappButton } from "@/components/shared/whatsapp-button"
import { Button } from "@/components/ui/button"
import { PRODUCT_ROUTES, VEHICLE_TYPES } from "@/lib/constants"
import { getMinPrice } from "@/lib/pricing"
import { AUTO_TARIFFS, CV_TIER_OPTIONS, FRONTIERE_TARIFFS, type CvTier, type TariffRow } from "@/lib/pricing-data"
import { pageMetadata } from "@/lib/seo"
import { breadcrumbJsonLd, localizedUrl } from "@/lib/seo-urls"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.tarifs")
  return pageMetadata({
    path: "/tarifs",
    title: { absolute: t("metaTitle") },
    description: t("metaDescription"),
  })
}

type PriceColumn = "prixFr" | "prixDomTom"

interface TariffTableProps {
  tariffs: Record<CvTier, TariffRow[]>
  column: PriceColumn
  caption: string
}

function TariffTable({ tariffs, column, caption }: TariffTableProps) {
  const t = useTranslations("pages.tarifs")
  const tCvTier = useTranslations("pricingLabels.cvTier")
  const tSummary = useTranslations("wizard.billingSummary")
  const locale = useLocale()
  const currency = new Intl.NumberFormat(locale, { style: "currency", currency: "EUR", maximumFractionDigits: 0 })
  const durations = tariffs["moins-16cv"].map((row) => row.duree)

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold text-navy">{caption}</h2>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[28rem] border-collapse text-sm">
          <thead>
            <tr className="bg-surface text-navy">
              <th scope="col" className="px-4 py-3 text-start font-semibold">
                {t("durationColumn")}
              </th>
              {CV_TIER_OPTIONS.map((tier) => (
                <th key={tier.value} scope="col" className="px-4 py-3 text-end font-semibold">
                  {tCvTier(tier.value)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {durations.map((duree) => (
              <tr key={duree} className="border-t border-border">
                <th scope="row" className="px-4 py-2.5 text-start font-medium text-foreground">
                  {tSummary("durationValue", { count: duree })}
                </th>
                {CV_TIER_OPTIONS.map((tier) => {
                  const row = tariffs[tier.value].find((r) => r.duree === duree)
                  return (
                    <td key={tier.value} className="px-4 py-2.5 text-end text-muted-foreground">
                      {row ? currency.format(row[column]) : "—"}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function TarifsPage() {
  const t = useTranslations("pages.tarifs")
  const tSection = useTranslations("product.sectionHeadings")
  const tVehicles = useTranslations("vehicleTypes")
  const tNav = useTranslations("nav")
  const locale = useLocale()
  const currency = new Intl.NumberFormat(locale, { style: "currency", currency: "EUR", maximumFractionDigits: 0 })

  const otherVehicles = VEHICLE_TYPES.filter((v) => v.slug !== "automobiles" && v.slug !== "assurance-frontiere")

  const breadcrumb = breadcrumbJsonLd([
    { name: tNav("accueil"), url: localizedUrl("", locale) },
    { name: t("heroTitle"), url: localizedUrl("/tarifs", locale) },
  ])

  return (
    <section className="section-y">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <Container className="mx-auto max-w-3xl">
        <h1 className="text-balance text-center text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
          {t("heroTitle")}
        </h1>
        <p className="mt-4 text-balance text-center leading-relaxed text-muted-foreground">{t("intro")}</p>

        <TariffTable tariffs={AUTO_TARIFFS} column="prixFr" caption={t("autoHeading")} />
        <TariffTable tariffs={AUTO_TARIFFS} column="prixDomTom" caption={t("autoDomTomHeading")} />
        <TariffTable tariffs={FRONTIERE_TARIFFS} column="prixFr" caption={t("frontierHeading")} />
        <TariffTable tariffs={FRONTIERE_TARIFFS} column="prixDomTom" caption={t("frontierDomTomHeading")} />

        <div className="mt-10">
          <h2 className="text-xl font-bold text-navy">{t("othersHeading")}</h2>
          <ul className="mt-4 flex flex-col gap-2 text-sm">
            {otherVehicles.map((vehicle) => (
              <li key={vehicle.slug} className="flex items-center justify-between gap-4 border-b border-border pb-2">
                <Link href={PRODUCT_ROUTES[vehicle.slug]} className="font-semibold text-primary hover:underline">
                  {tVehicles(`${vehicle.slug}.label`)}
                </Link>
                <span className="text-muted-foreground">
                  {t("fromPrice", { price: currency.format(getMinPrice(vehicle.slug)) })}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-8 text-sm leading-relaxed text-muted-foreground">{t("note")}</p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" variant="cta" className="rounded-full">
            <Link href="/#tarificateur">{tSection("ctaEstimate")}</Link>
          </Button>
          <WhatsappButton />
        </div>
      </Container>
    </section>
  )
}
