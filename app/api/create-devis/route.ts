import { NextRequest, NextResponse } from "next/server"

import { CRM_DEFAULT_DISTRIBUTEUR_ID, CRM_DEFAULT_PRODUIT_ID, checkRequiredDocuments, createCrmDevis } from "@/lib/crm"

interface CreateDevisBody {
  clientId: string
  nom: string
  prenom: string
  civilite?: string
  email: string
  telephoneMobile?: string
  adresse?: string
  codePostal?: string
  ville?: string
  dateNaissance?: string
  paysNaissance?: string
  paysResidence?: string
  territoireResidence?: string
  paysImmatriculation?: string
  territoireImmatriculation?: string
  categorie?: string
  vehicleLabel?: string
  cvTier?: string
  ptacTier?: string
  quadSubtype?: string
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

  const tiers = [body.cvTier, body.ptacTier, body.quadSubtype].filter(Boolean)

  const lines = [
    `Véhicule : ${body.vehicleLabel || body.categorie || "Non renseigné"}`,
    tiers.length ? `Sous-catégorie : ${tiers.join(", ")}` : null,
    body.marque || body.modele ? `Marque / modèle : ${[body.marque, body.modele].filter(Boolean).join(" ")}` : null,
    body.immatriculation ? `Immatriculation : ${body.immatriculation}` : null,
    body.dateMiseEnCirculation ? `1ère mise en circulation : ${body.dateMiseEnCirculation}` : null,
    body.paysImmatriculation
      ? `Pays d'immatriculation : ${body.paysImmatriculation}${body.territoireImmatriculation ? ` (${body.territoireImmatriculation})` : ""}`
      : null,
    body.estVehiculeLocation ? `Véhicule de location (${body.nomAgenceLocation || "agence non précisée"})` : null,
    body.paysResidence
      ? `Pays de résidence : ${body.paysResidence}${body.territoireResidence ? ` (${body.territoireResidence})` : ""}`
      : null,
    body.duree ? `Durée souhaitée : ${body.duree} jours` : null,
    body.dateEffet && body.heureEffet ? `Date d'effet souhaitée : ${body.dateEffet} à ${body.heureEffet}` : null,
    options.length ? `Options : ${options.join(", ")}` : null,
    body.dateNaissance
      ? `Conducteur né(e) le ${body.dateNaissance}${body.paysNaissance ? ` (${body.paysNaissance})` : ""}`
      : null,
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

  const { clientId, nom, prenom, email } = body
  if (!clientId || !nom || !prenom || !email) {
    return NextResponse.json({ success: false, error: "missing_fields" }, { status: 400 })
  }

  // The browser uploads directly to the CRM now — this server never sees the
  // file bytes and can't just trust the browser's self-reported "upload
  // succeeded." The CRM's own document records are the source of truth for
  // whether a devis is allowed to exist.
  try {
    const status = await checkRequiredDocuments(clientId)
    const missing = (Object.keys(status) as (keyof typeof status)[]).filter((key) => !status[key])
    if (missing.length > 0) {
      console.warn("devis creation blocked: missing documents", { clientId, missing })
      return NextResponse.json({ success: false, error: "missing_documents", missing }, { status: 422 })
    }
  } catch (error) {
    console.error("CRM document status check failed", error)
    return NextResponse.json({ success: false, error: "crm_sync_failed" }, { status: 502 })
  }

  try {
    const devis = await createCrmDevis({
      clientId,
      distributeurId: CRM_DEFAULT_DISTRIBUTEUR_ID,
      produitId: CRM_DEFAULT_PRODUIT_ID,
      montantEstime: body.montantEstime,
      besoinsExprimes: buildBesoinsExprimes(body),
    })

    return NextResponse.json({ success: true, devisId: devis.id, clientId })
  } catch (error) {
    // Unlike create-contract, no payment has happened yet at this point — a CRM
    // sync failure here must block progression so the devis-then-contract
    // invariant (§ wizard flow) never silently skips the devis step.
    console.error("CRM devis creation failed", error)
    return NextResponse.json({ success: false, error: "crm_sync_failed" }, { status: 502 })
  }
}
