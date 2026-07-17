import type { Metadata, Viewport } from "next"
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google"
import Script from "next/script"
import { NextIntlClientProvider, hasLocale } from "next-intl"
import { notFound } from "next/navigation"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { FloatingWhatsappButton } from "@/components/shared/floating-whatsapp-button"
import { isPreprodEnv, siteConfig } from "@/lib/site"
import { routing, RTL_LOCALES, type Locale } from "@/i18n/routing"

// Placeholder en attente du token de vérification Search Console existant du client
// (dossier §8 : "réutiliser le token google-site-verification existant").
const GOOGLE_SITE_VERIFICATION = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION

import "../globals.css"

const fontSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
})

const fontMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const viewport: Viewport = {
  themeColor: "#2f6fed",
  width: "device-width",
  initialScale: 1,
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

const OPENGRAPH_LOCALES: Record<Locale, string> = {
  fr: "fr_FR",
  en: "en_US",
  ar: "ar",
  de: "de_DE",
  it: "it_IT",
  ro: "ro_RO",
  es: "es_ES",
}

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  applicationName: siteConfig.name,
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: isPreprodEnv
    ? { index: false, follow: false }
    : {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
  verification: GOOGLE_SITE_VERIFICATION ? { google: GOOGLE_SITE_VERIFICATION } : undefined,
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "InsuranceAgency",
  name: siteConfig.name,
  url: siteConfig.url,
  logo: `${siteConfig.url}/opengraph-image`,
  description: siteConfig.description,
  email: siteConfig.email,
  telephone: siteConfig.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Bureau 3, 6 Rue des Bateliers",
    postalCode: "92110",
    addressLocality: "Clichy",
    addressCountry: "FR",
  },
  sameAs: [siteConfig.googleMapsUrl],
  areaServed: "FR",
  priceRange: "€€",
}

// Placeholder en attente de l'identifiant GTM réel du client (dossier §8).
const GTM_CONTAINER_ID = process.env.NEXT_PUBLIC_GTM_ID

interface RootLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  const dir = RTL_LOCALES.includes(locale as Locale) ? "rtl" : "ltr"

  return (
    <html lang={locale} dir={dir} className={`${fontSans.variable} ${fontMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({ ...jsonLd, inLanguage: OPENGRAPH_LOCALES[locale as Locale] }) }}
        />
        {GTM_CONTAINER_ID ? (
          <Script id="gtm" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_CONTAINER_ID}');`}
          </Script>
        ) : null}
        <NextIntlClientProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <FloatingWhatsappButton />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
