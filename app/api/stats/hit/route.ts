import { createHash } from "node:crypto"
import { after } from "next/server"

// Page vue signalée par le navigateur (components/SiteStats.tsx), transmise au CRM WN Conseil
// avec la clé partenaire du site. Aucune adresse IP ni cookie n'est conservé : le visiteur est
// une empreinte anonyme (IP + navigateur + jour, avec un secret serveur) qui change chaque jour.

const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|headless|lighthouse|pingdom|uptime|monitor|curl|wget|python|axios|node-fetch|go-http/i

function parisDay(): string {
  return new Intl.DateTimeFormat("fr-CA", { timeZone: "Europe/Paris" }).format(new Date())
}

function device(ua: string): "mobile" | "tablette" | "ordinateur" {
  if (/iPad|Tablet/i.test(ua)) return "tablette"
  if (/Mobi|Android|iPhone/i.test(ua)) return "mobile"
  return "ordinateur"
}

export async function POST(request: Request) {
  const crmUrl = process.env.CRM_API_URL?.replace(/\/+$/, "")
  const crmKey = process.env.CRM_PARTNER_API_KEY
  const ua = request.headers.get("user-agent") ?? ""
  if (!crmUrl || !crmKey || !ua || BOT.test(ua)) return new Response(null, { status: 204 })

  const body = (await request.json().catch(() => null)) as { chemin?: unknown; entree?: unknown; source?: unknown } | null
  const raw = typeof body?.chemin === "string" ? body.chemin : ""
  const chemin = raw.split(/[?#]/)[0].replace(/(.)\/+$/, "$1").slice(0, 300)
  if (!chemin.startsWith("/") || chemin.startsWith("/api/") || chemin.startsWith("/admin-panel")) {
    return new Response(null, { status: 204 })
  }
  const source = typeof body?.source === "string" && /^[a-z0-9.-]{1,120}$/i.test(body.source) ? body.source.toLowerCase() : null

  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || request.headers.get("x-real-ip") || ""
  const host = request.headers.get("host") ?? ""
  const visiteur = createHash("sha256").update(`${crmKey}|${parisDay()}|${host}|${ip}|${ua}`).digest("hex").slice(0, 32)
  const pays = request.headers.get("x-vercel-ip-country")
  const hit = {
    chemin,
    source,
    visiteur,
    entree: body?.entree === true,
    pays: pays && /^[A-Z]{2}$/.test(pays) ? pays : null,
    appareil: device(ua),
  }

  // Envoi après la réponse : la page du visiteur n'attend jamais le CRM.
  after(async () => {
    try {
      await fetch(`${crmUrl}/api/analytics/collect`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${crmKey}` },
        body: JSON.stringify(hit),
      })
    } catch (err) {
      console.error("[stats] envoi au CRM impossible", err)
    }
  })
  return new Response(null, { status: 204 })
}
