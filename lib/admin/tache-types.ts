// Types de tâche proposés dans la liste déroulante (formulaire, filtre, colonne).
export const TACHE_TYPE_OPTIONS = [
  { value: "RAPPEL_CLIENT", label: "Rappel client" },
  { value: "ATTENTE_PIECES", label: "Attente de pièces" },
  { value: "ATTENTE_PAIEMENT", label: "Attente de paiement" },
  { value: "RECLAMATION", label: "Réclamation" },
  { value: "ERREUR_A_CORRIGER", label: "Erreur à corriger" },
  { value: "AUTRE", label: "Autre" },
] as const

// Anciens types, encore portés par des tâches existantes : affichés, mais plus proposés à la création.
const ANCIENS_TYPES: Record<string, string> = {
  APPEL: "Appel",
  RELANCE_DEVIS: "Relance devis",
  DOCUMENT_A_RECEVOIR: "Document à recevoir",
  RENOUVELLEMENT: "Renouvellement",
  RELANCE_AMIABLE: "Relance amiable",
  REMBOURSEMENT: "Remboursement",
  AVENANT: "Avenant",
  MODIFICATION_CONTRAT: "Modification contrat",
  RELANCE_DOCUMENT: "Relance document",
  SINISTRE: "Sinistre",
}

export const estTypePropose = (type: string) => TACHE_TYPE_OPTIONS.some((o) => o.value === type)

export function tacheTypeLabel(type: string | null | undefined): string {
  if (!type) return "—"
  return TACHE_TYPE_OPTIONS.find((o) => o.value === type)?.label ?? ANCIENS_TYPES[type] ?? type
}

// Libellé affiché dans les listes : « Autre : <précision> » quand une précision a été saisie.
export function tacheTypeAffiche(tache: { type?: string | null; typeAutre?: string | null }): string {
  const label = tacheTypeLabel(tache.type)
  return tache.type === "AUTRE" && tache.typeAutre ? `${label} : ${tache.typeAutre}` : label
}
