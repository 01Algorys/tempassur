"use client"

import { useMemo, useState } from "react"
import { useRouter } from "@/i18n/navigation"
import { ArrowRight } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { VEHICLE_TYPES } from "@/lib/constants"
import { getAvailableDurations, getMinPriceForDuration, getPreselectedDuration } from "@/lib/pricing"
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
  const [duree, setDuree] = useState<number>(() => getPreselectedDuration("automobiles"))

  const preselected = useMemo(() => getPreselectedDuration(category), [category])
  const allDurations = useMemo(() => getAvailableDurations(category, { duree: null, isDomTom: false }), [category])
  const price = useMemo(() => (duree ? getMinPriceForDuration(category, duree, false) : null), [category, duree])

  function handleCategoryChange(value: string) {
    const slug = value as VehicleSlug
    setCategory(slug)
    setDuree(getPreselectedDuration(slug))
  }

  function handleSouscription() {
    router.push(`/souscription?categorie=${category}&duree=${duree || preselected}`)
  }

  return (
    <div id="tarificateur" className="scroll-mt-28 rounded-3xl border border-border bg-white p-5 shadow-xl shadow-slate-900/10 sm:p-6">
      <h2 className="text-base font-bold text-navy">{t("title")}</h2>

      <div className="mt-5 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="tarificateur-category" className="text-sm font-medium text-foreground">
            {t("categoryLabel")}
          </label>
          <Select value={category} onValueChange={handleCategoryChange}>
            <SelectTrigger id="tarificateur-category" className="h-11 w-full rounded-lg">
              <SelectValue placeholder={t("categoryPlaceholder")}>{tVehicles(`${category}.label`)}</SelectValue>
            </SelectTrigger>
            <SelectContent position="popper" className="max-h-72 w-(--radix-select-trigger-width)">
              {VEHICLE_TYPES.map((v) => (
                <SelectItem key={v.slug} value={v.slug}>
                  <span className="flex flex-col gap-0.5 py-0.5">
                    <span>{tVehicles(`${v.slug}.label`)}</span>
                    <span className="text-xs text-muted-foreground">{tVehicles(`${v.slug}.description`)}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">{tVehicles(`${category}.description`)}</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">{t("durationLabel")}</label>
          <Select value={duree ? String(duree) : undefined} onValueChange={(v) => setDuree(Number(v))}>
            <SelectTrigger className="h-11 w-full rounded-lg">
              <SelectValue placeholder={t("durationPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {allDurations.map((d) => {
                const optionPrice = getMinPriceForDuration(category, d, false)
                return (
                  <SelectItem key={d} value={String(d)}>
                    {t("durationOption", { count: d })}
                    {optionPrice != null ? ` — ${currency.format(optionPrice)}` : ""}
                    {d === preselected ? ` · ${t("mostChosen")}` : ""}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-2xl bg-surface p-3.5">
          <p className="text-xl font-extrabold tracking-tight text-navy">
            {price != null ? t("priceFrom", { price: currency.format(price / duree) }) : t("pricePlaceholder")}
          </p>
        </div>

        <Button type="button" size="lg" variant="cta" className="w-full rounded-full" onClick={handleSouscription}>
          {t("cta")}
          <ArrowRight data-icon="inline-end" />
        </Button>
      </div>
    </div>
  )
}
