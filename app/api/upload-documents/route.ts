import { NextRequest, NextResponse } from "next/server"

import { uploadCrmDocument } from "@/lib/crm"

// Optional, best-effort: a failed document upload must never block the
// subscription wizard (payment already happened or is about to) — each file
// is attempted independently and failures are reported back, not thrown.
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

  return NextResponse.json({ success: true, results })
}
