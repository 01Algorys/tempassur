const WHATSAPP_NUMBER = "33605938479"

export const siteConfig = {
  name: "TempAssur",
  legalName: "WN Conseil",
  tagline: "Assurance temporaire de 1 à 90 jours, pour tous types de véhicules",
  description:
    "TempAssur propose une assurance temporaire 100 % en ligne de 1 à 90 jours pour automobiles, quadricycles, tracteurs agricoles, camping-cars, remorques, poids lourds, bus et autocars, ainsi qu'une assurance frontière — devis instantané et attestation immédiate par e-mail ou WhatsApp.",
  url: "https://www.tempassur.com",
  ogImage: "/opengraph-image",
  email: "contact@tempassur.com",
  // Numéro principal partout (dossier §0/§7) : le 06, cliquable tel:/WhatsApp. Le fixe
  // n'est qu'un numéro secondaire.
  phone: "+33 6 05 93 84 79",
  phoneSecondary: "+33 9 70 70 53 41",
  address: "Bureau 3, 6 Rue des Bateliers, 92110 Clichy, France",
  orias: "24004933",
  googleMapsUrl: "https://maps.app.goo.gl/7fc1hB29zkNHGjbZ8",
  keywords: [
    "assurance temporaire",
    "assurance temporaire tracteur",
    "assurance auto temporaire",
    "assurance provisoire",
    "assurance frontière",
    "assurance temporaire poids lourd",
    "assurance temporaire camping-car",
    "TempAssur",
    "attestation d'assurance en ligne",
  ],
} as const

export type SiteConfig = typeof siteConfig

// Le déploiement définit NEXT_PUBLIC_SITE_ENV=preprod sur l'hébergement Hostinger de
// préproduction pour empêcher son indexation (dossier §8) — l'auth basique reste à
// activer côté hébergeur (voir rapport final, point ouvert SEO).
export const isPreprodEnv = process.env.NEXT_PUBLIC_SITE_ENV === "preprod"

export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

export function whatsappQuoteMessage(categoryLabel: string, duree: number): string {
  return `Bonjour, je souhaite une assurance temporaire ${categoryLabel} pour ${duree} jours`
}
