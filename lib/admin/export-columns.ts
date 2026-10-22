import {
  CATEGORIE_LABELS,
  allDetailFields,
  formatDetailValue,
  natureRemunerationLabel,
  sousCategorieLabel,
  type Categorie,
} from "@/lib/admin/categories"
import { DEVIS_PIPELINE_LABELS } from "@/lib/admin/labels"
import {
  allEmails,
  allPhones,
  clientFullName,
  type ClientRecord,
  type ContratRecord,
  type DevisRecord,
  type DocumentRecord,
  type TacheRecord,
} from "@/lib/admin/crm-types"

// Colonnes proposées dans la modale d'export. "Tout sélectionner" = toutes ces
// colonnes, qui couvrent chaque champ de l'enregistrement : champs propres,
// fiche client complète, et chaque clé de `details` (catalogue + clés inconnues
// trouvées dans les données, pour ne rien perdre).
export interface ExportColumn<T> {
  key: string
  label: string
  group: string
  value: (row: T) => unknown
}

const date = (v: string | null | undefined) => (v ? new Date(v).toLocaleDateString("fr-FR") : "")
const dateTime = (v: string | null | undefined) => (v ? new Date(v).toLocaleString("fr-FR") : "")
const yesNo = (v: boolean | null | undefined) => (v === undefined || v === null ? "" : v ? "Oui" : "Non")

export function clientColumns<T>(get: (row: T) => ClientRecord | null | undefined, group = "Client"): ExportColumn<T>[] {
  const c = (key: string, label: string, value: (client: ClientRecord) => unknown): ExportColumn<T> => ({
    key: `client.${key}`,
    label: group === "Client" ? `Client — ${label}` : label,
    group,
    value: (row) => {
      const client = get(row)
      return client ? value(client) : ""
    },
  })
  return [
    c("statutRelation", "Statut", (x) => (x.statutRelation === "CLIENT" ? "Client" : "Prospect")),
    c("type", "Type", (x) => (x.type === "PROFESSIONNEL" ? "Professionnel" : "Particulier")),
    c("civilite", "Civilité", (x) => x.civilite),
    c("nom", "Nom", (x) => x.nom),
    c("prenom", "Prénom", (x) => x.prenom),
    c("nomComplet", "Nom complet", (x) => clientFullName(x)),
    c("raisonSociale", "Raison sociale", (x) => x.raisonSociale),
    c("siret", "SIRET", (x) => x.siret),
    c("secteurActivite", "Secteur d'activité", (x) => x.secteurActivite),
    c("telephones", "Téléphones", (x) => allPhones(x).join(" / ")),
    c("emails", "Emails", (x) => allEmails(x).join(" / ")),
    c("adresse", "Adresse", (x) => x.adresse),
    c("codePostal", "Code postal", (x) => x.codePostal),
    c("ville", "Ville", (x) => x.ville),
    c("pays", "Pays", (x) => x.pays),
    c("nationalite", "Nationalité", (x) => x.nationalite),
    c("dateNaissance", "Date de naissance", (x) => date(x.dateNaissance)),
    c("paysNaissance", "Pays de naissance", (x) => x.paysNaissance),
    c("paysResidence", "Pays de résidence", (x) => x.paysResidence),
    c("territoireResidence", "Territoire de résidence", (x) => x.territoireResidence),
    c("numeroPermis", "N° de permis", (x) => x.numeroPermis),
    c("paysPermis", "Pays du permis", (x) => x.paysPermis),
    c("dateObtentionPermis", "Date d'obtention du permis", (x) => date(x.dateObtentionPermis)),
    c("isVip", "VIP", (x) => yesNo(x.isVip)),
    c("notes", "Notes", (x) => x.notes),
    c("createdAt", "Créé le", (x) => dateTime(x.createdAt)),
  ]
}

function detailColumns<T extends { categorie: string | null; details: Record<string, unknown> | null }>(rows: T[]): ExportColumn<T>[] {
  const known = allDetailFields()
  const knownKeys = new Set(known.map((f) => f.key))
  const extraKeys = new Set<string>()
  for (const row of rows) for (const key of Object.keys(row.details ?? {})) if (!knownKeys.has(key)) extraKeys.add(key)

  return [
    ...known.map((f) => ({
      key: `details.${f.key}`,
      label: f.label,
      group: "Détails",
      value: (row: T) => formatDetailValue(f, row.details?.[f.key]),
    })),
    ...[...extraKeys].map((key) => ({
      key: `details.${key}`,
      label: key,
      group: "Détails",
      value: (row: T) => formatDetailValue(undefined, row.details?.[key]),
    })),
  ]
}

