export const CRM_DEFAULT_DISTRIBUTEUR_ID = process.env.CRM_DEFAULT_DISTRIBUTEUR_ID || undefined
export const CRM_DEFAULT_PRODUIT_ID = process.env.CRM_DEFAULT_PRODUIT_ID || undefined
export const CRM_DEFAULT_STATUT_CONTRAT_ID = process.env.CRM_DEFAULT_STATUT_CONTRAT_ID || undefined

interface CrmClientPayload {
  nom: string
  prenom: string
  civilite?: string
  telephone?: string
  email?: string
  ville?: string
  codePostal?: string
  adresse?: string
}

interface CrmClient {
  id: string
}

interface CrmContratPayload {
  clientId: string
  numero: string
  marque?: string
  modele?: string
  immatriculation?: string
  dateEffet?: string
  dureeJours?: number
  prime: number
  distributeurId?: string
  produitId?: string
  statutRefId?: string
}

interface CrmContrat {
  id: string
  numero: string
}

function crmConfig(): { baseUrl: string; apiKey: string } {
  const baseUrl = process.env.CRM_API_URL
  const apiKey = process.env.CRM_PARTNER_API_KEY
  if (!baseUrl || !apiKey) {
    throw new Error("CRM_API_URL or CRM_PARTNER_API_KEY is not set")
  }
  return { baseUrl, apiKey }
}

async function crmFetch<T>(path: string, init: RequestInit): Promise<T> {
  const { baseUrl, apiKey } = crmConfig()
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      ...init.headers,
    },
  })

  const data = await response.json().catch(() => null)
  if (!response.ok) {
    const message = data && typeof data === "object" && "message" in data ? String(data.message) : response.statusText
    throw new Error(`CRM ${path} failed (${response.status}): ${message}`)
  }
  return data as T
}

export async function createCrmClient(payload: CrmClientPayload): Promise<CrmClient> {
  return crmFetch<CrmClient>("/api/clients", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function createCrmContrat(payload: CrmContratPayload): Promise<CrmContrat> {
  return crmFetch<CrmContrat>("/api/contrats", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}
