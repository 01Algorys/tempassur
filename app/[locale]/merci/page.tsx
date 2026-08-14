import type { Metadata } from "next"
import Script from "next/script"
import { getTranslations } from "next-intl/server"
import type Stripe from "stripe"

import { Container } from "@/components/shared/container"
import { TelLink } from "@/components/shared/tel-link"
import { WhatsappButton } from "@/components/shared/whatsapp-button"
import { redirect } from "@/i18n/navigation"
import { fulfillContract } from "@/lib/contract-fulfillment"
import { getStripe } from "@/lib/stripe"
import { siteConfig } from "@/lib/site"
import { VEHICLE_SLUGS, type VehicleSlug } from "@/types"
import type { Locale } from "@/i18n/routing"

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
  params: Promise<{ locale: string }>
  searchParams: Promise<{ payment_intent?: string; numero?: string }>
}

// Reconciles the case where the client-side create-contract call never ran — Stripe did
// a full off-page redirect (3DS, local payment methods) that skips straight to returnUrl,
// or the tab closed/network dropped between payment success and the client-side retries
// finishing. Idempotent: transformCrmDevis just returns the existing contrat on retry, so
// this is safe to call even when the client-side call already succeeded.
async function resolveReference(paymentIntent: Stripe.PaymentIntent, numero: string | undefined): Promise<string> {
  if (numero) return paymentIntent.id

  const devisId = paymentIntent.metadata?.devisId
  if (!devisId) return paymentIntent.id

  const result = await fulfillContract({
    paymentIntentId: paymentIntent.id,
    devisId,
    marque: paymentIntent.metadata.marque || undefined,
    modele: paymentIntent.metadata.modele || undefined,
    immatriculation: paymentIntent.metadata.immatriculation || undefined,
    dateEffet: paymentIntent.metadata.dateEffet || undefined,
    heureEffet: paymentIntent.metadata.heureEffet || undefined,
    duree: paymentIntent.metadata.duree ? Number(paymentIntent.metadata.duree) : undefined,
  })
  if (result.success) return result.numero

  console.error("[merci] contract reconciliation failed", { paymentIntentId: paymentIntent.id, devisId, error: result.error })
  return paymentIntent.id
}

// GA4 ecommerce "purchase" event pushed to dataLayer for GTM to pick up once loaded (GTM
// itself only loads after cookie consent — see lib/cookie-consent.ts — so this push never
// triggers a network call on its own; it just seeds the array GTM reads on init).
// Ref: https://developers.google.com/analytics/devguides/collection/ga4/ecommerce?client_type=gtm&hl=fr#purchase-gtm
interface PurchaseEcommercePayload {
  transaction_id: string
  value: number
  currency: string
  items: { item_id: string; item_name: string; price: number; quantity: number }[]
}

function buildPurchasePayload(
  paymentIntent: Stripe.PaymentIntent,
  ref: string,
  vehicleLabel: string
): PurchaseEcommercePayload {
  const categorie = paymentIntent.metadata?.categorie
  const itemId = categorie && (VEHICLE_SLUGS as readonly string[]).includes(categorie) ? (categorie as VehicleSlug) : "assurance"
  const value = paymentIntent.amount / 100

  return {
    transaction_id: ref,
    value,
    currency: paymentIntent.currency.toUpperCase(),
    items: [{ item_id: itemId, item_name: vehicleLabel, price: value, quantity: 1 }],
  }
}

export default async function MerciPage({ params, searchParams }: MerciPageProps) {
  const { locale } = await params
  const { payment_intent: paymentIntentId, numero } = await searchParams
  const t = await getTranslations("pages.merci")
  const tVehicles = await getTranslations("vehicleTypes")

  let paymentIntent: Stripe.PaymentIntent | null = null
  if (paymentIntentId) {
    try {
      paymentIntent = await getStripe().paymentIntents.retrieve(paymentIntentId)
    } catch {
      paymentIntent = null
    }
    if (!paymentIntent || paymentIntent.status !== "succeeded") {
      redirect({ href: { pathname: "/souscription", query: { paiement: "echec" } }, locale: locale as Locale })
    }
  }

  const paymentRef = paymentIntent ? await resolveReference(paymentIntent, numero) : undefined
  const ref = numero || paymentRef

  const categorie = paymentIntent?.metadata?.categorie
  const vehicleLabel =
    categorie && (VEHICLE_SLUGS as readonly string[]).includes(categorie)
      ? tVehicles(`${categorie as VehicleSlug}.label`)
      : ""
  const purchasePayload = paymentIntent && ref ? buildPurchasePayload(paymentIntent, ref, vehicleLabel) : null
  // Escape "</" so a user-controlled string (vehicle label) can't prematurely close the
  // inline <script> tag it's serialized into below.
  const purchasePayloadJson = purchasePayload ? JSON.stringify(purchasePayload).replace(/</g, "\\u003c") : null

  return (
    <section className="section-y">
      {purchasePayloadJson ? (
        <Script id="ga4-purchase" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
            dataLayer.push({ ecommerce: null });
            dataLayer.push({ event: 'purchase', ecommerce: ${purchasePayloadJson} });`}
        </Script>
      ) : null}

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
      </Container>
    </section>
  )
}
