interface FieldMeta {
  typeDocumentLabel: string
  libelleAutre?: string
}

const FIELD_META: Record<string, FieldMeta> = {
  permisRecto: { typeDocumentLabel: "Permis de conduire", libelleAutre: "Recto" },
  permisVerso: { typeDocumentLabel: "Permis de conduire", libelleAutre: "Verso" },
  carteGrise: { typeDocumentLabel: "Carte grise" },
  autresDocuments: { typeDocumentLabel: "Autre" },
}

const MAX_RETRIES = 2
const RETRY_BASE_DELAY_MS = 600

interface UploadTask {
  field: string
  key: string
  file: File
  meta: FieldMeta
}

// Stable identity per file so a retry can tell "already uploaded" apart from
// "still needs uploading" — the required single-file fields are identified by
// field name alone, autresDocuments entries by file identity since there can
// be several under the same field name.
function taskKey(field: string, file: File): string {
  return field === "autresDocuments" ? `autresDocuments:${file.name}:${file.size}:${file.lastModified}` : field
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// XHR (not fetch) specifically for `upload.onprogress` — fetch has no upload
// progress event, which the wizard needs to show something during a multi-MB
// upload on a slow mobile connection.
function uploadOneFile(params: {
  uploadUrl: string
  uploadToken: string
  clientId: string
  task: UploadTask
  onBytesSent: (bytes: number) => void
}): Promise<void> {
  const { uploadUrl, uploadToken, clientId, task, onBytesSent } = params
  return new Promise((resolve, reject) => {
    const formData = new FormData()
    formData.set("clientId", clientId)
    formData.set("typeDocumentLabel", task.meta.typeDocumentLabel)
    if (task.meta.libelleAutre) formData.set("libelleAutre", task.meta.libelleAutre)
    formData.append("file", task.file)

    const xhr = new XMLHttpRequest()
    xhr.open("POST", uploadUrl)
    xhr.setRequestHeader("Authorization", `Bearer ${uploadToken}`)
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onBytesSent(event.loaded)
    }
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onBytesSent(task.file.size)
        resolve()
      } else {
        reject(new Error(`upload_failed_${xhr.status}`))
      }
    }
    xhr.onerror = () => reject(new Error("network_error"))
    xhr.send(formData)
  })
}

async function uploadWithRetry(params: {
  uploadUrl: string
  uploadToken: string
  clientId: string
  task: UploadTask
  onBytesSent: (bytes: number) => void
}): Promise<{ key: string; success: boolean }> {
  const { task } = params
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const startedAt = performance.now()
    try {
      await uploadOneFile(params)
      console.info("[upload] success", {
        field: task.field,
        fileSize: task.file.size,
        durationMs: Math.round(performance.now() - startedAt),
        attempt,
      })
      return { key: task.key, success: true }
    } catch (error) {
      console.warn("[upload] failed", {
        field: task.field,
        fileSize: task.file.size,
        durationMs: Math.round(performance.now() - startedAt),
        attempt,
        error: error instanceof Error ? error.message : String(error),
      })
      if (attempt < MAX_RETRIES) await sleep(RETRY_BASE_DELAY_MS * 2 ** attempt)
    }
  }
  return { key: task.key, success: false }
}

interface UploadSubscriptionDocumentsParams {
  clientId: string
  uploadToken: string
  uploadUrl: string
  permisRecto?: File
  permisVerso?: File
  carteGrise?: File
  autresDocuments?: File[]
  // Keys (from a previous call's `uploadedKeys`) to skip re-uploading — the
  // CRM has no upload idempotency, so retrying a partially-failed batch
  // without this would create duplicate documents for the fields that
  // already succeeded.
  alreadyUploadedKeys?: ReadonlySet<string>
  // Aggregate fraction (0-1) across all files in this batch, driven by actual
  // bytes-sent progress events — not just a per-file completion count.
  onProgress?: (fraction: number) => void
}

// Uploads go straight from the browser to the CRM's Railway deployment (see
// lib/crm.ts issueUploadToken / crmUploadBaseUrl) — this never touches a
// Vercel function, so there's no request-body size limit to work around.
// permisRecto/permisVerso/carteGrise are required on the subscription form; a
// failed upload must block progression instead of silently vanishing, so the
// caller surfaces `success` and blocks devis creation on it (also re-verified
// server-side against the CRM before the devis is actually created).
export async function uploadSubscriptionDocuments(
  params: UploadSubscriptionDocumentsParams
): Promise<{ success: boolean; uploadedKeys: string[] }> {
  const {
    clientId,
    uploadToken,
    uploadUrl,
    permisRecto,
    permisVerso,
    carteGrise,
    autresDocuments,
    alreadyUploadedKeys,
    onProgress,
  } = params

  const allTasks: UploadTask[] = []
  if (permisRecto) allTasks.push({ field: "permisRecto", key: taskKey("permisRecto", permisRecto), file: permisRecto, meta: FIELD_META.permisRecto })
  if (permisVerso) allTasks.push({ field: "permisVerso", key: taskKey("permisVerso", permisVerso), file: permisVerso, meta: FIELD_META.permisVerso })
  if (carteGrise) allTasks.push({ field: "carteGrise", key: taskKey("carteGrise", carteGrise), file: carteGrise, meta: FIELD_META.carteGrise })
  autresDocuments?.forEach((file) =>
    allTasks.push({ field: "autresDocuments", key: taskKey("autresDocuments", file), file, meta: FIELD_META.autresDocuments })
  )

  const alreadyDone = allTasks.filter((task) => alreadyUploadedKeys?.has(task.key))
  const tasks = allTasks.filter((task) => !alreadyUploadedKeys?.has(task.key))

  if (tasks.length === 0) return { success: true, uploadedKeys: alreadyDone.map((t) => t.key) }

  const totalBytes = tasks.reduce((sum, task) => sum + task.file.size, 0)
  const bytesSentByKey = new Map<string, number>()
  const reportProgress = () => {
    if (!onProgress) return
    const sent = [...bytesSentByKey.values()].reduce((sum, n) => sum + n, 0)
    onProgress(totalBytes > 0 ? Math.min(1, sent / totalBytes) : 1)
  }

  const results = await Promise.all(
    tasks.map((task) =>
      uploadWithRetry({
        uploadUrl,
        uploadToken,
        clientId,
        task,
        onBytesSent: (bytes) => {
          bytesSentByKey.set(task.key, bytes)
          reportProgress()
        },
      })
    )
  )

  const newlyUploadedKeys = results.filter((r) => r.success).map((r) => r.key)
  return {
    success: results.every((r) => r.success),
    uploadedKeys: [...alreadyDone.map((t) => t.key), ...newlyUploadedKeys],
  }
}
