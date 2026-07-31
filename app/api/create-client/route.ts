import { NextRequest, NextResponse } from "next/server"

import { createCrmClient } from "@/lib/crm"

interface CreateClientBody {
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
  numeroPermis?: string
  dateObtentionPermis?: string
  paysObtentionPermis?: string
}

// Client fields with no dedicated column reachable via the partner-writable CRM API
// (numeroPermis/paysPermis/dateNaissance/pays exist on Client, but only the CRM's own
// staff-authenticated PATCH can set them — the partner POST /api/clients schema doesn't
// accept them). `notes` is the only partner-writable free-text field on Client, so this
// is where that data goes to stay visible on the client record.
function buildClientNotes(body: Partial<CreateClientBody>): string | undefined {
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

// Split out from create-devis so the wizard can create the CRM client, upload
// and verify the required documents against it, and only then create the
// devis — a devis must never exist without its documents already confirmed.
export async function POST(req: NextRequest) {
  let body: Partial<CreateClientBody>
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

    return NextResponse.json({ success: true, clientId: client.id })
  } catch (error) {
    console.error("CRM client creation failed", error)
    return NextResponse.json({ success: false, error: "crm_sync_failed" }, { status: 502 })
  }
}
