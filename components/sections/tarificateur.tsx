"use client"

import { useMemo, useState } from "react"
import { useRouter } from "@/i18n/navigation"
import { ArrowRight } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { VEHICLE_TYPES } from "@/lib/constants"
import {
  getAvailableDurations,
  getDurationShortcuts,
  getMinPriceForDuration,
  getPreselectedDuration,
} from "@/lib/pricing"
import { cn } from "@/lib/utils"
import type { VehicleSlug } from "@/types"

export function Tarificateur() {
  const t = useTranslations("home.tarificateur")
  const tVehicles = useTranslations("vehicleTypes")
  const locale = useLocale()
  const currency = useMemo(
    () => new Intl.NumberFormat(locale, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }),
    [locale]
  )
  const router = useRouter()
  const [category, setCategory] = useState<VehicleSlug>("automobiles")
  const [duree, setDuree] = useState<number>(getPreselectedDuration("automobiles"))

  const shortcuts = useMemo(() => getDurationShortcuts(category), [category])
  const preselected = useMemo(() => getPreselectedDuration(category), [category])
  const allDurations = useMemo(() => getAvailableDurations(category, { duree: null, isDomTom: false }), [category])
  const price = useMemo(() => getMinPriceForDuration(category, duree, false), [category, duree])

  function handleCategoryChange(value: string) {
    const slug = value as VehicleSlug
    setCategory(slug)
    setDuree(getPreselectedDuration(slug))
  }

  function handleSouscription() {
    router.push(`/souscription?categorie=${category}&duree=${duree}`)
  }

  return (
    <div id="tarificateur" className="scroll-mt-28 rounded-3xl border border-border bg-white p-6 shadow-xl shadow-slate-900/10 sm:p-8">
      <h2 className="text-lg font-bold text-navy">{t("title")}</h2>

      <div className="mt-6 flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="tarificateur-category" className="text-sm font-medium text-foreground">
            {t("categoryLabel")}
          </label>
          <Select value={category} onValueChange={handleCategoryChange}>
            <SelectTrigger id="tarificateur-category" className="h-11 w-full rounded-lg">
              <SelectValue placeholder={t("categoryPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {VEHICLE_TYPES.map((v) => (
                <SelectItem key={v.slug} value={v.slug}>
                  {tVehicles(`${v.slug}.label`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">{tVehicles(`${category}.description`)}</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">{t("durationLabel")}</label>
          <div className="flex flex-wrap gap-2">
            {shortcuts.map((d) => (
              <button
                key={d}
                type="button"
                aria-pressed={duree === d}
                onClick={() => setDuree(d)}
                className={cn(
                  "relative rounded-lg border px-3 py-2 text-xs font-semibold transition-colors sm:text-sm",
                  duree === d ? "border-primary bg-primary text-white" : "border-border text-foreground/70 hover:border-primary/40"
                )}
              >
                {t("durationDays", { count: d })}
                {d === preselected ? (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-orange px-1.5 py-0.5 text-[9px] font-bold whitespace-nowrap text-white">
                    {t("mostChosen")}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
          <Select value={String(duree)} onValueChange={(v) => setDuree(Number(v))}>
            <SelectTrigger className="h-11 w-full rounded-lg">
              <SelectValue placeholder={t("durationPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {allDurations.map((d) => (
                <SelectItem key={d} value={String(d)}>
                  {t("durationOption", { count: d })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-2xl bg-surface p-4">
          <p className="text-2xl font-extrabold tracking-tight text-navy">
            {price != null ? t("priceFrom", { price: currency.format(price / duree) }) : t("pricePlaceholder")}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t("priceNote")}</p>
        </div>

        <Button type="button" size="xl" variant="cta" className="w-full rounded-full" onClick={handleSouscription}>
          {t("cta")}
          <ArrowRight data-icon="inline-end" />
        </Button>
      </div>
    </div>
  )
}
