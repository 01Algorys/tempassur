import type { NextRequest } from "next/server"

import { getAdminSession, getAdminToken } from "@/lib/admin/server-session"
import { crmAdminJson } from "@/lib/admin/crm-client"
import { getStripe } from "@/lib/stripe"

export const runtime = "nodejs"

// Server-Sent Events endpoint for the notification bell. There's no event bus on
// the CRM (adding pub/sub there is out of scope for this pass), so this polls the
// same list endpoints the dashboard already uses and diffs against the last poll —
// real data, "live" in the sense of no manual refresh, just not push-driven.
const POLL_INTERVAL_MS = 8000

interface DevisLite {
  id: string
  statutPipeline: string
  dateCreation: string
  client?: { nom?: string; prenom?: string } | null
}
interface ContratLite {
  id: string
  numero: string
  createdAt: string
  client?: { nom?: string; prenom?: string } | null
}
interface EmailLite {
  id: string
  recipient: string
  subject: string
  status: string
  createdAt: string
}

function sseMessage(event: string, data: unknown): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
}

export async function GET(req: NextRequest) {
  const session = await getAdminSession()
  const token = await getAdminToken()
  if (!session || session.role !== "SUPER_ADMIN" || !token) {
    return new Response("Unauthorized", { status: 401 })
  }

  const encoder = new TextEncoder()
  let since = new Date()
  let closed = false

  const stream = new ReadableStream({
    start(controller) {
      const send = (event: string, data: unknown) => {
        if (closed) return
        try {
          controller.enqueue(encoder.encode(sseMessage(event, data)))
        } catch {
          closed = true
        }
      }

      send("connected", { at: since.toISOString() })

      const poll = async () => {
        if (closed) return
        const pollStart = new Date()
        try {
          const [devis, contrats, emails, payments] = await Promise.all([
            crmAdminJson<DevisLite[]>("/api/devis", token).catch(() => []),
            crmAdminJson<ContratLite[]>("/api/contrats", token).catch(() => []),
            crmAdminJson<{ emails: EmailLite[] }>("/api/emails", token)
              .then((r) => r.emails)
              .catch(() => []),
            getStripe()
              .paymentIntents.list({ limit: 10 })
              .then((r) => r.data)
              .catch(() => []),
          ])

          for (const d of devis) {
            if (new Date(d.dateCreation) > since) {
              const name = [d.client?.prenom, d.client?.nom].filter(Boolean).join(" ") || "Client"
              send("notification", {
                id: `devis-${d.id}`,
                type: "quote_created",
                title: "Nouveau devis",
                message: `${name} — ${d.statutPipeline}`,
                createdAt: d.dateCreation,
              })
            }
          }
          for (const c of contrats) {
            if (new Date(c.createdAt) > since) {
              const name = [c.client?.prenom, c.client?.nom].filter(Boolean).join(" ") || "Client"
              send("notification", {
                id: `contrat-${c.id}`,
                type: "contract_created",
                title: "Nouveau contrat",
                message: `${c.numero} — ${name}`,
                createdAt: c.createdAt,
              })
            }
          }
          for (const e of emails) {
            if (new Date(e.createdAt) > since) {
              send("notification", {
                id: `email-${e.id}`,
                type: e.status === "FAILED" ? "email_failed" : "email_sent",
                title: e.status === "FAILED" ? "Échec d'envoi email" : "Email envoyé",
                message: `${e.subject} → ${e.recipient}`,
                createdAt: e.createdAt,
              })
            }
          }
          for (const p of payments) {
            const createdAt = new Date(p.created * 1000)
            if (createdAt > since) {
              send("notification", {
                id: `payment-${p.id}`,
                type: p.status === "succeeded" ? "payment_completed" : p.status === "canceled" ? "payment_failed" : "payment_pending",
                title: p.status === "succeeded" ? "Paiement réussi" : p.status === "canceled" ? "Paiement échoué" : "Paiement en cours",
                message: `${(p.amount / 100).toFixed(2)} € — ${p.status}`,
                createdAt: createdAt.toISOString(),
              })
            }
          }
        } catch (error) {
          send("error", { message: "Polling failed", detail: error instanceof Error ? error.message : String(error) })
        } finally {
          since = pollStart
        }
      }

      const interval = setInterval(poll, POLL_INTERVAL_MS)

      req.signal.addEventListener("abort", () => {
        closed = true
        clearInterval(interval)
        try {
          controller.close()
        } catch {
          // already closed
        }
      })
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  })
}
