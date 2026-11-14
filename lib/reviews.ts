// Sélection d'avis publiés sur la fiche Google Business Profile (relevés le 14/11/2026).
// Textes repris tels quels, en français, sans modification. La note et le nombre d'avis
// sont à mettre à jour à la main : ils ne se synchronisent pas avec Google.
export const GOOGLE_RATING = { rating: 4.9, count: 79 }

export interface CustomerReview {
  author: string
  // Mois approximatif : Google n'affiche qu'une date relative (« il y a un mois »).
  date: string
  rating: 5
  text: string
}

export const CUSTOMER_REVIEWS: CustomerReview[] = [
  {
    author: "Teri R.",
    date: "2026-10",
    rating: 5,
    text: "Un service client absolument exceptionnel !\n\nAprès avoir passé une journée entière à essayer, sans succès, de renouveler mon assurance automobile temporaire auprès d'un autre prestataire, j'ai découvert TempAssur.\n\nJ'ai effectué ma souscription en ligne, mais j'ai rencontré un problème pour recevoir les documents nécessaires à la finalisation du contrat.\n\nJ'ai envoyé un message WhatsApp vers 23 heures, un vendredi soir, sans vraiment espérer de réponse avant le lendemain. À ma grande surprise, Walid m'a répondu presque immédiatement !\n\nIl a pris le temps de vérifier mon dossier, de corriger certaines erreurs dans les documents, de répondre à mes questions et de m'accompagner jusqu'à la réception de mon attestation d'assurance, après minuit !\n\nSa gentillesse, sa patience, son professionnalisme et sa disponibilité ont été tout simplement remarquables.\n\nUn immense merci à Walid ! C'est tellement rare de rencontrer une personne aussi dévouée à ses clients. Je recommande vivement TempAssur !",
  },
  {
    author: "Hichem R.",
    date: "2026-10",
    rating: 5,
    text: "Service efficace et rapide, en particulier de la part de l'agent Walid Nefzi : très aimable et ultra-professionnel ! 10/10",
  },
  {
    author: "Charles L.",
    date: "2026-03",
    rating: 5,
    text: "J'ai eu recours aux services de cette agence d'assurance en décembre 2025 afin d'assurer pour trois semaines mon véhicule, le temps de faire les formalités nécessaires à son immatriculation dans un autre pays européen, et tout se passa très bien. J'eus affaire à une personne très réactive et aimable, capable d'expliquer au novice que je suis tout ce qu'il y avait besoin de savoir, et l'ensemble de la procédure fut mené avec une grande fluidité, malgré la période de Noël. Que du positif, merci encore !",
  },
  {
    author: "Aly E.",
    date: "2026-10",
    rating: 5,
    text: "un accompagnement très professionnel pour souscrire à une assurance automobile merci beaucoup de m’avoir facilité cette démarche je vous recommande vivement!",
  },
  {
    author: "Obito",
    date: "2026-07",
    rating: 5,
    text: "Très rapide, j’avais besoin d’une assurance dans un délai très court et su répondre à mes attentes, très professionnel",
  },
]
