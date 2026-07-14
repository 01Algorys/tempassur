export interface FaqCategory {
  id: string
  title: string
  items: { id: string; question: string; answer: string }[]
}

// Texte intégral repris du dossier développeur §6.11.
export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: "souscription",
    title: "La souscription",
    items: [
      {
        id: "souscription-1",
        question: "En combien de temps suis-je assuré ?",
        answer:
          "En quelques minutes : estimation du tarif, souscription en ligne, paiement par carte, signature électronique — puis votre attestation arrive par e-mail ou WhatsApp.",
      },
      {
        id: "souscription-2",
        question: "Qui peut souscrire ?",
        answer:
          "Tout conducteur d'au moins 21 ans, titulaire du permis depuis au moins 2 ans, répondant aux déclarations présentées avant le paiement (sinistres, résiliation, condamnations, malus).",
      },
      {
        id: "souscription-3",
        question: "Puis-je souscrire pour quelqu'un d'autre ?",
        answer: "Oui, mais le conducteur doit être déclaré et remplir toutes les conditions d'éligibilité.",
      },
      {
        id: "souscription-4",
        question: "Puis-je choisir l'heure d'effet ?",
        answer: "Oui, à la souscription — la garantie démarre après signature des documents.",
      },
    ],
  },
  {
    id: "prix",
    title: "Les prix",
    items: [
      {
        id: "prix-1",
        question: "Comment le prix est-il calculé ?",
        answer:
          "Selon la catégorie de véhicule, la durée, la zone (métropole ou DOM-TOM) et les options. Le prix des options dépend de la durée. Tout s'affiche dans le tarificateur, sans laisser votre e-mail.",
      },
      {
        id: "prix-2",
        question: "Les tarifs DOM-TOM sont-ils les mêmes ?",
        answer:
          "Non, ils diffèrent de la métropole ; ils s'affichent automatiquement dès que vous indiquez votre pays de résidence ou d'immatriculation. Les options n'y sont pas disponibles.",
      },
    ],
  },
  {
    id: "couverture",
    title: "La couverture",
    items: [
      {
        id: "couverture-1",
        question: "Dans quels pays suis-je couvert ?",
        answer:
          "En France et dans 35 pays — la même liste pour l'assurance temporaire et l'assurance frontière.",
      },
      {
        id: "couverture-2",
        question: "Puis-je aller au Maroc, en Tunisie ou en Turquie ?",
        answer: "Oui, avec l'option extension de circulation (automobiles uniquement).",
      },
      {
        id: "couverture-3",
        question: "Quelles garanties sont incluses ?",
        answer:
          "La responsabilité civile obligatoire et la défense pénale et recours. Pour l'automobile, des options existent : garantie du conducteur, extension de pays, assistance.",
      },
    ],
  },
  {
    id: "documents",
    title: "Les documents",
    items: [
      {
        id: "documents-1",
        question: "Quels documents vais-je recevoir ?",
        answer:
          "Votre contrat, votre attestation d'assurance et votre carte internationale d'assurance — par e-mail ou WhatsApp, au choix.",
      },
      {
        id: "documents-2",
        question: "Je n'ai pas reçu mon attestation.",
        answer:
          "Vérifiez vos spams. Si l'heure d'effet approche, contactez-nous immédiatement : WhatsApp / tél. +33 6 05 93 84 79 — nous accélérons le traitement.",
      },
    ],
  },
  {
    id: "annulation",
    title: "L'annulation",
    items: [
      {
        id: "annulation-1",
        question: "Puis-je annuler ou me faire rembourser ?",
        answer:
          "Les contrats temporaires sont à durée ferme, sans tacite reconduction ; une fois la garantie en vigueur, ils ne peuvent être ni annulés ni remboursés (voir CGV).",
      },
    ],
  },
]
