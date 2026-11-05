import { routing } from "@/i18n/routing"
import { siteConfig } from "@/lib/site"

// Le français (locale par défaut) est servi sans préfixe, les autres langues avec.
export function localizedUrl(path: string, locale: string): string {
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`
  return `${siteConfig.url}${prefix}${path}`
}

// Jeu hreflang identique sur chaque version d'une page, x-default vers le français.
export function localizedLanguages(path: string): Record<string, string> {
  return {
    ...Object.fromEntries(routing.locales.map((locale) => [locale, localizedUrl(path, locale)])),
    "x-default": localizedUrl(path, routing.defaultLocale),
  }
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
