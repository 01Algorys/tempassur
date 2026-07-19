import { FileText, ExternalLink } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

export function DocumentsCard({ documents }: { documents: AdminDocument[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents ({documents.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun document déposé.</p>
        ) : (
          <div className="space-y-2">
            {documents.map((doc) => (
              <a
                key={doc.id}
                href={proxiedFileUrl(doc.url)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5 text-sm transition-colors hover:bg-muted/50"
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
                <StatusBadge
                  label={DOCUMENT_STATUS_LABELS[doc.statutDocument] ?? doc.statutDocument}
                  className={DOCUMENT_STATUS_BADGE[doc.statutDocument]}
                />
                <ExternalLink className="size-3.5 shrink-0 text-muted-foreground" />
              </a>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
