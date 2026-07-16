import { Info, ShieldCheck } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PRICE_LINE_TRANSLATION_KEYS, type PriceBreakdown } from "@/lib/pricing"

interface BillingSummaryProps {
  vehicleLabel: string
  icon?: LucideIcon
  duree: number | null
  tierLabel?: string
  isDomTom: boolean
  breakdown: PriceBreakdown | null
}

export function BillingSummary({ vehicleLabel, icon: Icon, duree, tierLabel, isDomTom, breakdown }: BillingSummaryProps) {
  const t = useTranslations("wizard.billingSummary")
  const tOptions = useTranslations("wizard.options")

  return (
    <Card className="rounded-3xl border border-border bg-white shadow-xl shadow-slate-900/10 lg:sticky lg:top-28">
      <CardHeader className="gap-3">
        <div className="flex items-center gap-3">
          {Icon ? (
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary text-navy">
              <Icon className="size-5" strokeWidth={1.8} />
            </span>
          ) : null}
          <div>
            <CardTitle className="text-base font-bold text-navy">{vehicleLabel}</CardTitle>
            <p className="text-xs text-muted-foreground">{t("subtitle")}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <dl className="flex flex-col gap-2 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">{t("duree")}</dt>
            <dd className="font-semibold text-navy">{duree ? t("durationValue", { count: duree }) : t("noValue")}</dd>
          </div>
          {tierLabel ? (
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">{t("formule")}</dt>
              <dd className="font-semibold text-navy">{tierLabel}</dd>
            </div>
          ) : null}
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">{t("zone")}</dt>
            <dd className="font-semibold text-navy">{isDomTom ? t("zoneDomTom") : t("zoneMetropole")}</dd>
          </div>
        </dl>

        <div className="h-px bg-border" />

        {breakdown ? (
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t("tarifBase")}</span>
              <span className="font-medium text-foreground">{breakdown.basePrice.toFixed(2)} €</span>
            </div>
            {breakdown.zoneSurcharge != null ? (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t("zoneDomTomSurcharge")}</span>
                <span className="font-medium text-foreground">
                  {breakdown.zoneSurcharge >= 0 ? "+" : ""}
                  {breakdown.zoneSurcharge.toFixed(2)} €
                </span>
              </div>
            ) : null}
            {breakdown.lines.map((line) => (
              <div key={line.key} className="flex items-center justify-between">
                <span className="text-muted-foreground">{tOptions(PRICE_LINE_TRANSLATION_KEYS[line.key])}</span>
                <span className="font-medium text-foreground">+{line.amount.toFixed(2)} €</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-start gap-2 rounded-xl bg-secondary px-3 py-2.5 text-xs text-muted-foreground">
            <Info className="mt-0.5 size-3.5 shrink-0" />
            {t("selectDuration")}
          </div>
        )}

        <div className="h-px bg-border" />

        <div className="flex items-end justify-between">
          <span className="text-sm font-semibold text-navy">{t("totalToPay")}</span>
          <span className="text-3xl font-extrabold tracking-tight text-orange">
            {breakdown ? `${breakdown.total.toFixed(2)} €` : `— €`}
          </span>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-secondary px-3 py-2.5 text-xs font-medium text-navy">
          <ShieldCheck className="size-4 shrink-0 text-primary" />
          {t("securePayment")}
        </div>
      </CardContent>
    </Card>
  )
}
