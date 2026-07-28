import { Car, CalendarClock, ShieldCheck, Fingerprint, Info } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DetailField } from "@/components/admin/detail-field"
import { parseBesoinsExprimes } from "@/lib/admin/besoins-exprimes"

// Renders the structured wizard data (vehicle sub-category, duration, effect date/time,
// selected options, driver info) that only exists as free text inside
// Devis/Contrat.besoinsExprimes — see lib/admin/besoins-exprimes.ts for why.
export function VehicleDetailsCard({ besoinsExprimes }: { besoinsExprimes: string | null | undefined }) {
  const parsed = parseBesoinsExprimes(besoinsExprimes)
  const hasAnything =
    parsed.vehicule ||
    parsed.sousCategorie ||
    parsed.marqueModele ||
    parsed.immatriculation ||
    parsed.miseEnCirculation ||
    parsed.paysImmatriculation ||
    parsed.location ||
    parsed.paysResidence ||
    parsed.duree ||
    parsed.dateEffet ||
    parsed.options.length > 0 ||
    parsed.conducteurNe ||
    parsed.permis ||
    parsed.unparsed.length > 0

  if (!hasAnything) return null

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="size-4.5 text-muted-foreground" />
          Véhicule &amp; garanties
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4 text-sm">
        {parsed.vehicule ? <DetailField label="Véhicule" value={parsed.vehicule} /> : null}
        {parsed.sousCategorie ? <DetailField label="Sous-catégorie" value={parsed.sousCategorie} /> : null}
        {parsed.marqueModele ? <DetailField label="Marque / modèle" value={parsed.marqueModele} /> : null}
        {parsed.immatriculation ? <DetailField label="Immatriculation" value={parsed.immatriculation} /> : null}
        {parsed.miseEnCirculation ? (
          <DetailField label="1ère mise en circulation" value={parsed.miseEnCirculation} />
        ) : null}
        {parsed.paysImmatriculation ? (
          <DetailField label="Pays d'immatriculation" value={parsed.paysImmatriculation} />
        ) : null}
        {parsed.location ? <DetailField label="Véhicule de location" value={parsed.location} /> : null}

        {parsed.duree || parsed.dateEffet ? (
          <>
            <div className="col-span-2 flex items-center gap-1.5 border-t border-border pt-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              <CalendarClock className="size-3.5" /> Durée &amp; effet
            </div>
            {parsed.duree ? <DetailField label="Durée souhaitée" value={parsed.duree} /> : null}
            {parsed.dateEffet ? <DetailField label="Date d'effet souhaitée" value={parsed.dateEffet} /> : null}
          </>
        ) : null}

        <div className="col-span-2 flex items-center gap-1.5 border-t border-border pt-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          <ShieldCheck className="size-3.5" /> Options souscrites
        </div>
        <div className="col-span-2 flex flex-wrap gap-1.5">
          {parsed.options.length > 0 ? (
            parsed.options.map((option) => (
              <Badge key={option} variant="outline" className="border-transparent bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                {option}
              </Badge>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">Aucune option souscrite.</p>
          )}
        </div>

        {parsed.conducteurNe || parsed.permis || parsed.paysResidence ? (
          <>
            <div className="col-span-2 flex items-center gap-1.5 border-t border-border pt-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              <Fingerprint className="size-3.5" /> Conducteur
            </div>
            {parsed.conducteurNe ? <DetailField label="Né(e) le" value={parsed.conducteurNe} /> : null}
            {parsed.permis ? <DetailField label="Permis" value={`N° ${parsed.permis}`} /> : null}
            {parsed.paysResidence ? <DetailField label="Pays de résidence" value={parsed.paysResidence} /> : null}
          </>
        ) : null}

        {parsed.unparsed.length > 0 ? (
          <>
            <div className="col-span-2 flex items-center gap-1.5 border-t border-border pt-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              <Info className="size-3.5" /> Autres informations
            </div>
            <ul className="col-span-2 list-inside list-disc space-y-1 text-sm text-foreground">
              {parsed.unparsed.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </>
        ) : null}
      </CardContent>
    </Card>
  )
}
