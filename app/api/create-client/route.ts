import { NextRequest, NextResponse } from "next/server"

import { createCrmClient, crmUploadBaseUrl, issueUploadToken } from "@/lib/crm"

interface CreateClientBody {
  nom: string
  prenom: string
  civilite?: string
  email: string
  telephoneMobile?: string
  telephones?: string[]
  emails?: string[]
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
      telephones: body.telephones,
      email,
      emails: body.emails,
      adresse: body.adresse,
      codePostal: body.codePostal,
      ville: body.ville,
      dateNaissance: body.dateNaissance,
      paysNaissance: body.paysNaissance,
      paysResidence: body.paysResidence,
      territoireResidence: body.territoireResidence,
      numeroPermis: body.numeroPermis,
      paysPermis: body.paysObtentionPermis,
      dateObtentionPermis: body.dateObtentionPermis,
    })

    // Minted here (server-to-server, holding CRM_PARTNER_API_KEY) and handed to
    // the browser so it can upload documents directly to the CRM's Railway
    // deployment — this Vercel function never touches the file bytes themselves.
    const { token: uploadToken, expiresAt: uploadTokenExpiresAt } = await issueUploadToken(client.id)

    return NextResponse.json({
      success: true,
      clientId: client.id,
      uploadToken,
      uploadTokenExpiresAt,
      uploadUrl: `${crmUploadBaseUrl()}/api/documents`,
    })
  } catch (error) {
    console.error("CRM client creation failed", error)
    return NextResponse.json({ success: false, error: "crm_sync_failed" }, { status: 502 })
  }
}
