"use client"

import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"

// Mesure d'audience sans cookie : signale chaque page affichée à /api/stats/hit (serveur du
// site), qui la transmet au CRM WN Conseil (panneau admin › Statistiques web).
// Seuls le chemin de la page (sans paramètres) et, à l'arrivée, le domaine d'origine sont
// envoyés ; rien n'est stocké dans le navigateur.
export default function SiteStats() {
  const pathname = usePathname()
  const first = useRef(true)

  useEffect(() => {
    if (!pathname) return
    let entree = false
    let source: string | null = null
    if (first.current) {
      // Première page affichée dans cet onglet : visite qui commence si l'on arrive de l'extérieur.
      first.current = false
      try {
        const ref = document.referrer ? new URL(document.referrer) : null
        if (!ref) entree = true
        else if (ref.host !== window.location.host) {
          entree = true
          source = ref.host
        }
      } catch {
        entree = true
      }
    }
    const body = JSON.stringify({ chemin: pathname, entree, source })
    try {
      if (!navigator.sendBeacon?.("/api/stats/hit", new Blob([body], { type: "application/json" }))) throw new Error("beacon")
    } catch {
      fetch("/api/stats/hit", { method: "POST", body, keepalive: true, headers: { "Content-Type": "application/json" } }).catch(() => {})
    }
  }, [pathname])

  return null
}
