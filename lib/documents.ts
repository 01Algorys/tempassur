interface UploadSubscriptionDocumentsParams {
  clientId: string
  permisRecto?: File
  permisVerso?: File
  carteGrise?: File
  autresDocuments?: File
}

// Best-effort: documents are optional on the subscription form, and by the time
// this runs the devis already exists (or payment already happened for the ones
// called post-payment) — a failed upload must never block the customer's flow.
export async function uploadSubscriptionDocuments(params: UploadSubscriptionDocumentsParams): Promise<void> {
  const { clientId, permisRecto, permisVerso, carteGrise, autresDocuments } = params
  if (!permisRecto && !permisVerso && !carteGrise && !autresDocuments) return

  try {
    const formData = new FormData()
    formData.set("clientId", clientId)
    if (permisRecto) formData.set("permisRecto", permisRecto)
    if (permisVerso) formData.set("permisVerso", permisVerso)
    if (carteGrise) formData.set("carteGrise", carteGrise)
    if (autresDocuments) formData.set("autresDocuments", autresDocuments)

    await fetch("/api/upload-documents", { method: "POST", body: formData })
  } catch (error) {
    console.error("Document upload failed", error)
  }
}
