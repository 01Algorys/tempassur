import { COUNTRIES, getCountryLabel } from "@/lib/countries"
import { MOTIF_SOUSCRIPTION_LABELS_FR, MOTIF_SOUSCRIPTION_VALUES } from "@/lib/motif-souscription"
import { TIER_LABELS } from "@/lib/admin/labels"
import { getPricingConfig } from "@/lib/pricing"
import { VEHICLE_SLUGS, type VehicleSlug } from "@/types"

const isVehicleSlug = (s: string): s is VehicleSlug => (VEHICLE_SLUGS as readonly string[]).includes(s)

// Catalogue des formulaires devis/contrat par catégorie. Une seule source pour
// le formulaire (dossier-form-dialog), la fiche détail (dossier-details) et les
// exports (export-columns) : ajouter un champ ici le fait apparaître partout.
// Les valeurs saisies sont stockées dans Devis/Contrat.details (JSON) côté CRM.

export type Categorie = "TEMPASSUR" | "VITRE_ASSUR" | "AUTRE"

export type FieldType = "text" | "textarea" | "number" | "date" | "time" | "boolean" | "select"

export interface Option {
  value: string
  label: string
}

export interface FieldDef {
  key: string
  label: string
  type: FieldType
  options?: Option[]
  section: string
  // Affiché seulement si la condition est vraie (valeurs courantes du formulaire).
  showIf?: (details: Record<string, unknown>, sousCategorie: string) => boolean
  // Sur un contrat, ce champ correspond à une vraie colonne du CRM (lue par
  // wn-conseil-web-app) plutôt qu'à une clé de `details`.
  contratColumn?: "marque" | "modele" | "immatriculation" | "dateEffet" | "dureeJours"
  full?: boolean
}

export interface CategorieDef {
  value: Categorie
  label: string
  sousCategorieLabel: string
  // Liste fermée de sous-catégories ; absente = saisie libre (catégorie "Autre").
  sousCategories?: Option[]
  fields: FieldDef[]
}

export const CATEGORIE_LABELS: Record<Categorie, string> = {
  TEMPASSUR: "TempAssur",
  VITRE_ASSUR: "Vitre Assur",
  AUTRE: "Autre",
}

const opts = (labels: string[]): Option[] => labels.map((l) => ({ value: l, label: l }))

const COUNTRY_OPTIONS: Option[] = COUNTRIES.map((c) => ({ value: c.code, label: getCountryLabel(c.code, "fr", "Autre pays") }))

const TERRITORY_OPTIONS: Option[] = [
  { value: "metropole", label: "France métropolitaine" },
  { value: "guadeloupe", label: "Guadeloupe" },
  { value: "martinique", label: "Martinique" },
  { value: "guyane", label: "Guyane" },
  { value: "reunion", label: "La Réunion" },
  { value: "mayotte", label: "Mayotte" },
  { value: "saint-martin", label: "Saint-Martin" },
  { value: "saint-barthelemy", label: "Saint-Barthélemy" },
  { value: "saint-pierre-et-miquelon", label: "Saint-Pierre-et-Miquelon" },
]

const tierOptions = (values: string[]): Option[] => values.map((v) => ({ value: v, label: TIER_LABELS[v] ?? v }))

// --- TempAssur : mêmes champs que le tunnel de souscription -----------------

export const TEMPASSUR_SOUS_CATEGORIES: Option[] = [
  { value: "automobiles", label: "Automobile" },
  { value: "poids-lourds", label: "Poids lourd" },
  { value: "camping-cars", label: "Camping-car" },
  { value: "quadricycles", label: "Quadricycles" },
  { value: "bus-autocars", label: "Bus, autocars" },
  { value: "tracteurs-agricoles", label: "Tracteur agricole" },
  { value: "remorques", label: "Remorques" },
  { value: "assurance-frontiere", label: "Assurance frontière" },
]

