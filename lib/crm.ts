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
  notes?: string
}

interface CrmClient {
  id: string
}

interface CrmDevisPayload {
  clientId: string
  distributeurId?: string
  produitId?: string
  montantEstime?: number
  besoinsExprimes?: string
}

interface CrmDevis {
  id: string
}

interface CrmTransformPayload {
  numero: string
  prime: number
  dateEffet?: string
  dureeJours?: number
  marque?: string
  modele?: string
  immatriculation?: string
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

export async function createCrmDevis(payload: CrmDevisPayload): Promise<CrmDevis> {
  return crmFetch<CrmDevis>("/api/devis", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

// Transforms a devis into a contrat CRM-side (keeps the devis→contrat link for
// traceability instead of creating a disconnected contrat).
export async function transformCrmDevis(devisId: string, payload: CrmTransformPayload): Promise<CrmContrat> {
  return crmFetch<CrmContrat>(`/api/devis/${devisId}/transform`, {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

interface CrmDocument {
  id: string
}

// Not JSON, so this bypasses crmFetch (which always forces a JSON content-type)
// and posts multipart/form-data directly instead.
export async function uploadCrmDocument(params: {
  clientId: string
  file: File
  typeDocumentLabel: string
  libelleAutre?: string
}): Promise<CrmDocument> {
  const { baseUrl, apiKey } = crmConfig()

  const formData = new FormData()
  formData.set("clientId", params.clientId)
  formData.set("typeDocumentLabel", params.typeDocumentLabel)
  if (params.libelleAutre) formData.set("libelleAutre", params.libelleAutre)
  formData.append("file", params.file)

  const response = await fetch(`${baseUrl}/api/documents`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: formData,
  })

  const data = await response.json().catch(() => null)
  if (!response.ok) {
    const message = data && typeof data === "object" && "message" in data ? String(data.message) : response.statusText
    throw new Error(`CRM /api/documents failed (${response.status}): ${message}`)
  }
  // POST /api/documents returns an array (multi-file upload) — this call only ever sends one.
  return Array.isArray(data) ? data[0] : data
}
