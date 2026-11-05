import type { Metadata } from "next"
import { getLocale, getTranslations } from "next-intl/server"

import { Link, redirect } from "@/i18n/navigation"
import { coverageRichTags } from "@/components/coverage/coverage-ui"
import { Container } from "@/components/shared/container"
import { SubscriptionWizard } from "@/components/forms/subscription/subscription-wizard"
import { VEHICLE_SLUGS } from "@/types"
import type { VehicleSlug } from "@/types"
import { pageMetadata } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.souscription")
  return pageMetadata({
    path: "/souscription",
    title: t("metaTitle"),
    description: t("metaDescription"),
  })
}

interface SouscriptionPageProps {
  searchParams: Promise<{ categorie?: string; duree?: string; paiement?: string }>
}

function isVehicleSlug(value: string | undefined): value is VehicleSlug {
  return !!value && (VEHICLE_SLUGS as readonly string[]).includes(value)
}

export default async function SouscriptionPage({ searchParams }: SouscriptionPageProps) {
  const { categorie, duree, paiement } = await searchParams
  // The insurance type can't be changed inside the form, so it has to be picked on the
  // home page first. `paiement` marks the return from a failed payment.
  if (!isVehicleSlug(categorie) && !paiement) {
    redirect({ href: "/#tarificateur", locale: await getLocale() })
  }
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
          <p className="mt-3">{t("includesIntro")}</p>
          <ul className="mt-2 list-disc space-y-1 ps-5">
            <li>{t("includesLiability")}</li>
            <li>{t("includesDefence")}</li>
          </ul>
          <p className="mt-3">{t("optionsParagraph")}</p>
          <p className="mt-3">{t("coverageParagraph")}</p>
          <p className="mt-1">{t("extensionParagraph")}</p>
          <p className="mt-3">{t.rich("contact", coverageRichTags)}</p>
          <Link href="/pays-couverts" className="mt-2 inline-block font-semibold text-primary hover:underline">
            {t("coveredCountriesCta")}
          </Link>
        </div>
      </Container>
    </section>
  )
}