const TEMPASSUR_FIELDS: FieldDef[] = [
  {
    key: "cvTier",
    label: "Puissance fiscale",
    type: "select",
    options: tierOptions(["moins-16cv", "moins-30cv", "plus-30cv"]),
    section: "Véhicule",
    showIf: (_d, s) => isVehicleSlug(s) && getPricingConfig(s).needsCvTier,
  },
  {
    key: "ptacTier",
    label: "PTAC",
    type: "select",
    options: tierOptions(["moins-3500kg", "plus-3500kg"]),
    section: "Véhicule",
    showIf: (_d, s) => isVehicleSlug(s) && getPricingConfig(s).needsPtacTier,
  },
  {
    key: "quadSubtype",
    label: "Type de quadricycle",
    type: "select",
    options: tierOptions(["voiturette-sans-permis", "buggy", "quad-avec-permis"]),
    section: "Véhicule",
    showIf: (_d, s) => isVehicleSlug(s) && getPricingConfig(s).needsQuadSubtype,
  },
  { key: "marque", label: "Marque", type: "text", section: "Véhicule", contratColumn: "marque" },
  { key: "modele", label: "Modèle", type: "text", section: "Véhicule", contratColumn: "modele" },
  { key: "immatriculation", label: "Immatriculation", type: "text", section: "Véhicule", contratColumn: "immatriculation" },
  { key: "dateMiseEnCirculation", label: "1ère mise en circulation", type: "date", section: "Véhicule" },
  { key: "paysImmatriculation", label: "Pays d'immatriculation", type: "select", options: COUNTRY_OPTIONS, section: "Véhicule" },
  {
    key: "territoireImmatriculation",
    label: "Territoire d'immatriculation",
    type: "select",
    options: TERRITORY_OPTIONS,
    section: "Véhicule",
    showIf: (d) => d.paysImmatriculation === "FR",
  },
  { key: "estVehiculeLocation", label: "Véhicule de location", type: "boolean", section: "Véhicule" },
  {
    key: "nomAgenceLocation",
    label: "Agence de location",
    type: "text",
    section: "Véhicule",
    showIf: (d) => d.estVehiculeLocation === true,
  },

  { key: "duree", label: "Durée (jours)", type: "number", section: "Durée & effet", contratColumn: "dureeJours" },
  { key: "dateEffet", label: "Date d'effet", type: "date", section: "Durée & effet", contratColumn: "dateEffet" },
  { key: "heureEffet", label: "Heure d'effet", type: "time", section: "Durée & effet" },

  { key: "optionAssistance", label: "Option assistance", type: "boolean", section: "Options" },
  { key: "optionGarantieConducteur", label: "Option garantie conducteur", type: "boolean", section: "Options" },
  { key: "optionExtensionTn", label: "Option extension territoriale", type: "boolean", section: "Options" },

  { key: "paysResidence", label: "Pays de résidence", type: "select", options: COUNTRY_OPTIONS, section: "Conducteur" },
  {
    key: "territoireResidence",
    label: "Territoire de résidence",
    type: "select",
    options: TERRITORY_OPTIONS,
    section: "Conducteur",
    showIf: (d) => d.paysResidence === "FR",
  },
  { key: "dateNaissance", label: "Date de naissance du conducteur", type: "date", section: "Conducteur" },
  { key: "paysNaissance", label: "Pays de naissance", type: "select", options: COUNTRY_OPTIONS, section: "Conducteur" },
  { key: "numeroPermis", label: "N° de permis", type: "text", section: "Conducteur" },
  { key: "dateObtentionPermis", label: "Date d'obtention du permis", type: "date", section: "Conducteur" },
  { key: "paysObtentionPermis", label: "Pays d'obtention du permis", type: "select", options: COUNTRY_OPTIONS, section: "Conducteur" },

  {
    key: "motifSouscription",
    label: "Motif de souscription",
    type: "select",
    options: MOTIF_SOUSCRIPTION_VALUES.map((v) => ({ value: v, label: MOTIF_SOUSCRIPTION_LABELS_FR[v] })),
    section: "Souscription",
  },
  {
    key: "motifSouscriptionAutre",
    label: "Motif (précision)",
    type: "text",
    section: "Souscription",
    showIf: (d) => d.motifSouscription === "autre",
  },
  { key: "autresInformations", label: "Autres informations", type: "textarea", section: "Souscription", full: true },
]

// --- Vitre Assur : questions du formulaire de devis du site vitre-assur ------

export const VITRE_ASSUR_SOUS_CATEGORIES: Option[] = [
  { value: "auto", label: "Auto" },
  { value: "taxi-vtc", label: "Taxi / VTC" },
  { value: "moto", label: "Moto" },
  { value: "decennale", label: "Décennale" },
  { value: "rc-pro", label: "RC Pro" },
  { value: "emprunteur", label: "Emprunteur" },
  { value: "sante", label: "Santé" },
  { value: "habitation", label: "Habitation" },
]

const forProduct = (...products: string[]) => (_d: Record<string, unknown>, s: string) => products.includes(s)

