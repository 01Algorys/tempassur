// Motif de souscription demandé dans le tunnel (étape "details") et affiché/
// modifiable dans l'admin. Les valeurs sont stables (stockées dans le CRM) ;
// les libellés du tunnel sont traduits via messages/*.json
// "wizard.motif.options.<value>", ceux de l'admin sont en français ci-dessous.
export const MOTIF_SOUSCRIPTION_VALUES = [
  "achat-revente",
  "pret-vehicule",
  "import-export",
  "prive-pro-occasionnel",
  "sortie-fourriere",
  "resiliation-non-paiement",
  "autre",
] as const

export type MotifSouscription = (typeof MOTIF_SOUSCRIPTION_VALUES)[number]

export const MOTIF_SOUSCRIPTION_LABELS_FR: Record<MotifSouscription, string> = {
  "achat-revente": "Achat/revente",
  "pret-vehicule": "Prêt de véhicule",
  "import-export": "Import/export",
  "prive-pro-occasionnel": "Privé ou professionnel occasionnel",
  "sortie-fourriere": "Sortie de la fourrière",
  "resiliation-non-paiement": "Résiliation pour non-paiement",
  autre: "Autre",
}
