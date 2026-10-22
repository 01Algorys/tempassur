import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DetailField, DetailSectionLabel } from "@/components/admin/detail-field"
import { VehicleDetailsCard } from "@/components/admin/vehicle-details-card"
import {
  CATEGORIES,
  CATEGORIE_LABELS,
  allDetailFields,
  formatDetailValue,
  natureRemunerationLabel,
  sousCategorieLabel,
  type Categorie,
  type FieldDef,
} from "@/lib/admin/categories"
import { DEVIS_PIPELINE_LABELS, currencyFmt, dateFmt, dateTimeFmt } from "@/lib/admin/labels"
import type { ContratRecord, DevisRecord } from "@/lib/admin/crm-types"

const money = (v: number | null | undefined) => (v === null || v === undefined ? "—" : currencyFmt(v))
const dash = (v: unknown) => (v === null || v === undefined || v === "" ? "—" : String(v))

// Fiche complète d'un devis/contrat : tous les champs, y compris vides, pour
// que rien ne soit masqué. Les champs de catégorie viennent du catalogue ;
// une clé de `details` inconnue du catalogue est affichée telle quelle.
export function DossierDetails({ kind, record }: { kind: "devis" | "contrat"; record: DevisRecord | ContratRecord }) {
  const devis = kind === "devis" ? (record as DevisRecord) : null
  const contrat = kind === "contrat" ? (record as ContratRecord) : null
  const details = record.details ?? {}
  const categorie = record.categorie as Categorie | null

  const catFields: FieldDef[] = categorie
    ? CATEGORIES[categorie].fields.filter((f) => !f.showIf || f.showIf(details, record.sousCategorie ?? ""))
    : []
  const knownKeys = new Set(allDetailFields().map((f) => f.key))
  const shownKeys = new Set(catFields.map((f) => f.key))
  const extraKeys = Object.keys(details).filter((k) => !shownKeys.has(k) && details[k] !== "" && details[k] !== null)
  const sections = [...new Set(catFields.map((f) => f.section))]

  const valueOf = (f: FieldDef) => {
    if (contrat && f.contratColumn) {
      const v = contrat[f.contratColumn]
      if (f.contratColumn === "dateEffet") return v ? dateTimeFmt(v as string) : formatDetailValue(f, details[f.key]) || "—"
      if (v !== null && v !== undefined && v !== "") return String(v)
    }
    return formatDetailValue(f, details[f.key]) || "—"
  }

  const hasStructured = !!categorie || Object.keys(details).length > 0

  return (
    <>
      <Card className="lg:col-span-2">
        <CardHeader><CardTitle>Détails du {kind === "devis" ? "devis" : "contrat"}</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-sm">
          <DetailSectionLabel>Général</DetailSectionLabel>
          <DetailField label="Numéro" value={dash(record.numero)} />
          {contrat ? <DetailField label="N° de demande" value={dash(contrat.numeroDemande)} /> : null}
          <DetailField label="Catégorie" value={categorie ? CATEGORIE_LABELS[categorie] : "—"} />
          <DetailField
            label={categorie ? CATEGORIES[categorie].sousCategorieLabel : "Sous-catégorie"}
            value={sousCategorieLabel(categorie, record.sousCategorie) || "—"}
          />
          {devis ? (
            <DetailField label="Statut" value={DEVIS_PIPELINE_LABELS[devis.statutPipeline] ?? devis.statutPipeline} />
          ) : (
            <DetailField label="Statut" value={contrat?.statutRef?.nom ?? "—"} />
          )}
          <DetailField label="Produit" value={(devis ? devis.produit?.nom : contrat?.produitRef?.nom) ?? "—"} />
          <DetailField label="Distributeur" value={record.distributeur?.nom ?? "—"} />
          {devis ? (
            <>
              <DetailField label="Montant estimé" value={money(devis.montantEstime)} />
              <DetailField label="Probabilité" value={devis.probabilite !== null ? `${devis.probabilite}%` : "—"} />
              <DetailField label="Date de relance" value={dateFmt(devis.dateRelance)} />
              <DetailField label="Motif de perte" value={dash(devis.motifPerte)} />
              <DetailField label="Créé le" value={dateTimeFmt(devis.dateCreation ?? devis.createdAt)} />
            </>
          ) : null}

          {contrat ? (
            <>
              <DetailSectionLabel>Dates</DetailSectionLabel>
              <DetailField label="Souscrit le" value={dateFmt(contrat.dateSouscription)} />
              <DetailField label="Date d'effet" value={dateTimeFmt(contrat.dateEffet)} />
              <DetailField label="Durée" value={contrat.dureeJours ? `${contrat.dureeJours} jours` : "—"} />
              <DetailField label="Date de début" value={dateFmt(contrat.dateDebut)} />
              <DetailField label="Date de fin" value={dateFmt(contrat.dateFin)} />
              <DetailField label="Date de rappel" value={dateFmt(contrat.dateRappel)} />
              <DetailField label="Résilié le" value={dateFmt(contrat.dateResiliation)} />
              <DetailField label="Motif de résiliation" value={dash(contrat.motifResiliation)} />
              <DetailField label="Créé le" value={dateTimeFmt(contrat.createdAt)} />
              {categorie !== "TEMPASSUR" && (contrat.marque || contrat.modele || contrat.immatriculation) ? (
                <>
                  <DetailField label="Véhicule" value={`${contrat.marque ?? ""} ${contrat.modele ?? ""}`.trim() || "—"} />
                  <DetailField label="Immatriculation" value={dash(contrat.immatriculation)} />
                </>
              ) : null}
            </>
          ) : null}

          <DetailSectionLabel>Rémunération</DetailSectionLabel>
          <DetailField label="Encaissement" value={money(record.encaissement)} />
          <DetailField label="Prime" value={money(record.prime)} />
          <DetailField label="Honoraires" value={money(record.honoraires)} />
          <DetailField label="Nature de rémunération" value={natureRemunerationLabel(record.natureRemuneration) || "—"} />

          {sections.map((section) => (
            <SectionFields key={section} title={section} fields={catFields.filter((f) => f.section === section)} valueOf={valueOf} />
          ))}

          {extraKeys.length > 0 ? (
            <>
              <DetailSectionLabel>Autres champs</DetailSectionLabel>
              {extraKeys.map((k) => (
                <DetailField
                  key={k}
                  label={allDetailFields().find((f) => f.key === k)?.label ?? k}
                  value={formatDetailValue(knownKeys.has(k) ? allDetailFields().find((f) => f.key === k) : undefined, details[k]) || "—"}
                />
              ))}
            </>
          ) : null}

          <DetailSectionLabel>Note</DetailSectionLabel>
          <DetailField label="Note" value={dash(devis ? devis.notes : contrat?.notesInternes)} full />
        </CardContent>
      </Card>

      {/* Dossiers créés avant la migration : seul le texte libre existe. */}
      {!hasStructured && record.besoinsExprimes ? <VehicleDetailsCard besoinsExprimes={record.besoinsExprimes} /> : null}
    </>
  )
}

function SectionFields({ title, fields, valueOf }: { title: string; fields: FieldDef[]; valueOf: (f: FieldDef) => string }) {
  return (
    <>
      <DetailSectionLabel>{title}</DetailSectionLabel>
      {fields.map((f) => (
        <DetailField key={f.key} label={f.label} value={valueOf(f)} full={f.full || f.type === "textarea"} />
      ))}
    </>
  )
}
