// Suivi des clics WhatsApp et tel: comme événements GTM/GA4 (dossier §8, point 9).
// Pousse un événement dans dataLayer si le conteneur GTM (NEXT_PUBLIC_GTM_ID) est actif ;
// no-op silencieux sinon (SSR, ou tag non configuré).
export function trackEvent(eventName: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return
  const w = window as unknown as { dataLayer?: Record<string, unknown>[] }
  w.dataLayer = w.dataLayer || []
  w.dataLayer.push({ event: eventName, ...params })
}