const VITRE_ASSUR_FIELDS: FieldDef[] = [
  // Questions propres au produit
  { key: "vehicule", label: "Type de véhicule", type: "select", options: opts(["Citadine", "Berline / SUV", "Utilitaire", "Véhicule de collection"]), section: "Besoin", showIf: forProduct("auto") },
  { key: "formule", label: "Formule souhaitée", type: "select", options: opts(["Au tiers", "Intermédiaire", "Tous risques", "Je ne sais pas"]), section: "Besoin", showIf: forProduct("auto") },
  { key: "profil", label: "Profil conducteur", type: "select", options: opts(["Bonus", "Jeune permis (< 3 ans)", "Malus", "Résilié"]), section: "Besoin", showIf: forProduct("auto") },
  { key: "activite", label: "Activité", type: "select", options: opts(["VTC", "Taxi", "Taxi conventionné", "Flotte / société"]), section: "Besoin", showIf: forProduct("taxi-vtc") },
  { key: "anciennete", label: "Ancienneté de l'activité", type: "select", options: opts(["Création", "Moins de 2 ans", "2 à 5 ans", "Plus de 5 ans"]), section: "Besoin", showIf: forProduct("taxi-vtc") },
  { key: "cylindree", label: "Cylindrée", type: "select", options: opts(["50 cm³ / scooter", "125 cm³", "Moins de 600 cm³", "600 cm³ et plus"]), section: "Besoin", showIf: forProduct("moto") },
  { key: "permis", label: "Permis", type: "select", options: opts(["Permis B + formation", "A1", "A2", "A"]), section: "Besoin", showIf: forProduct("moto") },
  { key: "usage", label: "Usage principal", type: "select", options: opts(["Loisir", "Trajets quotidiens", "Professionnel"]), section: "Besoin", showIf: forProduct("moto") },
  { key: "metier", label: "Corps de métier", type: "select", options: opts(["Gros œuvre / maçonnerie", "Plomberie / chauffage", "Électricité", "Second œuvre / finitions", "Toiture / étanchéité", "Autre"]), section: "Besoin", showIf: forProduct("decennale") },
  { key: "ancienneteEntreprise", label: "Ancienneté de l'entreprise", type: "select", options: opts(["Création", "Moins de 3 ans", "3 ans et plus"]), section: "Besoin", showIf: forProduct("decennale") },
  { key: "secteur", label: "Secteur d'activité", type: "select", options: opts(["Conseil / services", "Informatique / digital", "Commerce", "Santé / bien-être", "Artisanat", "Autre"]), section: "Besoin", showIf: forProduct("rc-pro") },
  { key: "chiffreAffaires", label: "Chiffre d'affaires annuel", type: "select", options: opts(["Moins de 50 k€", "50 à 200 k€", "200 k€ à 1 M€", "Plus de 1 M€"]), section: "Besoin", showIf: forProduct("rc-pro") },
  { key: "projet", label: "Projet", type: "select", options: opts(["Nouveau prêt", "Changer d'assurance (prêt en cours)", "Rachat de crédit"]), section: "Besoin", showIf: forProduct("emprunteur") },
  { key: "montantEmprunte", label: "Montant emprunté", type: "select", options: opts(["Moins de 150 k€", "150 à 300 k€", "300 à 500 k€", "Plus de 500 k€"]), section: "Besoin", showIf: forProduct("emprunteur") },
  { key: "emprunteurs", label: "Nombre d'emprunteurs", type: "select", options: opts(["Seul(e)", "À deux"]), section: "Besoin", showIf: forProduct("emprunteur") },
  { key: "beneficiaires", label: "Personnes à couvrir", type: "select", options: opts(["Moi seul(e)", "En couple", "Famille", "Senior"]), section: "Besoin", showIf: forProduct("sante") },
  { key: "priorite", label: "Priorité", type: "select", options: opts(["Hospitalisation", "Optique", "Dentaire", "Médecines douces"]), section: "Besoin", showIf: forProduct("sante") },
  { key: "logement", label: "Type de logement", type: "select", options: opts(["Appartement", "Maison", "Résidence secondaire", "Bien mis en location"]), section: "Besoin", showIf: forProduct("habitation") },
  { key: "occupant", label: "Occupant", type: "select", options: opts(["Locataire", "Propriétaire occupant", "Propriétaire non occupant"]), section: "Besoin", showIf: forProduct("habitation") },
  { key: "pieces", label: "Nombre de pièces", type: "select", options: opts(["1 – 2", "3 – 4", "5 et plus"]), section: "Besoin", showIf: forProduct("habitation") },

  // Questions communes à tous les produits
  { key: "statutProfessionnel", label: "Vous êtes", type: "select", options: opts(["Particulier", "Indépendant / auto-entrepreneur", "Profession libérale", "Entreprise / société"]), section: "Situation" },
  { key: "echeance", label: "Échéance souhaitée", type: "select", options: opts(["Dès que possible", "Dans le mois", "Dans 1 à 3 mois", "Je me renseigne"]), section: "Situation" },
  { key: "dejaAssure", label: "Actuellement assuré(e)", type: "select", options: opts(["Oui", "Non", "Contrat résilié par l'assureur"]), section: "Situation" },
  { key: "creneauRappel", label: "Créneau de rappel", type: "select", options: opts(["Peu importe", "Matin (9h – 12h)", "Midi (12h – 14h)", "Après-midi (14h – 17h)", "Fin de journée (17h – 19h)"]), section: "Situation" },
  { key: "compagnie", label: "Compagnie", type: "text", section: "Situation" },
  { key: "precisions", label: "Précisions", type: "textarea", section: "Situation", full: true },
]