function financeColumns<T extends DevisRecord | ContratRecord>(): ExportColumn<T>[] {
  return [
    { key: "encaissement", label: "Encaissement", group: "Rémunération", value: (r) => r.encaissement ?? "" },
    { key: "prime", label: "Prime", group: "Rémunération", value: (r) => r.prime ?? "" },
    { key: "honoraires", label: "Honoraires", group: "Rémunération", value: (r) => r.honoraires ?? "" },
    {
      key: "natureRemuneration",
      label: "Nature de rémunération",
      group: "Rémunération",
      value: (r) => natureRemunerationLabel(r.natureRemuneration),
    },
  ]
}

function categorieColumns<T extends DevisRecord | ContratRecord>(): ExportColumn<T>[] {
  return [
    { key: "categorie", label: "Catégorie", group: "Général", value: (r) => (r.categorie ? CATEGORIE_LABELS[r.categorie as Categorie] : "") },
    { key: "sousCategorie", label: "Sous-catégorie", group: "Général", value: (r) => sousCategorieLabel(r.categorie, r.sousCategorie) },
  ]
}

export function devisColumns(rows: DevisRecord[]): ExportColumn<DevisRecord>[] {
  return [
    { key: "numero", label: "Numéro", group: "Général", value: (r) => r.numero ?? "" },
    ...categorieColumns<DevisRecord>(),
    { key: "statutPipeline", label: "Statut", group: "Général", value: (r) => DEVIS_PIPELINE_LABELS[r.statutPipeline] ?? r.statutPipeline },
    { key: "montantEstime", label: "Montant estimé", group: "Général", value: (r) => r.montantEstime ?? "" },
    { key: "probabilite", label: "Probabilité (%)", group: "Général", value: (r) => r.probabilite ?? "" },
    { key: "produit", label: "Produit", group: "Général", value: (r) => r.produit?.nom ?? "" },
    { key: "distributeur", label: "Distributeur", group: "Général", value: (r) => r.distributeur?.nom ?? "" },
    { key: "dateRelance", label: "Date de relance", group: "Général", value: (r) => date(r.dateRelance) },
    { key: "motifPerte", label: "Motif de perte", group: "Général", value: (r) => r.motifPerte ?? "" },
    { key: "contratId", label: "Transformé en contrat", group: "Général", value: (r) => yesNo(!!r.contratId) },
    { key: "notes", label: "Note", group: "Général", value: (r) => r.notes ?? "" },
    { key: "createdAt", label: "Créé le", group: "Général", value: (r) => dateTime(r.dateCreation ?? r.createdAt) },
    { key: "updatedAt", label: "Mis à jour le", group: "Général", value: (r) => dateTime(r.updatedAt) },
    ...financeColumns<DevisRecord>(),
    ...detailColumns(rows),
    { key: "besoinsExprimes", label: "Besoins exprimés (ancien format)", group: "Détails", value: (r) => r.besoinsExprimes ?? "" },
    ...clientColumns<DevisRecord>((r) => r.client),
  ]
}

