"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Download, FileText, Mic, Pencil, Trash2, Upload } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { StatusBadge } from "@/components/admin/status-badge"
import { ConfirmDialog, ensureOk } from "@/components/admin/confirm-dialog"
import { DOCUMENT_STATUS_LABELS, DOCUMENT_STATUS_BADGE, formatFileSize, dateTimeFmt } from "@/lib/admin/labels"
import { proxiedFileUrl, type DocumentRecord, type Reference } from "@/lib/admin/crm-types"

// Kept for existing imports (pages typed their documents with this name).
export type AdminDocument = DocumentRecord

export const isAudio = (doc: Pick<DocumentRecord, "type">) => doc.type?.startsWith("audio/")

interface Owner {
  contratId?: string
  devisId?: string
  clientId?: string
}

function ownerFormData(owner: Owner) {
  const formData = new FormData()
  if (owner.contratId) formData.append("contratId", owner.contratId)
  if (owner.devisId) formData.append("devisId", owner.devisId)
  if (owner.clientId) formData.append("clientId", owner.clientId)
  return formData
}

// Modale d'envoi : catégorie (type de document) + note, un ou plusieurs fichiers.
export function UploadDocumentDialog({
  open,
  onOpenChange,
  owner,
  accept,
  onUploaded,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  owner: Owner
  accept?: string
  onUploaded: () => void
}) {
  const [types, setTypes] = useState<Reference[]>([])
  const [typeId, setTypeId] = useState("")
  const [note, setNote] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setTypeId("")
    setNote("")
    setFiles([])
    setError(null)
    fetch("/api/admin/crm/documents?full=1&page=1&pageSize=1")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => data && setTypes(data.types ?? []))
      .catch(() => {})
  }, [open])

  async function handleUpload() {
    if (files.length === 0) return
    setUploading(true)
    setError(null)
    try {
      const formData = ownerFormData(owner)
      if (typeId) formData.append("typeDocumentId", typeId)
      if (note.trim()) formData.append("note", note.trim())
      if (accept === "audio/*") formData.append("libelleAutre", "Audio")
      for (const f of files) formData.append("file", f)
      const res = await fetch("/api/admin/crm/documents", { method: "POST", body: formData })
      await ensureOk(res, "Échec de l'envoi du document.")
      onUploaded()
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{accept === "audio/*" ? "Ajouter un audio" : "Ajouter un document"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Fichier(s)</Label>
            <Input type="file" multiple accept={accept} onChange={(e) => setFiles(Array.from(e.target.files ?? []))} />
          </div>
          {accept === "audio/*" ? null : (
            <div className="space-y-1.5">
              <Label>Catégorie</Label>
              <Select value={typeId || "__none"} onValueChange={(v) => setTypeId(v === "__none" ? "" : v)}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none">Non classé</SelectItem>
                  {types.map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.nom}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="space-y-1.5">
            <Label>Note</Label>
            <Textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={handleUpload} disabled={uploading || files.length === 0}>
            <Upload /> {uploading ? "Envoi..." : "Envoyer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function EditNoteDialog({
  document,
  onOpenChange,
  onSaved,
}: {
  document: DocumentRecord | null
  onOpenChange: (open: boolean) => void
  onSaved: () => void
}) {
  const [note, setNote] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setNote(document?.note ?? "")
    setError(null)
  }, [document])

  async function handleSave() {
    if (!document) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/crm/documents/${document.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: note.trim() || null }),
      })
      await ensureOk(res, "Échec de l'enregistrement de la note.")
      onSaved()
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={!!document} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Note du document</DialogTitle>
        </DialogHeader>
        <Textarea rows={4} value={note} onChange={(e) => setNote(e.target.value)} />
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={handleSave} disabled={saving}>{saving ? "Enregistrement..." : "Enregistrer"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function useDocumentActions(onChange: () => void) {
  const [editing, setEditing] = useState<DocumentRecord | null>(null)
  const [deleting, setDeleting] = useState<DocumentRecord | null>(null)

  const dialogs = (
    <>
      <EditNoteDialog document={editing} onOpenChange={(o) => !o && setEditing(null)} onSaved={onChange} />
      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
        title="Supprimer le document"
        description={deleting ? `Supprimer définitivement « ${deleting.nomAffiche ?? deleting.nom} » ?` : ""}
        confirmLabel="Supprimer"
        destructive
        onConfirm={async () => {
          if (!deleting) return
          await ensureOk(await fetch(`/api/admin/crm/documents/${deleting.id}`, { method: "DELETE" }), "Échec de la suppression.")
          onChange()
        }}
      />
    </>
  )
  return { setEditing, setDeleting, dialogs }
}

function DocumentRow({
  doc,
  onEditNote,
  onDelete,
}: {
  doc: DocumentRecord
  onEditNote: () => void
  onDelete: () => void
}) {
  const name = doc.nomAffiche ?? doc.nom
  return (
    <div className="rounded-lg border border-border px-3 py-2.5 text-sm">
      <div className="flex items-center gap-3">
        {isAudio(doc) ? (
          <Mic className="size-4.5 shrink-0 text-muted-foreground" />
        ) : (
          <FileText className="size-4.5 shrink-0 text-muted-foreground" />
        )}
        <a href={proxiedFileUrl(doc.url)} target="_blank" rel="noopener noreferrer" className="min-w-0 flex-1">
          <p className="truncate font-medium text-foreground">
            {doc.typeDocumentRef?.nom ?? (isAudio(doc) ? "Audio" : "Document")}
            {doc.libelleAutre && doc.libelleAutre !== "Audio" ? ` — ${doc.libelleAutre}` : ""}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {name} · {formatFileSize(doc.taille)} · {dateTimeFmt(doc.createdAt)}
          </p>
        </a>
        {isAudio(doc) ? null : (
          <StatusBadge
            label={DOCUMENT_STATUS_LABELS[doc.statutDocument] ?? doc.statutDocument}
            className={DOCUMENT_STATUS_BADGE[doc.statutDocument]}
          />
        )}
        <a href={proxiedFileUrl(doc.url, name)} aria-label="Télécharger">
          <Download className="size-4 shrink-0 text-muted-foreground hover:text-foreground" />
        </a>
        <Button variant="ghost" size="icon-sm" onClick={onEditNote} aria-label="Modifier la note">
          <Pencil className="size-3.5" />
        </Button>
        <Button variant="ghost" size="icon-sm" onClick={onDelete} aria-label="Supprimer">
          <Trash2 className="text-destructive" />
        </Button>
      </div>
      {isAudio(doc) ? <audio controls preload="none" src={proxiedFileUrl(doc.url)} className="mt-2 h-9 w-full" /> : null}
      {doc.note ? <p className="mt-1.5 whitespace-pre-line text-xs text-foreground">{doc.note}</p> : null}
    </div>
  )
}

export function DocumentsCard({
  documents,
  contratId,
  devisId,
  clientId,
  audio = false,
}: {
  documents: DocumentRecord[]
  // Où rattacher les nouveaux documents (au moins un des trois).
  contratId?: string
  devisId?: string
  clientId?: string
  // true : carte "Audio" (fichiers audio seulement) ; false : autres documents.
  audio?: boolean
}) {
  const router = useRouter()
  const [uploadOpen, setUploadOpen] = useState(false)
  const refresh = () => router.refresh()
  const { setEditing, setDeleting, dialogs } = useDocumentActions(refresh)
  const canUpload = !!(contratId || devisId || clientId)
  const shown = documents.filter((d) => (audio ? isAudio(d) : !isAudio(d)))
  const owner = { contratId, devisId, clientId: contratId || devisId ? undefined : clientId }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle className="flex items-center gap-2">
          {audio ? <Mic className="size-4.5 text-muted-foreground" /> : null}
          {audio ? "Audio" : "Documents"} ({shown.length})
        </CardTitle>
        {canUpload ? (
          <Button variant="outline" size="sm" onClick={() => setUploadOpen(true)}>
            <Upload /> {audio ? "Ajouter un audio" : "Ajouter un document"}
          </Button>
        ) : null}
      </CardHeader>
      <CardContent>
        {shown.length === 0 ? (
          <p className="text-sm text-muted-foreground">{audio ? "Aucun enregistrement audio." : "Aucun document déposé."}</p>
        ) : (
          <div className="space-y-2">
            {shown.map((doc) => (
              <DocumentRow key={doc.id} doc={doc} onEditNote={() => setEditing(doc)} onDelete={() => setDeleting(doc)} />
            ))}
          </div>
        )}
      </CardContent>
      {canUpload ? (
        <UploadDocumentDialog
          open={uploadOpen}
          onOpenChange={setUploadOpen}
          owner={owner}
          accept={audio ? "audio/*" : undefined}
          onUploaded={refresh}
        />
      ) : null}
      {dialogs}
    </Card>
  )
}
