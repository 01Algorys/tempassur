import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"

import { Container } from "@/components/shared/container"
import { PageHero } from "@/components/layout/page-hero"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/lib/site"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.quiSommesNous")
  return {
    title: { absolute: t("metaTitle") },
    description: t("metaDescription"),
    alternates: { canonical: `${siteConfig.url}/qui-sommes-nous` },
  }
}

export default function QuiSommesNousPage() {
  const t = useTranslations("pages.quiSommesNous")
  const promises = t.raw("promises") as { title: string; description: string }[]

  return (
    <>
      <PageHero eyebrow={t("eyebrow")} title={t("heroTitle")} />
      <section className="section-y">
        <Container className="mx-auto flex max-w-3xl flex-col gap-10">
          <p className="text-balance leading-relaxed text-muted-foreground">
            {t("intro", { orias: siteConfig.orias })}
          </p>

          <div>
            <h2 className="text-xl font-bold text-navy">{t("promisesHeading")}</h2>
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
              {promises.map((item) => (
                <div key={item.title} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                  <h3 className="font-bold text-navy">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-navy">{t("whereHeading")}</h2>
            <p className="mt-3 text-muted-foreground">{siteConfig.address}</p>
            <div className="mt-4 overflow-hidden rounded-2xl border border-border">
              <iframe
                title={t("mapTitle")}
                src={`https://www.google.com/maps?q=${encodeURIComponent(siteConfig.address)}&output=embed`}
                width="100%"
                height="320"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" variant="cta" className="rounded-full">
              <Link href="/#tarificateur">{t("ctaEstimate")}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full">
              <Link href="/contact">{t("ctaContact")}</Link>
            </Button>
          </div>
        </Container>
      </section>
    </>
  )
}
