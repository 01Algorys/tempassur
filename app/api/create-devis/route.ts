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

// Client fields with no dedicated column reachable via the partner-writable CRM API
// (numeroPermis/paysPermis/dateNaissance/pays exist on Client, but only the CRM's own
// staff-authenticated PATCH can set them — the partner POST /api/clients schema doesn't
// accept them). `notes` is the only partner-writable free-text field on Client, so this
// is where that data goes to stay visible on the client record instead of only living
// inside the devis' besoinsExprimes.
function buildClientNotes(body: Partial<CreateDevisBody>): string | undefined {
  const lines = [
    body.dateNaissance ? `Date de naissance : ${body.dateNaissance}` : null,
    body.paysNaissance ? `Pays de naissance : ${body.paysNaissance}` : null,
    body.paysResidence
      ? `Pays de résidence : ${body.paysResidence}${body.territoireResidence ? ` (${body.territoireResidence})` : ""}`
      : null,
    body.numeroPermis ? `Permis n° ${body.numeroPermis}` : null,
    body.dateObtentionPermis ? `Permis obtenu le ${body.dateObtentionPermis}` : null,
    body.paysObtentionPermis ? `Pays d'obtention du permis : ${body.paysObtentionPermis}` : null,
  ].filter(Boolean)
  return lines.length ? lines.join("\n") : undefined
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
      notes: buildClientNotes(body),
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
