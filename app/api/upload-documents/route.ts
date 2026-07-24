import { NextRequest, NextResponse } from "next/server"

import { uploadCrmDocument } from "@/lib/crm"

// Each file is attempted independently so one bad file doesn't take down the
// others, but the top-level `success` reflects whether every attempted file
// actually made it to the CRM — callers must not treat this as always-true.
const FIELD_MAP: Record<string, { typeDocumentLabel: string; libelleAutre?: string }> = {
  permisRecto: { typeDocumentLabel: "Permis de conduire", libelleAutre: "Recto" },
  permisVerso: { typeDocumentLabel: "Permis de conduire", libelleAutre: "Verso" },
  carteGrise: { typeDocumentLabel: "Carte grise" },
  autresDocuments: { typeDocumentLabel: "Autre" },
}

export async function POST(req: NextRequest) {
  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ success: false, error: "invalid_form_data" }, { status: 400 })
  }

  const clientId = formData.get("clientId")
  if (!clientId || typeof clientId !== "string") {
    return NextResponse.json({ success: false, error: "missing_client_id" }, { status: 400 })
  }

  const results: { field: string; success: boolean; error?: string }[] = []

  for (const [field, meta] of Object.entries(FIELD_MAP)) {
    const file = formData.get(field)
    if (!(file instanceof File) || file.size === 0) continue

    try {
      await uploadCrmDocument({ clientId, file, ...meta })
      results.push({ field, success: true })
    } catch (error) {
      console.error(`[upload-documents] failed for ${field}`, error)
      results.push({ field, success: false, error: error instanceof Error ? error.message : "upload_failed" })
    }
  }

  const success = results.every((r) => r.success)
  return NextResponse.json({ success, results })
}
