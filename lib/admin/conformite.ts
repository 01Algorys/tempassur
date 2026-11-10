// Résultat du dernier contrôle LCB-FT (Efficiale : gel des avoirs, PPE) d'un client
// (champ Client.conformiteStatut du CRM ; null = jamais contrôlé).
export const CONFORMITE_LABELS: Record<string, string> = {
  AUCUNE_CORRESPONDANCE: "Aucune correspondance",
  ALERTE: "Alerte à traiter",
  ALERTE_CONFIRMEE: "Correspondance confirmée",
  ALERTES_LEVEES: "Alertes levées",
  A_REVERIFIER: "À revérifier",
}

export function conformiteLabel(statut: string | null | undefined): string {
  if (!statut) return "Non contrôlé"
  return CONFORMITE_LABELS[statut] ?? statut
}