// --- Autre : saisie libre -----------------------------------------------------

const AUTRE_FIELDS: FieldDef[] = [
  { key: "compagnie", label: "Compagnie", type: "text", section: "Contrat" },
  { key: "typeContrat", label: "Type de contrat", type: "text", section: "Contrat" },
  { key: "garanties", label: "Garanties", type: "textarea", section: "Contrat", full: true },
  { key: "description", label: "Description", type: "textarea", section: "Contrat", full: true },
]

export const CATEGORIES: Record<Categorie, CategorieDef> = {
  TEMPASSUR: {
    value: "TEMPASSUR",
    label: CATEGORIE_LABELS.TEMPASSUR,
    sousCategorieLabel: "Type de véhicule",
    sousCategories: TEMPASSUR_SOUS_CATEGORIES,
    fields: TEMPASSUR_FIELDS,
  },
  VITRE_ASSUR: {
    value: "VITRE_ASSUR",
    label: CATEGORIE_LABELS.VITRE_ASSUR,
    sousCategorieLabel: "Produit",
    sousCategories: VITRE_ASSUR_SOUS_CATEGORIES,
    fields: VITRE_ASSUR_FIELDS,
  },
  AUTRE: {
    value: "AUTRE",
    label: CATEGORIE_LABELS.AUTRE,
    sousCategorieLabel: "Type d'assurance",
    fields: AUTRE_FIELDS,
  },
}

export const CATEGORIE_OPTIONS: Option[] = Object.values(CATEGORIES).map((c) => ({ value: c.value, label: c.label }))

export function sousCategorieLabel(categorie: string | null | undefined, sousCategorie: string | null | undefined) {
  if (!sousCategorie) return ""
  const def = categorie ? CATEGORIES[categorie as Categorie] : undefined
  return def?.sousCategories?.find((o) => o.value === sousCategorie)?.label ?? sousCategorie
}

// Valeur d'un champ "details" formatée pour l'affichage/l'export.
export function formatDetailValue(field: FieldDef | undefined, value: unknown): string {
  if (value === null || value === undefined || value === "") return ""
  if (field?.type === "boolean" || typeof value === "boolean") return value ? "Oui" : "Non"
  if (field?.type === "select") return field.options?.find((o) => o.value === value)?.label ?? String(value)
  if (field?.type === "date" && typeof value === "string") {
    const d = new Date(value)
    return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString("fr-FR")
  }
  if (typeof value === "object") return JSON.stringify(value)
  return String(value)
}

// Tous les champs de toutes les catégories, dédoublonnés par clé — utilisé
// par les exports "tous les champs" (une colonne par clé de details).
export function allDetailFields(): FieldDef[] {
  const seen = new Map<string, FieldDef>()
  for (const cat of Object.values(CATEGORIES)) {
    for (const f of cat.fields) if (!seen.has(f.key)) seen.set(f.key, f)
  }
  return [...seen.values()]
}

export const NATURE_REMUNERATION_OPTIONS: Option[] = [
  { value: "FRAIS_COURTIER", label: "Encaissement frais courtier" },
  { value: "FRAIS_ASSUREUR", label: "Encaissement frais assureur" },
  { value: "COMMISSION_COURTIER", label: "Encaissement commission courtier" },
  { value: "COMMISSION_ASSUREUR", label: "Encaissement commission assureur" },
]

export function natureRemunerationLabel(value: string | null | undefined) {
  return NATURE_REMUNERATION_OPTIONS.find((o) => o.value === value)?.label ?? ""
}
