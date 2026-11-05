import type { Metadata } from "next"
import { getLocale } from "next-intl/server"

import type { Locale } from "@/i18n/routing"
import { localizedLanguages, localizedUrl } from "@/lib/seo-urls"
import { siteConfig } from "@/lib/site"

const OPENGRAPH_LOCALES: Record<Locale, string> = {
  fr: "fr_FR",
  en: "en_GB",
  ar: "ar_AR",
  de: "de_DE",
  it: "it_IT",
  ro: "ro_RO",
  es: "es_ES",
}

interface PageMetadataInput {
  /** Chemin sans préfixe de langue, "" pour l'accueil. */
  path: string
  title: string | { absolute: string }
  description?: string
  robots?: Metadata["robots"]
}

// Chaque version linguistique se déclare canonique (Google : le canonical d'une page
// traduite doit rester dans sa langue) et liste toutes les autres via hreflang.
export async function pageMetadata({ path, title, description, robots }: PageMetadataInput): Promise<Metadata> {
  const locale = (await getLocale()) as Locale
  const url = localizedUrl(path, locale)
  const socialTitle = typeof title === "string" ? `${title} | ${siteConfig.name}` : title.absolute
  const socialDescription = description ?? siteConfig.description

  return {
    title,
    description,
    alternates: { canonical: url, languages: localizedLanguages(path) },
    openGraph: {
      type: "website",
      url,
      siteName: siteConfig.name,
      locale: OPENGRAPH_LOCALES[locale],
      title: socialTitle,
      description: socialDescription,
      images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: socialDescription,
      images: [siteConfig.ogImage],
    },
    ...(robots ? { robots } : {}),
  }
}
