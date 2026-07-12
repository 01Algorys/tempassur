export const siteConfig = {
  name: "TempAssur",
  legalName: "WN Conseil",
  tagline: "Votre assurance temporaire pas chère pour tous types de véhicules",
  description:
    "TempAssur propose une assurance temporaire 100 % en ligne de 1 à 90 jours pour automobiles, quadricycles, tracteurs agricoles, camping-cars, remorques, poids lourds, bus et autocars, ainsi qu'une assurance frontière — devis instantané et attestation immédiate.",
  url: "https://www.tempassur.com",
  ogImage: "/opengraph-image",
  email: "contact@tempassur.com",
  phone: "+33 9 70 70 53 41",
  phoneSecondary: "+33 6 05 93 84 79",
  address: "Bureau 3, 6 Rue des Bateliers, 92110 Clichy, France",
  orias: "24004933",
  keywords: [
    "assurance temporaire",
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
