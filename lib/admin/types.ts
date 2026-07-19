export interface CrmStats {
  activeContracts: number
  expiredContracts: number
  totalContracts: number
  monthlyRevenue: number
  devisParEtapeRaw: { statutPipeline: string; _count: number }[]
  devisTotal: number
  tauxTransformation: number
  contratsEcheance: number
  documentsManquants: number
  tachesEnRetard: number
  tachesDuJourCount: number
  tachesAffichees: {
    id: string
    titre: string
    echeance: string | null
    enRetard: boolean
    client: { prenom?: string; nom?: string } | null
    contrat: { numero: string } | null
  }[]
  clientsCount: number
  evolutionMensuelle: { mois: string; count: number }[]
  repartitionDistributeur: { name: string; value: number }[]
  repartitionProduit: { name: string; value: number }[]
  prochainsRdv: { id: string; titre: string; dateDebut: string; client: { prenom?: string; nom?: string } | null }[]
}

export interface EmailStatsResponse {
  todayCount: number
  monthCount: number
  trend: { date: string; sent: number; failed: number }[]
}
