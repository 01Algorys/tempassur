export type ReportType = "quotes" | "contracts" | "payments" | "revenue" | "emails"

export const REPORT_LABELS: Record<ReportType, string> = {
  quotes: "Rapport des devis",
  contracts: "Rapport des contrats",
  payments: "Rapport des paiements",
  revenue: "Rapport de revenu",
  emails: "Rapport d'activité email",
}

const MAX_PAGES = 20

export interface ReportResult {
  rows: Record<string, unknown>[]
  summary: { label: string; value: string }[]
}

export async function generateReport(type: ReportType, dateFrom: string, dateTo: string): Promise<ReportResult> {
  switch (type) {
    case "quotes":
      return quotesReport(dateFrom, dateTo)
    case "contracts":
      return contractsReport(dateFrom, dateTo)
    case "payments":
      return paymentsReport(dateFrom, dateTo)
    case "revenue":
      return revenueReport(dateFrom, dateTo)
    case "emails":
      return emailsReport(dateFrom, dateTo)
  }
}

interface DevisRow {
  id: string
  statutPipeline: string
  montantEstime: number | null
  dateCreation: string
  client: { nom?: string; prenom?: string; email?: string } | null
  produit?: { nom: string } | null
}

async function quotesReport(dateFrom: string, dateTo: string): Promise<ReportResult> {
  const params = new URLSearchParams({ full: "1" })
  if (dateFrom) params.set("dateCreationFrom", dateFrom)
  if (dateTo) params.set("dateCreationTo", dateTo)
  const res = await fetch(`/api/admin/crm/devis?${params.toString()}`)
  const data = await res.json()
  const devis: DevisRow[] = data.devis ?? []

  const totalMontant = devis.reduce((sum, d) => sum + (d.montantEstime ?? 0), 0)
  const gagnes = devis.filter((d) => d.statutPipeline === "GAGNE").length

  return {
    rows: devis.map((d) => ({
      ID: d.id,
      Client: `${d.client?.prenom ?? ""} ${d.client?.nom ?? ""}`.trim(),
      Email: d.client?.email ?? "",
      Produit: d.produit?.nom ?? "",
      Statut: d.statutPipeline,
      Montant: d.montantEstime ?? "",
      Date: d.dateCreation,
    })),
    summary: [
      { label: "Total devis", value: String(devis.length) },
      { label: "Montant estimé cumulé", value: `${totalMontant.toFixed(2)} €` },
      { label: "Transformés en contrat", value: String(gagnes) },
    ],
  }
}

interface ContratRow {
  id: string
  numero: string
  prime: number
  dateDebut: string
  client: { nom?: string; prenom?: string; email?: string } | null
  produitRef?: { nom: string } | null
  statutRef?: { nom: string } | null
}

async function contractsReport(dateFrom: string, dateTo: string): Promise<ReportResult> {
  const all: ContratRow[] = []
  let total = Infinity
  for (let page = 1; page <= MAX_PAGES && all.length < total; page += 1) {
    const params = new URLSearchParams({ full: "1", page: String(page) })
    if (dateFrom) params.set("dateDebutFrom", dateFrom)
    if (dateTo) params.set("dateDebutTo", dateTo)
    const res = await fetch(`/api/admin/crm/contrats?${params.toString()}`)
    const data = await res.json()
    all.push(...(data.contrats ?? []))
    total = data.total ?? all.length
  }

  const totalPrime = all.reduce((sum, c) => sum + c.prime, 0)

  return {
    rows: all.map((c) => ({
      Numéro: c.numero,
      Client: `${c.client?.prenom ?? ""} ${c.client?.nom ?? ""}`.trim(),
      Email: c.client?.email ?? "",
      Produit: c.produitRef?.nom ?? "",
      Statut: c.statutRef?.nom ?? "",
      Prime: c.prime,
      "Date début": c.dateDebut,
    })),
    summary: [
      { label: "Total contrats", value: String(all.length) },
      { label: "Prime cumulée", value: `${totalPrime.toFixed(2)} €` },
    ],
  }
}

