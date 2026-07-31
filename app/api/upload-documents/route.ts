import { NextRequest, NextResponse } from "next/server"

import { uploadCrmDocument } from "@/lib/crm"
import { MAX_FILE_SIZE_BYTES } from "@/lib/validations/subscription-schema"

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

  // getAll (not get) so fields that allow multiple files — currently only
  // autresDocuments — get every attached file, not just the first.
  for (const [field, meta] of Object.entries(FIELD_MAP)) {
    const files = formData.getAll(field).filter((f): f is File => f instanceof File)

    for (const file of files) {
      // Reject oversized/empty files outright instead of forwarding them to the
      // CRM — the client already blocks these, this is the server-side backstop.
      // A 0-byte file must count as a failure, not be silently dropped: dropping
      // it would leave it out of `results` entirely, making the batch's
      // `every(r => r.success)` vacuously true even though nothing was uploaded.
      if (file.size === 0) {
        results.push({ field, success: false, error: "file_empty" })
        continue
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        results.push({ field, success: false, error: "file_too_large" })
        continue
      }

      try {
        await uploadCrmDocument({ clientId, file, ...meta })
        results.push({ field, success: true })
      } catch (error) {
        console.error(`[upload-documents] failed for ${field}`, error)
        results.push({ field, success: false, error: error instanceof Error ? error.message : "upload_failed" })
      }
    }
  }

  const success = results.every((r) => r.success)
  return NextResponse.json({ success, results })
}
