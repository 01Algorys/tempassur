import type { SubscriptionFormValues } from "@/lib/validations/subscription-schema"

interface CreateDevisParams {
  values: SubscriptionFormValues
  vehicleLabel: string
  montantEstime: number | null
}

// Unlike createContract, a devis-creation failure must be surfaced to the caller:
// no payment has happened yet, so the wizard should block progression to the
// payment step rather than silently continuing without a saved devis.
export async function createDevis({
  values,
  vehicleLabel,
  montantEstime,
}: CreateDevisParams): Promise<{ success: boolean; devisId?: string }> {
  try {
    const response = await fetch("/api/create-devis", {
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
        categorie: values.categorie,
        vehicleLabel,
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

    if (!response.ok) return { success: false }
    const data = (await response.json()) as { success?: boolean; devisId?: string }
    return { success: !!data.success, devisId: data.devisId }
  } catch {
    return { success: false }
  }
}
