import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import { Link } from "@/i18n/navigation"
import { coverageRichTags } from "@/components/coverage/coverage-ui"
import { Container } from "@/components/shared/container"
import { SubscriptionWizard } from "@/components/forms/subscription/subscription-wizard"
import { pageMetadata } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.souscriptionFrontiere")
  return pageMetadata({
    path: "/souscription-frontiere",
    title: t("metaTitle"),
    description: t("metaDescription"),
  })
}

interface SouscriptionFrontierePageProps {
  searchParams: Promise<{ duree?: string }>
}

export default async function SouscriptionFrontierePage({ searchParams }: SouscriptionFrontierePageProps) {
  const { duree } = await searchParams
  const initialDuree = duree ? Number(duree) : undefined
  const t = await getTranslations("pages.souscriptionFrontiere")
  const tMain = await getTranslations("pages.souscription")

  return (
    <section className="section-y">
      <Container>
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h1 className="text-balance text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
            {tMain("title")}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{tMain("description")}</p>
        </div>

        <SubscriptionWizard initialCategory="assurance-frontiere" initialDuree={initialDuree} />

        <div className="mx-auto mt-16 max-w-3xl border-t border-border pt-10 text-sm leading-relaxed text-muted-foreground">
          <h2 className="text-lg font-bold text-navy">{tMain("guaranteesHeading")}</h2>
          <p className="mt-3">{t("audience")}</p>
          <p className="mt-3">{t("includesIntro")}</p>
          <ul className="mt-2 list-disc space-y-1 ps-5">
            <li>{tMain("includesLiability")}</li>
            <li>{tMain("includesDefence")}</li>
          </ul>
          <p className="mt-3">{t("coverageParagraph")}</p>
          <p className="mt-3">{t("temporaireNote")}</p>
          <p className="mt-3">{tMain.rich("contact", coverageRichTags)}</p>
          <Link href="/pays-couverts-frontiere" className="mt-2 inline-block font-semibold text-primary hover:underline">
            {t("coveredCountriesCta")}
          </Link>
        </div>
      </Container>
    </section>
  )
}
