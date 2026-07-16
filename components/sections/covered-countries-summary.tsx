import { Link } from "@/i18n/navigation"
import { ArrowRight, Globe2 } from "lucide-react"
import { useTranslations } from "next-intl"

import { Reveal } from "@/components/shared/reveal"

export function CoveredCountriesSummary() {
  const t = useTranslations("home.coveredCountries")

  return (
    <section className="section-y bg-white">
      <div className="mx-auto max-w-3xl container-px text-center">
        <Reveal className="flex flex-col items-center gap-5">
          <span className="flex size-12 items-center justify-center rounded-full bg-secondary text-navy">
            <Globe2 className="size-5" strokeWidth={1.8} />
          </span>
          <p className="text-balance text-lg leading-relaxed text-foreground/80">{t("description")}</p>
          <Link
            href="/pays-couverts"
            className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            {t("cta")}
            <ArrowRight className="size-3.5" />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
