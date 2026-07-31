"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { FileText, ExternalLink, Trash2, Upload } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { StatusBadge } from "@/components/admin/status-badge"
import { DOCUMENT_STATUS_LABELS, DOCUMENT_STATUS_BADGE, formatFileSize, dateTimeFmt } from "@/lib/admin/labels"

export interface AdminDocument {
  id: string
  nom: string
  type: string
  url: string
  taille: number | null
  libelleAutre: string | null
  statutDocument: string
  createdAt: string
  typeDocumentRef?: { nom: string } | null
}

function proxiedFileUrl(url: string): string {
  // Documents' `url` from the CRM looks like /api/files/<clientId>/<...>/<file> —
  // rewritten to tempassur's own authenticated proxy at /api/admin/files/<...>.
  const marker = "/api/files/"
  const idx = url.indexOf(marker)
  const rest = idx >= 0 ? url.slice(idx + marker.length) : url
  return `/api/admin/files/${rest}`
}

export function DocumentsCard({ documents, contratId }: { documents: AdminDocument[]; contratId?: string }) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0 || !contratId) return
    setUploading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append("contratId", contratId)
      for (const file of Array.from(files)) formData.append("file", file)
      const res = await fetch("/api/admin/crm/documents", { method: "POST", body: formData })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.message ?? "Échec de l'envoi du document.")
      }
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.")
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    setError(null)
    try {
      const res = await fetch(`/api/admin/crm/documents/${id}`, { method: "DELETE" })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.message ?? "Échec de la suppression du document.")
      }
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle>Documents ({documents.length})</CardTitle>
        {contratId ? (
          <div>
            <Input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleUpload(e.target.files)}
            />
            <Button
              variant="outline"
              size="sm"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload /> {uploading ? "Envoi..." : "Ajouter un document"}
            </Button>
          </div>
        ) : null}
      </CardHeader>
      <CardContent>
        {error ? <p className="mb-2 text-sm text-destructive">{error}</p> : null}
        {documents.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun document déposé.</p>
        ) : (
          <div className="space-y-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5 text-sm transition-colors hover:bg-muted/50"
              >
                <a
                  href={proxiedFileUrl(doc.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-w-0 flex-1 items-center gap-3"
                >
                  <FileText className="size-4.5 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">
                      {doc.typeDocumentRef?.nom ?? "Document"}
                      {doc.libelleAutre ? ` — ${doc.libelleAutre}` : ""}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {doc.nom} · {formatFileSize(doc.taille)} · {dateTimeFmt(doc.createdAt)}
                    </p>
                  </div>
                </a>
                <StatusBadge
                  label={DOCUMENT_STATUS_LABELS[doc.statutDocument] ?? doc.statutDocument}
                  className={DOCUMENT_STATUS_BADGE[doc.statutDocument]}
                />
                <a href={proxiedFileUrl(doc.url)} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="size-3.5 shrink-0 text-muted-foreground" />
                </a>
                {contratId ? (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    disabled={deletingId === doc.id}
                    onClick={() => handleDelete(doc.id)}
                  >
                    <Trash2 className="text-destructive" />
                  </Button>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
