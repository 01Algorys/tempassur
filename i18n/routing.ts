import { defineRouting } from "next-intl/routing"

export const LOCALES = ["fr", "en", "ar", "de", "it", "ro", "es"] as const

export type Locale = (typeof LOCALES)[number]

export const LOCALE_LABELS: Record<Locale, string> = {
  fr: "Français",
  en: "English",
  ar: "العربية",
  de: "Deutsch",
  it: "Italiano",
  ro: "Română",
  es: "Español",
}

// Codes courts affichés dans le sélecteur de langue du header.
export const LOCALE_SHORT_LABELS: Record<Locale, string> = {
  fr: "FR",
  en: "EN",
  ar: "AR",
  de: "DE",
  it: "IT",
  ro: "RO",
  es: "ES",
}

export const RTL_LOCALES: readonly Locale[] = ["ar"]

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: "fr",
  // Le français (locale par défaut) reste servi sans préfixe pour ne pas casser
  // les URLs existantes déjà indexées ; toutes les autres langues sont préfixées
  // (/en/..., /ar/..., etc.).
  localePrefix: "as-needed",
  localeDetection: true,
})
