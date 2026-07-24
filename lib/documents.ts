interface UploadSubscriptionDocumentsParams {
  clientId: string
  permisRecto?: File
  permisVerso?: File
  carteGrise?: File
  autresDocuments?: File
}

// permisRecto/permisVerso/carteGrise are required on the subscription form, so
// this call is awaited by the caller and its result surfaced — a failed upload
// must block progression instead of silently vanishing.
export async function uploadSubscriptionDocuments(params: UploadSubscriptionDocumentsParams): Promise<{ success: boolean }> {
  const { clientId, permisRecto, permisVerso, carteGrise, autresDocuments } = params
  if (!permisRecto && !permisVerso && !carteGrise && !autresDocuments) return { success: true }

  try {
    const formData = new FormData()
    formData.set("clientId", clientId)
    if (permisRecto) formData.set("permisRecto", permisRecto)
    if (permisVerso) formData.set("permisVerso", permisVerso)
    if (carteGrise) formData.set("carteGrise", carteGrise)
    if (autresDocuments) formData.set("autresDocuments", autresDocuments)

    const response = await fetch("/api/upload-documents", { method: "POST", body: formData })
    if (!response.ok) return { success: false }
    const data = (await response.json()) as { success?: boolean }
    return { success: !!data.success }
  } catch (error) {
    console.error("Document upload failed", error)
    return { success: false }
  }
}
