import type { VehicleSlug } from "@/types"

export interface ProductFaqItem {
  question: string
  answer: string
}

export interface ProductGuaranteeOption {
  label: string
  description: string
}

export interface ProductContent {
  title: string
  metaDescription: string
  h1: string
  intro: string
  vehiclesParagraph?: string
  guaranteesIncluded: string
  options?: ProductGuaranteeOption[]
  whereCovered: string
  useCases: string[]
  eligibility: string
  faq: ProductFaqItem[]
  relatedProducts: VehicleSlug[]
}

// Texte intégral repris du dossier développeur §6.1–6.8 (une page par produit).
export const PRODUCT_CONTENT: Record<VehicleSlug, ProductContent> = {
  automobiles: {
    title: "Assurance auto temporaire 1 à 90 jours dès [PRIX] €/jour | TempAssur",
    metaDescription:
      "Assurez une voiture ou un utilitaire de 1 à 90 jours. Souscription en ligne en 5 minutes, attestation immédiate par e-mail ou WhatsApp. Dès [PRIX] €/jour.",
    h1: "Assurance auto temporaire de 1 à 90 jours",
    intro:
      "Besoin d'assurer une voiture ou un utilitaire de moins de 3,5 tonnes pour quelques jours ? L'assurance auto temporaire TempAssur vous couvre de 1 à 90 jours, sans engagement et sans tacite reconduction. Souscription 100 % en ligne en 5 minutes, attestation envoyée immédiatement par e-mail ou WhatsApp.",
    vehiclesParagraph:
      "Tous les véhicules particuliers et utilitaires de moins de 3,5 tonnes, quelle que soit la puissance : citadine, berline, SUV, fourgonnette… Le tarif dépend de la puissance fiscale et de la durée choisie.",
    guaranteesIncluded:
      "Incluses : responsabilité civile (obligatoire — dommages causés aux tiers) et défense pénale et recours suite à accident.",
    options: [
      { label: "Garantie du conducteur", description: "vous protège aussi en cas d'accident responsable." },
      {
        label: "Extension de circulation",
        description: "Albanie, Azerbaïdjan, Macédoine du Nord, Maroc, Moldavie, Tunisie, Turquie.",
      },
      { label: "Assistance", description: "" },
    ],
    whereCovered:
      "En France et dans 35 pays d'Europe et du pourtour méditerranéen. Avec l'extension, ajoutez le Maroc, la Tunisie, la Turquie et 4 autres pays.",
    useCases: [
      "Achat ou vente d'un véhicule",
      "plaque provisoire WW",
      "prêt de véhicule",
      "import / export",
      "sortie de fourrière",
      "résiliation par votre assureur",
      "véhicule en succession",
      "passage du contrôle technique",
      "conduite occasionnelle",
    ],
    eligibility:
      "Tout conducteur d'au moins 21 ans, titulaire du permis depuis au moins 2 ans, répondant aux déclarations présentées lors de la souscription.",
    faq: [
      {
        question: "Quel est le prix d'une assurance auto temporaire ?",
        answer:
          "À partir de [PRIX_GRILLE] €/jour ; le tarif exact dépend de la durée et de la puissance fiscale, il s'affiche immédiatement dans notre tarificateur.",
      },
      {
        question: "Puis-je aller au Maroc, en Tunisie ou en Turquie ?",
        answer: "Oui, avec l'option extension de circulation (automobiles uniquement).",
      },
      {
        question: "Suis-je couvert dans les DOM-TOM ?",
        answer: "Oui — les tarifs DOM-TOM diffèrent de la métropole et les options n'y sont pas disponibles.",
      },
      {
        question: "Quels documents vais-je recevoir ?",
        answer:
          "Votre contrat, votre attestation d'assurance et votre carte internationale d'assurance, par e-mail ou WhatsApp, après signature électronique.",
      },
    ],
    relatedProducts: ["camping-cars", "assurance-frontiere"],
  },

  "poids-lourds": {
    title: "Assurance poids lourd temporaire dès [PRIX] €/jour | TempAssur",
    metaDescription:
      "Camion, porteur, tracteur routier : assurance temporaire poids lourd en ligne. Attestation immédiate par e-mail ou WhatsApp.",
    h1: "Assurance temporaire poids lourd (+ de 3,5 T)",
    intro:
      "Camion porteur, tracteur routier, semi : assurez votre poids lourd pour un convoyage, un achat, un import ou une mission ponctuelle, aux durées prévues par notre grille. Attestation immédiate par e-mail ou WhatsApp.",
    guaranteesIncluded: "Responsabilité civile (obligatoire) + défense pénale et recours suite à accident.",
    whereCovered: "En France et dans 35 pays. DOM-TOM : oui, avec des tarifs spécifiques.",
    useCases: [
      "Convoyage après achat ou vente",
      "plaque WW",
      "import / export",
      "sortie de fourrière",
      "attente entre deux contrats annuels",
    ],
    eligibility:
      "Conducteur d'au moins 21 ans, 2 ans de permis, permis adapté au véhicule, déclarations conformes (voir souscription).",
    faq: [
      {
        question: "Quelles durées ?",
        answer:
          "Celles de notre grille (raccourcis 8 et 15 jours) — le tarificateur affiche toutes les durées disponibles avec leur prix.",
      },
      {
        question: "Le conducteur doit-il être le souscripteur ?",
        answer: "Non, mais il doit être déclaré et remplir les conditions d'éligibilité.",
      },
      {
        question: "Documents reçus ?",
        answer: "Contrat, attestation et carte internationale d'assurance, par e-mail ou WhatsApp.",
      },
    ],
    relatedProducts: ["bus-autocars", "remorques"],
  },

  "camping-cars": {
    title: "Assurance camping-car temporaire 1 à 90 jours | TempAssur",
    metaDescription:
      "Assurance temporaire camping-car et fourgon aménagé, de 1 à 90 jours. Souscription en ligne, attestation par e-mail ou WhatsApp.",
    h1: "Assurance temporaire camping-car et fourgon aménagé",
    intro:
      "Partez l'esprit tranquille : assurance temporaire camping-car de 1 à 90 jours, idéale pour un voyage ponctuel, un prêt, un achat ou un rapatriement. Le prix affiché correspond aux modèles de moins de 3,5 T ; il est ajusté selon le poids lors de la souscription.",
    guaranteesIncluded: "Responsabilité civile (obligatoire) + défense pénale et recours suite à accident.",
    whereCovered: "En France et dans 35 pays d'Europe — parfait pour un road-trip. DOM-TOM : oui, tarifs spécifiques.",
    useCases: [
      "Voyage ponctuel",
      "location ou prêt entre particuliers",
      "achat / vente",
      "rapatriement",
      "sortie d'hivernage",
      "contrôle technique",
    ],
    eligibility: "Conducteur d'au moins 21 ans avec 2 ans de permis.",
    faq: [
      {
        question: "Mon fourgon aménagé est-il accepté ?",
        answer: "Oui, les fourgons aménagés sont assurés comme les camping-cars.",
      },
      {
        question: "Mon camping-car dépasse 3,5 T ?",
        answer: "Il est assurable : le tarif est ajusté selon le poids à la souscription.",
      },
      { question: "Qui peut souscrire ?", answer: "Conducteur d'au moins 21 ans avec 2 ans de permis." },
    ],
    relatedProducts: ["automobiles", "remorques"],
  },

  quadricycles: {
    title: "Assurance temporaire quad, voiturette sans permis, buggy | TempAssur",
    metaDescription:
      "Quad homologué, voiturette sans permis ou buggy : assurance temporaire en ligne, attestation par e-mail ou WhatsApp.",
    h1: "Assurance temporaire quadricycles : quad, voiturette, buggy",
    intro:
      "Quad homologué, voiturette sans permis ou buggy : assurez votre quadricycle pour la durée dont vous avez vraiment besoin. Le prix d'appel affiché correspond au sous-type le moins cher ; le tarif exact s'ajuste selon votre véhicule à la souscription.",
    guaranteesIncluded: "Responsabilité civile (obligatoire) + défense pénale et recours suite à accident.",
    whereCovered: "En France et dans 35 pays. DOM-TOM : oui, tarifs spécifiques.",
    useCases: [
      "Achat / vente",
      "saison estivale",
      "sortie de fourrière",
      "véhicule de loisir utilisé quelques semaines par an",
      "contrôle technique",
    ],
    eligibility: "Conducteur d'au moins 21 ans, 2 ans de permis.",
    faq: [
      {
        question: "Quel permis pour une voiturette sans permis ?",
        answer:
          "Dès 14 ans le permis AM (ex-BSR) suffit pour conduire — mais pour souscrire chez nous, le conducteur doit avoir 21 ans et 2 ans de permis.",
      },
      {
        question: "Mon quad n'est pas homologué route ?",
        answer: "Il n'est pas assurable pour circuler sur la voie publique.",
      },
      { question: "Quelles durées ?", answer: "Celles de la grille — raccourcis 10, 15, 20 et 30 jours." },
    ],
    relatedProducts: ["automobiles", "camping-cars"],
  },

  "bus-autocars": {
    title: "Assurance temporaire bus et autocar | TempAssur",
    metaDescription:
      "Assurez un bus ou un autocar pour un convoyage, un achat ou une vente. Souscription en ligne, attestation immédiate.",
    h1: "Assurance temporaire bus et autocars",
    intro:
      "Assurez un bus ou un autocar pour un convoyage, un achat, une vente ou un transfert de véhicule. Souscription 100 % en ligne, attestation immédiate par e-mail ou WhatsApp.",
    guaranteesIncluded: "Responsabilité civile (obligatoire) + défense pénale et recours suite à accident.",
    whereCovered: "En France et dans 35 pays. DOM-TOM : oui, tarifs spécifiques.",
    useCases: ["Convoyage après achat ou vente aux enchères", "import / export", "repositionnement de flotte", "sortie de fourrière"],
    eligibility: "Conducteur d'au moins 21 ans, 2 ans de permis, déclarations conformes.",
    faq: [
      { question: "Quelles durées ?", answer: "Celles de la grille (raccourcis 8 et 15 jours)." },
      {
        question: "Le transport de passagers est-il couvert ?",
        answer:
          "La garantie couvre la responsabilité civile du véhicule ; pour un usage commercial avec passagers, contactez-nous avant de souscrire : +33 6 05 93 84 79.",
      },
    ],
    relatedProducts: ["poids-lourds", "remorques"],
  },

  "tracteurs-agricoles": {
    title: "Assurance tracteur agricole temporaire dès [PRIX] €/jour | TempAssur",
    metaDescription:
      "Moissons, convoyage, achat : assurance temporaire tracteur agricole en ligne, attestation par e-mail ou WhatsApp.",
    h1: "Assurance temporaire tracteur agricole",
    intro:
      "Moissons, convoyage, achat ou vente : assurez votre tracteur ou engin agricole pour quelques jours, sans engagement annuel. Souscription en ligne, attestation par e-mail ou WhatsApp.",
    guaranteesIncluded: "Responsabilité civile (obligatoire) + défense pénale et recours suite à accident.",
    whereCovered: "En France et dans 35 pays. DOM-TOM : oui, tarifs spécifiques.",
    useCases: ["Période de moissons ou de récolte", "convoyage après achat / vente", "prêt entre exploitants", "déplacement exceptionnel sur route"],
    eligibility: "Conducteur d'au moins 21 ans, 2 ans de permis.",
    faq: [
      { question: "Quelles durées ?", answer: "Celles de la grille (raccourcis 8 et 15 jours)." },
      { question: "Un tracteur ancien / de collection est-il accepté ?", answer: "Oui s'il est immatriculé." },
    ],
    relatedProducts: ["poids-lourds", "remorques"],
  },

  remorques: {
    title: "Assurance temporaire remorque, semi-remorque, caravane | TempAssur",
    metaDescription:
      "Remorque, semi-remorque ou caravane : assurance temporaire obligatoire au-delà de 750 kg. Souscription en ligne immédiate.",
    h1: "Assurance temporaire remorques, semi-remorques et caravanes",
    intro:
      "Remorque légère ou lourde, semi-remorque, caravane : au-delà de 750 kg de PTAC, une assurance responsabilité civile dédiée est obligatoire — celle du véhicule tracteur ne suffit plus. Assurez la vôtre pour un convoyage, un achat ou un déplacement ponctuel.",
    guaranteesIncluded: "Responsabilité civile (obligatoire) + défense pénale et recours suite à accident.",
    whereCovered: "En France et dans 35 pays. DOM-TOM : oui, tarifs spécifiques.",
    useCases: ["Achat / vente", "déménagement", "départ en vacances avec une caravane", "transport ponctuel de matériel", "import / export"],
    eligibility: "Conducteur d'au moins 21 ans, 2 ans de permis.",
    faq: [
      {
        question: "Ma remorque fait moins de 750 kg ?",
        answer: "Elle est en principe couverte par l'assurance du véhicule tracteur — vérifiez votre contrat.",
      },
      { question: "Quelles durées ?", answer: "Celles de la grille (raccourcis 8 et 15 jours)." },
    ],
    relatedProducts: ["camping-cars", "tracteurs-agricoles"],
  },

  "assurance-frontiere": {
    title: "Assurance frontière : circuler en France et en Europe avec un véhicule étranger | TempAssur",
    metaDescription:
      "Véhicule immatriculé hors UE ou à l'étranger ? L'assurance frontière vous couvre en France et dans 35 pays. 30 ou 90 jours, attestation immédiate.",
    h1: "Assurance frontière — pour circuler en France et en Europe",
    intro:
      "Votre véhicule est immatriculé hors Union européenne et hors système carte verte — ou immatriculé à l'étranger et doit circuler en France ? L'assurance frontière est la solution légale et obligatoire pour prendre la route. Et chez TempAssur, elle ne couvre pas que la France : vous êtes couvert dans 35 pays, la même liste que nos assurances temporaires. Disponible en 30 ou 90 jours — attestation par e-mail ou WhatsApp.",
    vehiclesParagraph:
      "Aux voyageurs qui viennent en Europe avec leur véhicule (Maghreb, Balkans hors carte verte, Moyen-Orient, Amériques…), aux Français de l'étranger de retour temporaire avec un véhicule immatriculé hors UE, et aux véhicules en transit ou en cours d'importation.",
    guaranteesIncluded:
      "Responsabilité civile (obligatoire) + défense pénale et recours suite à accident. Vous recevez une carte internationale d'assurance valable dans les 35 pays couverts.",
    whereCovered:
      "Dans 35 pays, pas seulement en France — c'est l'un des grands avantages de notre contrat frontière.",
    useCases: [],
    eligibility: "Conducteur d'au moins 21 ans, 2 ans de permis.",
    faq: [
      {
        question: "Suis-je couvert seulement en France ?",
        answer:
          "Non : votre assurance frontière TempAssur vous couvre dans les 35 pays de la liste commune (Allemagne, Espagne, Italie, Suisse…).",
      },
      {
        question: "Quels documents fournir ?",
        answer: "La pièce d'identité ou le passeport du conducteur, son permis, et le certificat d'immatriculation du véhicule.",
      },
      {
        question: "Puis-je souscrire avant d'arriver en France ?",
        answer:
          "Oui, 100 % en ligne, avec une date d'effet différée : vos documents vous attendent dans votre boîte mail ou sur WhatsApp.",
      },
      { question: "Quelles durées ?", answer: "30 ou 90 jours (30 jours est la formule la plus choisie)." },
    ],
    relatedProducts: ["automobiles", "camping-cars"],
  },
}
