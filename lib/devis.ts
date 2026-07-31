import type { SubscriptionFormValues } from "@/lib/validations/subscription-schema"

interface CreateClientParams {
  values: SubscriptionFormValues
}

export interface CreateClientResult {
  success: boolean
  clientId?: string
  // Short-lived (15 min), client-scoped credential for uploading documents
  // directly to the CRM's Railway deployment — see lib/documents.ts.
  uploadToken?: string
  uploadUrl?: string
  uploadTokenExpiresAt?: string
}

// Split from createDevis so the wizard can create the CRM client, upload and
// verify the required documents against it, and only then create the devis —
// a devis must never exist without its documents already confirmed uploaded.
export async function createClient({ values }: CreateClientParams): Promise<CreateClientResult> {
  try {
    const response = await fetch("/api/create-client", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nom: values.nom,
        prenom: values.prenom,
        civilite: values.civilite,
        email: values.email,
        telephoneMobile: values.telephoneMobile,
        adresse: values.adresse,
        codePostal: values.codePostal,
        ville: values.ville,
        dateNaissance: values.dateNaissance,
        paysNaissance: values.paysNaissance,
        paysResidence: values.paysResidence,
        territoireResidence: values.territoireResidence,
        numeroPermis: values.numeroPermis,
        dateObtentionPermis: values.dateObtentionPermis,
        paysObtentionPermis: values.paysObtentionPermis,
      }),
    })

    if (!response.ok) return { success: false }
    const data = (await response.json()) as CreateClientResult
    return {
      success: !!data.success,
      clientId: data.clientId,
      uploadToken: data.uploadToken,
      uploadUrl: data.uploadUrl,
      uploadTokenExpiresAt: data.uploadTokenExpiresAt,
    }
  } catch {
    return { success: false }
  }
}

interface CreateDevisParams {
  clientId: string
  values: SubscriptionFormValues
  vehicleLabel: string
  montantEstime: number | null
}

// Unlike createContract, a devis-creation failure must be surfaced to the caller:
// no payment has happened yet, so the wizard should block progression to the
// payment step rather than silently continuing without a saved devis. Called only
// after uploadSubscriptionDocuments has confirmed success for this clientId.
export async function createDevis({
  clientId,
  values,
  vehicleLabel,
  montantEstime,
}: CreateDevisParams): Promise<{ success: boolean; devisId?: string; error?: string; missing?: string[] }> {
  try {
    const response = await fetch("/api/create-devis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId,
        nom: values.nom,
        prenom: values.prenom,
        civilite: values.civilite,
        email: values.email,
        telephoneMobile: values.telephoneMobile,
        adresse: values.adresse,
        codePostal: values.codePostal,
        ville: values.ville,
        dateNaissance: values.dateNaissance,
        paysNaissance: values.paysNaissance,
        paysResidence: values.paysResidence,
        territoireResidence: values.territoireResidence,
        paysImmatriculation: values.paysImmatriculation,
        territoireImmatriculation: values.territoireImmatriculation,
        categorie: values.categorie,
        vehicleLabel,
        cvTier: values.cvTier,
        ptacTier: values.ptacTier,
        quadSubtype: values.quadSubtype,
        marque: values.marque,
        modele: values.modele,
        immatriculation: values.immatriculation,
        dateMiseEnCirculation: values.dateMiseEnCirculation,
        estVehiculeLocation: values.estVehiculeLocation,
        nomAgenceLocation: values.nomAgenceLocation,
        duree: values.duree,
        dateEffet: values.dateEffet,
        heureEffet: values.heureEffet,
        optionAssistance: values.optionAssistance,
        optionGarantieConducteur: values.optionGarantieConducteur,
        optionExtensionTn: values.optionExtensionTn,
        numeroPermis: values.numeroPermis,
        dateObtentionPermis: values.dateObtentionPermis,
        paysObtentionPermis: values.paysObtentionPermis,
        montantEstime,
      }),
    })

    const data = (await response.json().catch(() => null)) as
      | { success?: boolean; devisId?: string; error?: string; missing?: string[] }
      | null
    if (!response.ok) return { success: false, error: data?.error, missing: data?.missing }
    return { success: !!data?.success, devisId: data?.devisId }
  } catch {
    return { success: false }
  }
}
