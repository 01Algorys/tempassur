import type { ReactNode } from "react"
import { useLocale, useTranslations } from "next-intl"

import { PARTIAL_COVERAGE_COUNTRY_CODES, countryFlag } from "@/lib/covered-countries"
import { getCountryLabel } from "@/lib/countries"
import { siteConfig } from "@/lib/site"
import { cn } from "@/lib/utils"

// Tags shared by the rich messages of the two "pays couverts" pages.
export const coverageRichTags = {
  strong: (chunks: ReactNode) => <strong className="font-semibold text-foreground">{chunks}</strong>,
  email: (chunks: ReactNode) => (
    <a href={`mailto:${siteConfig.email}`} className="font-semibold text-primary hover:underline">
      {chunks}
    </a>
  ),
  phone: (chunks: ReactNode) => (
    <a
      href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
      dir="ltr"
      className="font-semibold whitespace-nowrap text-primary hover:underline"
    >
      {chunks}
    </a>
  ),
}

function useCountryItems(codes: string[]) {
  const locale = useLocale()
  const otherLabel = useTranslations("common")("otherCountry")

  return codes
    .map((code) => ({
      code,
      label: getCountryLabel(code, locale, otherLabel),
      partial: PARTIAL_COVERAGE_COUNTRY_CODES.includes(code),
    }))
    .sort((a, b) => a.label.localeCompare(b.label, locale))
}

export function CountryGrid({ codes }: { codes: string[] }) {
  const countries = useCountryItems(codes)

  return (
    <ul className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 text-sm text-foreground/80 sm:grid-cols-3">
      {countries.map(({ code, label, partial }) => (
        <li key={code} className="flex items-center gap-2">
          <span>{countryFlag(code)}</span>
          <span>
            {label}
            {partial ? "*" : ""}
          </span>
        </li>
      ))}
    </ul>
  )
}

export function CountryInlineList({ codes, className }: { codes: string[]; className?: string }) {
  const countries = useCountryItems(codes)

  return (
    <p className={cn("mt-3 leading-relaxed font-semibold", className)}>
      {countries.map(({ label }) => label).join(" · ")}
    </p>
  )
}

export function CoverageSection({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold text-navy">{heading}</h2>
      {children}
    </div>
  )
}

export function CoverageCallout({
  heading,
  tone = "neutral",
  children,
}: {
  heading: string
  tone?: "neutral" | "danger"
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        "mt-10 rounded-2xl border p-6",
        tone === "danger" ? "border-destructive/30 bg-destructive/5" : "border-border bg-surface",
      )}
    >
      <h2 className="text-xl font-bold text-navy">{heading}</h2>
      {children}
    </div>
  )
}

export function CoverageText({ children }: { children: ReactNode }) {
  return <p className="mt-3 leading-relaxed text-muted-foreground">{children}</p>
}

export function CoverageNote({ children }: { children: ReactNode }) {
  return <p className="mt-3 text-xs text-muted-foreground italic">{children}</p>
}

export function CoverageList({ children }: { children: ReactNode }) {
  return <ul className="mt-3 list-disc space-y-1.5 ps-5 leading-relaxed text-muted-foreground">{children}</ul>
}
