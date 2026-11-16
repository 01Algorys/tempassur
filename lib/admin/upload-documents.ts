// Taille maximale d'un fichier envoyé depuis l'admin (le CRM accepte jusqu'à 100 Mo).
export const ADMIN_MAX_FILE_BYTES = 40 * 1024 * 1024
// Au-delà, Vercel refuse la requête : seul l'envoi direct au CRM fonctionne.
const PROXY_MAX_BYTES = 4 * 1024 * 1024

export function oversizedFiles(files: File[]): File[] {
  return files.filter((f) => f.size > ADMIN_MAX_FILE_BYTES)
}

export const oversizedMessage = (files: File[]) =>
  `Fichier trop volumineux (40 Mo maximum) : ${files.map((f) => f.name).join(", ")}`

// Envoie des documents au CRM. Les fichiers partent directement du navigateur vers le
// CRM avec un jeton de 10 minutes (voir /api/admin/upload-session) ; si cet envoi direct
// est impossible (réseau, origine non autorisée…), les petits envois passent encore par
// le proxy de l'admin.
export async function uploadAdminDocuments(formData: FormData): Promise<Response> {
  const files = formData.getAll("file").filter((f): f is File => f instanceof File)
  const tooBig = oversizedFiles(files)
  if (tooBig.length > 0) throw new Error(oversizedMessage(tooBig))
  const total = files.reduce((sum, f) => sum + f.size, 0)

  const viaProxy = () => fetch("/api/admin/crm/documents", { method: "POST", body: formData })

  let session: { url: string; token: string } | null = null
  try {
    const res = await fetch("/api/admin/upload-session", { method: "POST" })
    if (res.ok) session = await res.json()
  } catch {
    session = null
  }
  if (!session) return viaProxy()

  try {
    return await fetch(session.url, {
      method: "POST",
      headers: { Authorization: `Bearer ${session.token}` },
      body: formData,
    })
  } catch (err) {
    if (total <= PROXY_MAX_BYTES) return viaProxy()
    throw err instanceof Error ? new Error(`Échec de l'envoi du document : ${err.message}`) : err
  }
}
