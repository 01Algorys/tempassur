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

// The browser needs a publicly reachable origin to upload directly to — on
// Railway that's typically the same public domain the server already calls,
// but CRM_UPLOAD_BASE_URL lets ops point browser uploads at a different public
// hostname than server-to-server traffic without code changes.
export function crmUploadBaseUrl(): string {
  const url = process.env.CRM_UPLOAD_BASE_URL || process.env.CRM_API_URL
  if (!url) throw new Error("CRM_UPLOAD_BASE_URL or CRM_API_URL is not set")
  return url
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

// Mints a short-lived, client-scoped token (lib/upload-token.ts on the CRM
// side) so the browser can upload documents straight to the CRM's Railway
// deployment — never through a Vercel function, never holding CRM_PARTNER_API_KEY.
export async function issueUploadToken(clientId: string): Promise<{ token: string; expiresAt: string }> {
  return crmFetch<{ token: string; expiresAt: string }>("/api/upload-token", {
    method: "POST",
    body: JSON.stringify({ clientId }),
  })
}

export interface RequiredDocumentsStatus {
  permisRecto: boolean
  permisVerso: boolean
  carteGrise: boolean
}

// Server-to-server source of truth for "did the required documents actually
// land," called right before devis creation — the CRM's own records, not the
// browser's self-reported upload result, gate whether a devis gets created.
export async function checkRequiredDocuments(clientId: string): Promise<RequiredDocumentsStatus> {
  return crmFetch<RequiredDocumentsStatus>(`/api/documents/required-check?clientId=${encodeURIComponent(clientId)}`, {
    method: "GET",
  })
}
