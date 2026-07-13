import { Info, ShieldCheck } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { PriceBreakdown } from "@/lib/pricing"

interface BillingSummaryProps {
  vehicleLabel: string
  icon?: LucideIcon
  duree: number | null
  tierLabel?: string
  isDomTom: boolean
  breakdown: PriceBreakdown | null
}

export function BillingSummary({ vehicleLabel, icon: Icon, duree, tierLabel, isDomTom, breakdown }: BillingSummaryProps) {
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
            <p className="text-xs text-muted-foreground">Assurance temporaire</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <dl className="flex flex-col gap-2 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Durée</dt>
            <dd className="font-semibold text-navy">{duree ? `${duree} jour${duree > 1 ? "s" : ""}` : "—"}</dd>
          </div>
          {tierLabel ? (
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Formule</dt>
              <dd className="font-semibold text-navy">{tierLabel}</dd>
            </div>
          ) : null}
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Zone</dt>
            <dd className="font-semibold text-navy">{isDomTom ? "DOM-TOM" : "France métropolitaine"}</dd>
          </div>
        </dl>

        <div className="h-px bg-border" />

        {breakdown ? (
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Tarif de base</span>
              <span className="font-medium text-foreground">{breakdown.basePrice.toFixed(2)} €</span>
            </div>
            {breakdown.lines.map((line) => (
              <div key={line.label} className="flex items-center justify-between">
                <span className="text-muted-foreground">{line.label}</span>
                <span className="font-medium text-foreground">+{line.amount.toFixed(2)} €</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-start gap-2 rounded-xl bg-secondary px-3 py-2.5 text-xs text-muted-foreground">
            <Info className="mt-0.5 size-3.5 shrink-0" />
            Sélectionnez une durée pour afficher le tarif.
          </div>
        )}

        <div className="h-px bg-border" />

        <div className="flex items-end justify-between">
          <span className="text-sm font-semibold text-navy">Total à payer</span>
          <span className="text-3xl font-extrabold tracking-tight text-orange">
            {breakdown ? `${breakdown.total.toFixed(2)} €` : "— €"}
          </span>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-secondary px-3 py-2.5 text-xs font-medium text-navy">
          <ShieldCheck className="size-4 shrink-0 text-primary" />
          Paiement sécurisé, prise d&apos;effet immédiate.
        </div>
      </CardContent>
    </Card>
  )
}
