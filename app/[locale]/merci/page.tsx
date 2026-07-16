import type { Metadata } from "next"
import Script from "next/script"
import { getTranslations } from "next-intl/server"

import { Container } from "@/components/shared/container"
import { TelLink } from "@/components/shared/tel-link"
import { WhatsappButton } from "@/components/shared/whatsapp-button"
import { siteConfig } from "@/lib/site"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.merci")
  return {
    title: t("metaTitle"),
    robots: { index: false, follow: false },
    alternates: { canonical: `${siteConfig.url}/merci` },
  }
}

// Suivi de conversion GA4 / Google Ads — dossier §4.8 : uniquement sur cette page.
// NEXT_PUBLIC_GA4_MEASUREMENT_ID est un placeholder en attente de l'identifiant réel du
// client (voir rapport final, point ouvert analytics).
const GA4_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID

interface MerciPageProps {
  searchParams: Promise<{ ref?: string }>
}

export default async function MerciPage({ searchParams }: MerciPageProps) {
  const { ref } = await searchParams
  const t = await getTranslations("pages.merci")

  return (
    <section className="section-y">
      {GA4_MEASUREMENT_ID ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`} strategy="afterInteractive" />
          <Script id="ga4-conversion" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA4_MEASUREMENT_ID}');
              gtag('event', 'conversion');`}
          </Script>
        </>
      ) : null}

      <Container className="mx-auto flex max-w-xl flex-col gap-5 text-center">
        <h1 className="text-balance text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
          {t("title")}
        </h1>
        <p className="text-balance leading-relaxed text-muted-foreground">{t("registered")}</p>
        {ref ? (
          <p className="text-sm text-muted-foreground">
            {t("reference")} <span className="font-mono font-semibold text-orange">{ref}</span>
          </p>
        ) : null}
        <p className="text-balance leading-relaxed text-foreground/80">
          {t.rich("checkEmail", { b: (chunks) => <strong>{chunks}</strong> })}
        </p>
        <p className="text-balance leading-relaxed text-foreground/80">
          {t.rich("nextStep", { b: (chunks) => <strong>{chunks}</strong> })}
        </p>
        <div className="rounded-2xl border border-border bg-surface p-5 text-sm leading-relaxed text-muted-foreground">
          <p>
            <strong className="text-navy">{t("urgentHeading")}</strong>{" "}
            {t.rich("urgentBody", { b: (chunks) => <strong>{chunks}</strong> })}{" "}
            <TelLink phone={siteConfig.phone} className="font-semibold text-primary hover:underline">
              {siteConfig.phone}
            </TelLink>{" "}
            ·{" "}
            <a href={`mailto:${siteConfig.email}`} className="font-semibold text-primary hover:underline">
              {siteConfig.email}
            </a>
          </p>
        </div>
        <WhatsappButton className="mx-auto" />
      </Container>
    </section>
  )
}
