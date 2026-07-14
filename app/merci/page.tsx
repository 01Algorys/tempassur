import type { Metadata } from "next"
import Script from "next/script"

import { Container } from "@/components/shared/container"
import { TelLink } from "@/components/shared/tel-link"
import { WhatsappButton } from "@/components/shared/whatsapp-button"
import { siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: "Merci pour votre confiance",
  robots: { index: false, follow: false },
  alternates: { canonical: `${siteConfig.url}/merci` },
}

// Suivi de conversion GA4 / Google Ads — dossier §4.8 : uniquement sur cette page.
// NEXT_PUBLIC_GA4_MEASUREMENT_ID est un placeholder en attente de l'identifiant réel du
// client (voir rapport final, point ouvert analytics).
const GA4_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID

export default function MerciPage() {
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
          Merci pour votre confiance !
        </h1>
        <p className="text-balance leading-relaxed text-muted-foreground">
          Votre demande de souscription est enregistrée et en cours de traitement.
        </p>
        <p className="text-balance leading-relaxed text-foreground/80">
          <strong>Vérifiez votre boîte mail</strong> (y compris les spams) : vous allez recevoir dans
          les prochaines minutes un lien sécurisé pour <strong>signer électroniquement vos documents</strong>.
        </p>
        <p className="text-balance leading-relaxed text-foreground/80">
          <strong>Prochaine étape : signez les documents reçus par e-mail</strong> pour que la garantie
          entre en vigueur.
        </p>
        <div className="rounded-2xl border border-border bg-surface p-5 text-sm leading-relaxed text-muted-foreground">
          <p>
            <strong className="text-navy">Heure d&apos;effet imminente ou déjà passée ?</strong> Si vous
            n&apos;avez pas reçu l&apos;e-mail, contactez-nous immédiatement pour accélérer le
            traitement : <strong>WhatsApp (recommandé)</strong> ou téléphone :{" "}
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
