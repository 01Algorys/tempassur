// Mirrors wn-conseil-api's lib/labels.ts — real backend enum values, not invented ones.
export const DEVIS_PIPELINE_LABELS: Record<string, string> = {
  NOUVEAU: "Nouveau / À traiter",
  QUALIFIE: "Qualifié",
  DEVIS_ENVOYE: "Devis envoyé",
  RELANCE: "Relance",
  NEGOCIATION: "Négociation",
  GAGNE: "Gagné / Transformé",
  PERDU: "Perdu",
}

export const DEVIS_PIPELINE_BADGE: Record<string, string> = {
  NOUVEAU: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  QUALIFIE: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  DEVIS_ENVOYE: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  RELANCE: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  NEGOCIATION: "bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400",
  GAGNE: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  PERDU: "bg-red-500/10 text-red-600 dark:text-red-400",
}

export const EMAIL_STATUS_LABELS: Record<string, string> = {
  QUEUED: "En file",
  SENT: "Envoyé",
  FAILED: "Échec",
}

export const EMAIL_STATUS_BADGE: Record<string, string> = {
  QUEUED: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  SENT: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  FAILED: "bg-red-500/10 text-red-600 dark:text-red-400",
}

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  succeeded: "Réussi",
  processing: "En cours",
  requires_payment_method: "Échec",
  requires_action: "Action requise",
  requires_confirmation: "En attente",
  requires_capture: "À capturer",
  canceled: "Annulé",
}

export const PAYMENT_STATUS_BADGE: Record<string, string> = {
  succeeded: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  processing: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  requires_payment_method: "bg-red-500/10 text-red-600 dark:text-red-400",
  requires_action: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  requires_confirmation: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  requires_capture: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  canceled: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
}

export const DOCUMENT_STATUS_LABELS: Record<string, string> = {
  MANQUANT: "Manquant",
  EN_ATTENTE: "En attente de validation",
  VALIDE: "Validé",
  REFUSE: "Refusé",
}

export const DOCUMENT_STATUS_BADGE: Record<string, string> = {
  MANQUANT: "bg-red-500/10 text-red-600 dark:text-red-400",
  EN_ATTENTE: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  VALIDE: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  REFUSE: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
}

export function formatFileSize(bytes: number | null | undefined): string {
  if (!bytes) return "—"
  if (bytes < 1024) return `${bytes} o`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
}

export function currencyFmt(value: number): string {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value)
}

export function dateFmt(value: string | Date | null | undefined): string {
  if (!value) return "—"
  const d = typeof value === "string" ? new Date(value) : value
  if (Number.isNaN(d.getTime())) return "—"
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })
}

export function dateTimeFmt(value: string | Date | null | undefined): string {
  if (!value) return "—"
  const d = typeof value === "string" ? new Date(value) : value
  if (Number.isNaN(d.getTime())) return "—"
  return d.toLocaleString("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
}
