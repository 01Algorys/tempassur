import { NextRequest, NextResponse } from "next/server"

import { CRM_DEFAULT_DISTRIBUTEUR_ID, CRM_DEFAULT_PRODUIT_ID, createCrmClient, createCrmDevis } from "@/lib/crm"

interface CreateDevisBody {
  nom: string
  prenom: string
  civilite?: string
  email: string
  telephoneMobile?: string
  adresse?: string
  codePostal?: string
  ville?: string
  categorie?: string
  vehicleLabel?: string
  marque?: string
  modele?: string
  immatriculation?: string
  dateMiseEnCirculation?: string
  estVehiculeLocation?: boolean
  nomAgenceLocation?: string
  duree?: number
  dateEffet?: string
  heureEffet?: string
  optionAssistance?: boolean
  optionGarantieConducteur?: boolean
  optionExtensionTn?: boolean
  numeroPermis?: string
  dateObtentionPermis?: string
  paysObtentionPermis?: string
  montantEstime?: number
}

function buildBesoinsExprimes(body: Partial<CreateDevisBody>): string {
  const options = [
    body.optionAssistance ? "Assistance" : null,
    body.optionGarantieConducteur ? "Garantie conducteur" : null,
    body.optionExtensionTn ? "Extension territoriale" : null,
  ].filter(Boolean)

  const lines = [
    `Véhicule : ${body.vehicleLabel || body.categorie || "Non renseigné"}`,
    body.marque || body.modele ? `Marque / modèle : ${[body.marque, body.modele].filter(Boolean).join(" ")}` : null,
    body.immatriculation ? `Immatriculation : ${body.immatriculation}` : null,
    body.dateMiseEnCirculation ? `1ère mise en circulation : ${body.dateMiseEnCirculation}` : null,
    body.estVehiculeLocation ? `Véhicule de location (${body.nomAgenceLocation || "agence non précisée"})` : null,
    body.duree ? `Durée souhaitée : ${body.duree} jours` : null,
    body.dateEffet && body.heureEffet ? `Date d'effet souhaitée : ${body.dateEffet} à ${body.heureEffet}` : null,
    options.length ? `Options : ${options.join(", ")}` : null,
    body.numeroPermis ? `Permis n° ${body.numeroPermis} (obtenu le ${body.dateObtentionPermis || "?"}, ${body.paysObtentionPermis || "?"})` : null,
  ].filter(Boolean)

  return lines.join("\n")
}

export async function POST(req: NextRequest) {
  let body: Partial<CreateDevisBody>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ success: false, error: "invalid_json" }, { status: 400 })
  }

  const { nom, prenom, email } = body
  if (!nom || !prenom || !email) {
    return NextResponse.json({ success: false, error: "missing_fields" }, { status: 400 })
  }

  try {
    const client = await createCrmClient({
      nom,
      prenom,
      civilite: body.civilite,
      telephone: body.telephoneMobile,
      email,
      adresse: body.adresse,
      codePostal: body.codePostal,
      ville: body.ville,
    })

    const devis = await createCrmDevis({
      clientId: client.id,
      distributeurId: CRM_DEFAULT_DISTRIBUTEUR_ID,
      produitId: CRM_DEFAULT_PRODUIT_ID,
      montantEstime: body.montantEstime,
      besoinsExprimes: buildBesoinsExprimes(body),
    })

    return NextResponse.json({ success: true, devisId: devis.id, clientId: client.id })
  } catch (error) {
    // Unlike create-contract, no payment has happened yet at this point — a CRM
    // sync failure here must block progression so the devis-then-contract
    // invariant (§ wizard flow) never silently skips the devis step.
    console.error("CRM devis creation failed", error)
    return NextResponse.json({ success: false, error: "crm_sync_failed" }, { status: 502 })
  }
}