export function contratColumns(rows: ContratRecord[]): ExportColumn<ContratRecord>[] {
  return [
    { key: "numero", label: "Numéro", group: "Général", value: (r) => r.numero },
    { key: "numeroDemande", label: "N° de demande", group: "Général", value: (r) => r.numeroDemande ?? "" },
    ...categorieColumns<ContratRecord>(),
    { key: "statut", label: "Statut", group: "Général", value: (r) => r.statutRef?.nom ?? "" },
    { key: "produit", label: "Produit", group: "Général", value: (r) => r.produitRef?.nom ?? "" },
    { key: "distributeur", label: "Distributeur", group: "Général", value: (r) => r.distributeur?.nom ?? "" },
    { key: "marque", label: "Marque", group: "Général", value: (r) => r.marque ?? "" },
    { key: "modele", label: "Modèle", group: "Général", value: (r) => r.modele ?? "" },
    { key: "immatriculation", label: "Immatriculation", group: "Général", value: (r) => r.immatriculation ?? "" },
    { key: "dateSouscription", label: "Date de souscription", group: "Dates", value: (r) => date(r.dateSouscription) },
    { key: "dateEffet", label: "Date d'effet", group: "Dates", value: (r) => dateTime(r.dateEffet) },
    { key: "dureeJours", label: "Durée (jours)", group: "Dates", value: (r) => r.dureeJours ?? "" },
    { key: "dateDebut", label: "Date de début", group: "Dates", value: (r) => date(r.dateDebut) },
    { key: "dateFin", label: "Date de fin", group: "Dates", value: (r) => date(r.dateFin) },
    { key: "dateResiliation", label: "Date de résiliation", group: "Dates", value: (r) => date(r.dateResiliation) },
    { key: "motifResiliation", label: "Motif de résiliation", group: "Dates", value: (r) => r.motifResiliation ?? "" },
    { key: "dateRappel", label: "Date de rappel", group: "Dates", value: (r) => date(r.dateRappel) },
    { key: "notesInternes", label: "Note", group: "Général", value: (r) => r.notesInternes ?? "" },
    { key: "createdAt", label: "Créé le", group: "Dates", value: (r) => dateTime(r.createdAt) },
    { key: "updatedAt", label: "Mis à jour le", group: "Dates", value: (r) => dateTime(r.updatedAt) },
    ...financeColumns<ContratRecord>(),
    ...detailColumns(rows),
    { key: "besoinsExprimes", label: "Besoins exprimés (ancien format)", group: "Détails", value: (r) => r.besoinsExprimes ?? "" },
    ...clientColumns<ContratRecord>((r) => r.client),
  ]
}

export function clientListColumns(): ExportColumn<ClientRecord>[] {
  return [
    ...clientColumns<ClientRecord>((r) => r, "Fiche client"),
    { key: "nbContrats", label: "Nombre de contrats", group: "Activité", value: (r) => r._count?.contrats ?? "" },
    { key: "nbDevis", label: "Nombre de devis", group: "Activité", value: (r) => r._count?.devis ?? "" },
    { key: "nbDocuments", label: "Nombre de documents", group: "Activité", value: (r) => r._count?.documents ?? "" },
  ]
}

export function documentColumns(): ExportColumn<DocumentRecord>[] {
  return [
    { key: "nomAffiche", label: "Nom", group: "Document", value: (r) => r.nomAffiche ?? r.nom },
    { key: "nom", label: "Fichier d'origine", group: "Document", value: (r) => r.nom },
    { key: "type", label: "Catégorie", group: "Document", value: (r) => r.typeDocumentRef?.nom ?? "" },
    { key: "libelleAutre", label: "Précision", group: "Document", value: (r) => r.libelleAutre ?? "" },
    { key: "note", label: "Note", group: "Document", value: (r) => r.note ?? "" },
    { key: "statutDocument", label: "Statut", group: "Document", value: (r) => r.statutDocument },
    { key: "taille", label: "Taille (octets)", group: "Document", value: (r) => r.taille ?? "" },
    { key: "contrat", label: "Contrat", group: "Document", value: (r) => r.contrat?.numero ?? "" },
    { key: "devis", label: "Devis", group: "Document", value: (r) => r.devis?.numero ?? "" },
    { key: "createdAt", label: "Créé le", group: "Document", value: (r) => dateTime(r.createdAt) },
    ...clientColumns<DocumentRecord>((r) => r.client),
  ]
}

export function tacheColumns(): ExportColumn<TacheRecord>[] {
  return [
    { key: "titre", label: "Titre", group: "Tâche", value: (r) => r.titre },
    { key: "description", label: "Note", group: "Tâche", value: (r) => r.description ?? "" },
    { key: "statut", label: "Statut", group: "Tâche", value: (r) => (r.statut === "TRAITE" ? "Terminée" : r.statut === "ANNULE" ? "Annulée" : "En attente") },
    { key: "echeance", label: "Date", group: "Tâche", value: (r) => dateTime(r.echeance) },
    { key: "contrat", label: "Contrat", group: "Tâche", value: (r) => r.contrat?.numero ?? "" },
    { key: "devis", label: "Devis", group: "Tâche", value: (r) => r.devis?.numero ?? "" },
    { key: "createdAt", label: "Créée le", group: "Tâche", value: (r) => dateTime(r.createdAt) },
    ...clientColumns<TacheRecord>((r) => r.client ?? r.contrat?.client ?? r.devis?.client),
  ]
}