interface PaymentRow {
  id: string
  amount: number
  currency: string
  status: string
  created: number
  receipt_email: string | null
}

async function fetchAllPayments(dateFrom: string, dateTo: string): Promise<PaymentRow[]> {
  const all: PaymentRow[] = []
  let startingAfter: string | undefined
  for (let i = 0; i < MAX_PAGES; i += 1) {
    const params = new URLSearchParams({ limit: "100" })
    if (dateFrom) params.set("dateFrom", dateFrom)
    if (dateTo) params.set("dateTo", dateTo)
    if (startingAfter) params.set("startingAfter", startingAfter)
    const res = await fetch(`/api/admin/payments?${params.toString()}`)
    const data = await res.json()
    const payments: PaymentRow[] = data.payments ?? []
    all.push(...payments)
    if (!data.hasMore || payments.length === 0) break
    startingAfter = data.nextStartingAfter ?? undefined
  }
  return all
}

async function paymentsReport(dateFrom: string, dateTo: string): Promise<ReportResult> {
  const payments = await fetchAllPayments(dateFrom, dateTo)
  const succeeded = payments.filter((p) => p.status === "succeeded")
  const revenue = succeeded.reduce((sum, p) => sum + p.amount, 0) / 100

  return {
    rows: payments.map((p) => ({
      ID: p.id,
      Client: p.receipt_email ?? "",
      Montant: (p.amount / 100).toFixed(2),
      Devise: p.currency.toUpperCase(),
      Statut: p.status,
      Date: new Date(p.created * 1000).toISOString(),
    })),
    summary: [
      { label: "Total paiements", value: String(payments.length) },
      { label: "Paiements réussis", value: String(succeeded.length) },
      { label: "Revenu total", value: `${revenue.toFixed(2)} €` },
    ],
  }
}

async function revenueReport(dateFrom: string, dateTo: string): Promise<ReportResult> {
  const payments = (await fetchAllPayments(dateFrom, dateTo)).filter((p) => p.status === "succeeded")

  const byDay = new Map<string, number>()
  for (const p of payments) {
    const key = new Date(p.created * 1000).toISOString().slice(0, 10)
    byDay.set(key, (byDay.get(key) ?? 0) + p.amount / 100)
  }
  const rows = Array.from(byDay.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, revenue]) => ({ Date: date, "Revenu (€)": revenue.toFixed(2) }))

  const total = payments.reduce((sum, p) => sum + p.amount, 0) / 100

  return {
    rows,
    summary: [
      { label: "Revenu total", value: `${total.toFixed(2)} €` },
      { label: "Jours avec activité", value: String(byDay.size) },
      { label: "Paiements comptabilisés", value: String(payments.length) },
    ],
  }
}

interface EmailRow {
  id: string
  recipient: string
  subject: string
  type: string
  status: string
  createdAt: string
}

async function emailsReport(dateFrom: string, dateTo: string): Promise<ReportResult> {
  const all: EmailRow[] = []
  let total = Infinity
  for (let page = 1; page <= MAX_PAGES && all.length < total; page += 1) {
    const params = new URLSearchParams({ page: String(page) })
    if (dateFrom) params.set("dateFrom", dateFrom)
    if (dateTo) params.set("dateTo", dateTo)
    const res = await fetch(`/api/admin/crm/emails?${params.toString()}`)
    const data = await res.json()
    all.push(...(data.emails ?? []))
    total = data.total ?? all.length
  }

  const sent = all.filter((e) => e.status === "SENT").length
  const failed = all.filter((e) => e.status === "FAILED").length

  return {
    rows: all.map((e) => ({
      Destinataire: e.recipient,
      Sujet: e.subject,
      Type: e.type,
      Statut: e.status,
      Date: e.createdAt,
    })),
    summary: [
      { label: "Total emails", value: String(all.length) },
      { label: "Envoyés", value: String(sent) },
      { label: "Échecs", value: String(failed) },
    ],
  }
}
