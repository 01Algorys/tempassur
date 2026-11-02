import type { Metadata } from "next"
import type { ReactNode } from "react"
import { getLocale, getTranslations } from "next-intl/server"
import { ArrowRight, CheckCircle2, ExternalLink, Info, Mail, MessageCircle, Phone } from "lucide-react"

import { Link } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"
import { Container } from "@/components/shared/container"
import { TelLink } from "@/components/shared/tel-link"
import { Button } from "@/components/ui/button"
import { siteConfig, whatsappUrl } from "@/lib/site"

const PATH = "/cpi-ww-carte-grise"
// Lien partenaire rémunéré (cahier des charges CPI WW §4.2) : rel="sponsored".
const CERTIMAT_URL = "https://certimat.fr/prescripteurs?partner=7308"

const CASE_KEYS = ["abroad", "moving", "waiting"] as const
const SERVICE_KEYS = ["cpi", "carteGrise", "titulaire", "adresse", "duplicata", "import"] as const

const strong = (chunks: ReactNode) => <strong className="font-semibold text-navy">{chunks}</strong>

function pageUrl(locale: string) {
  return `${siteConfig.url}${locale === routing.defaultLocale ? "" : `/${locale}`}${PATH}`
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.cpiWw")
  const locale = await getLocale()
  return {
    title: { absolute: t("metaTitle") },
    description: t("metaDescription"),
    alternates: { canonical: pageUrl(locale) },
  }
}

export default async function CpiWwPage() {
  const t = await getTranslations("pages.cpiWw")
  const faq = t.raw("faq") as { question: string; answer: string }[]

  // Même texte que la FAQ visible ci-dessous (§4.4).
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  }

  return (
    <section className="section-y">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Container className="mx-auto max-w-3xl">
        <h1 className="text-balance text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">{t("heading")}</h1>
        <p className="mt-4 leading-relaxed text-muted-foreground">{t.rich("intro", { strong })}</p>

        <div className="mt-10">
          <h2 className="text-xl font-bold text-navy">{t("whatHeading")}</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">{t.rich("whatBody", { strong })}</p>
          <div className="mt-4 flex items-start gap-2 rounded-xl bg-secondary px-4 py-3 text-sm leading-relaxed text-navy">
            <Info className="mt-0.5 size-4 shrink-0 text-primary" />
            <p>{t.rich("goodToKnow", { strong })}</p>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-bold text-navy">{t("casesHeading")}</h2>
          <ul className="mt-4 flex flex-col gap-2.5 text-muted-foreground">
            {CASE_KEYS.map((key) => (
              <li key={key} className="flex items-start gap-2 leading-relaxed">
                <CheckCircle2 className="mt-1 size-4 shrink-0 text-primary" />
                {t(`cases.${key}`)}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-bold text-navy">{t("servicesHeading")}</h2>
          <ul className="mt-4 flex flex-col gap-2.5 text-muted-foreground">
            {SERVICE_KEYS.map((key) => (
              <li key={key} className="flex items-start gap-2 leading-relaxed">
                <CheckCircle2 className="mt-1 size-4 shrink-0 text-primary" />
                <span>{t.rich(`services.${key}`, { strong })}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <Button asChild size="lg" variant="cta" className="h-auto min-h-11 rounded-full whitespace-normal">
              <a href={CERTIMAT_URL} target="_blank" rel="sponsored noopener">
                {t("partnerCta")}
                <ExternalLink data-icon="inline-end" />
              </a>
            </Button>
          </div>

          <div className="mt-6 rounded-2xl border border-border bg-surface p-6">
            <p className="font-bold text-navy">{t("helpTitle")}</p>
            <p className="mt-2 leading-relaxed text-muted-foreground">{t("helpBody")}</p>
            <ul className="mt-4 flex flex-col gap-3 text-sm">
              <li className="flex flex-wrap items-center gap-2">
                <Mail className="size-4 shrink-0 text-primary" />
                <span className="font-semibold text-navy">{t("emailLabel")}</span>
                <a href={`mailto:${siteConfig.email}`} className="text-primary underline-offset-2 hover:underline">
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex flex-wrap items-center gap-2">
                <MessageCircle className="size-4 shrink-0 text-primary" />
                <span className="font-semibold text-navy">{t("whatsappLabel")}</span>
                <a href={whatsappUrl()} target="_blank" rel="noopener" className="text-primary underline-offset-2 hover:underline">
                  {siteConfig.phone}
                </a>
              </li>
              <li className="flex flex-wrap items-center gap-2">
                <Phone className="size-4 shrink-0 text-primary" />
                <span className="font-semibold text-navy">{t("phoneLabel")}</span>
                <TelLink phone={siteConfig.phone} className="text-primary underline-offset-2 hover:underline">
                  {siteConfig.phone}
                </TelLink>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-bold text-navy">{t("insuranceHeading")}</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">{t.rich("insuranceBody", { strong })}</p>
          <div className="mt-6">
            <Button asChild size="lg" variant="cta" className="h-auto min-h-11 rounded-full whitespace-normal">
              <Link href="/#tarificateur">
                {t("quoteCta")}
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-bold text-navy">{t("faqHeading")}</h2>
          <div className="mt-4 flex flex-col gap-3">
            {faq.map((item) => (
              <div key={item.question} className="rounded-2xl border border-border bg-white px-5 py-4 shadow-sm">
                <h3 className="font-semibold text-navy">{item.question}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
