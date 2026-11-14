import { Star } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { Reveal, Stagger, StaggerItem } from "@/components/shared/reveal"
import { SectionHeading } from "@/components/shared/section-heading"
import { CUSTOMER_REVIEWS, GOOGLE_RATING } from "@/lib/reviews"
import { siteConfig } from "@/lib/site"

function Stars({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="size-4 fill-current" strokeWidth={0} />
      ))}
    </div>
  )
}

// Sélection d'avis Google (voir lib/reviews.ts). L'origine et le mode de sélection sont
// indiqués sous les avis, avec un lien vers la totalité des avis sur Google.
export function Reviews() {
  const t = useTranslations("home.reviews")
  const locale = useLocale()
  const rating = new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(
    GOOGLE_RATING.rating
  )
  const monthFormat = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" })

  return (
    <section className="section-y bg-surface">
      <div className="mx-auto max-w-5xl container-px">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />

        <Reveal delay={0.1} className="mt-6 flex flex-col items-center gap-2 text-center">
          <a
            href={siteConfig.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-full bg-white px-5 py-2.5 shadow-sm transition-shadow hover:shadow-md"
          >
            <span className="text-2xl font-extrabold text-navy">{rating}</span>
            <Stars className="flex items-center gap-0.5 text-orange" />
            <span className="text-sm text-muted-foreground">
              {t("ratingCount", { count: GOOGLE_RATING.count })}
            </span>
          </a>
        </Reveal>

        <Stagger className="mt-10 columns-1 gap-5 md:columns-2">
          {CUSTOMER_REVIEWS.map((review) => (
            <StaggerItem key={review.author} className="mb-5 break-inside-avoid">
              <figure className="flex flex-col gap-4 rounded-3xl border border-border bg-white p-6 shadow-sm">
                <Stars className="flex items-center gap-0.5 text-orange" />
                <blockquote lang="fr" className="whitespace-pre-line text-sm leading-relaxed text-foreground/85">
                  {review.text}
                </blockquote>
                <figcaption className="flex items-center justify-between gap-3 border-t border-border pt-4 text-sm">
                  <span className="font-semibold text-navy">{review.author}</span>
                  <span className="text-xs text-muted-foreground first-letter:uppercase">
                    {monthFormat.format(new Date(`${review.date}-01T12:00:00`))}
                  </span>
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.1} className="mt-4 flex flex-col items-center gap-2 text-center">
          <p className="text-xs text-muted-foreground">
            {t("selectionNote")}
            {locale !== "fr" ? ` ${t("originalLanguage")}` : ""}
          </p>
          <a
            href={siteConfig.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-primary hover:underline"
          >
            {t("cta", { count: GOOGLE_RATING.count })}
          </a>
          <p className="text-xs text-muted-foreground">{t("address", { address: siteConfig.address })}</p>
        </Reveal>
      </div>
    </section>
  )
}
