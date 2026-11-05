// Pages « cas d'usage » de la phase 2 (dossier, liste des pages). BROUILLONS en français,
// à valider par le client. Avant publication : traduire les textes dans messages/*.json,
// passer USE_CASE_PAGES_PUBLISHED à true, ajouter les routes au sitemap et relier les
// cartes « Dans quelles situations ? » de l'accueil.
export const USE_CASE_PAGES_PUBLISHED = false

export type UseCaseSlug =
  | "plaque-ww"
  | "achat-vente-vehicule"
  | "import-export"
  | "sortie-fourriere"
  | "apres-resiliation"
  | "succession"
  | "controle-technique"

export interface UseCaseSection {
  heading: string
  paragraphs: string[]
  items?: string[]
}

export interface UseCaseContent {
  route: string
  label: string
  metaTitle: string
  metaDescription: string
  h1: string
  intro: string
  sections: UseCaseSection[]
  faq: { question: string; answer: string }[]
  related: { label: string; href: string }[]
}

export const USE_CASE_CONDITIONS =
  "Conducteur d’au moins 21 ans, titulaire du permis depuis au moins 2 ans, pouvant répondre NON aux quatre déclarations présentées avant le paiement : sinistres récents, résiliation pour sinistre au cours des 5 dernières années, condamnation pour infraction au code de la route, alcoolémie ou stupéfiants, malus à la recherche d’un nouvel assureur ou attente d’une décision du Bureau Central de Tarification."

const HOW_TO_SUBSCRIBE: UseCaseSection = {
  heading: "Comment souscrire ?",
  paragraphs: [],
  items: [
    "Choisissez votre véhicule et votre durée dans le tarificateur : le prix s’affiche immédiatement.",
    "Renseignez vos informations et ajoutez vos documents.",
    "Réglez en ligne : votre attestation arrive par e-mail ou WhatsApp, après paiement et signature électronique.",
  ],
}

export const USE_CASE_PAGES: Record<UseCaseSlug, UseCaseContent> = {
  "plaque-ww": {
    route: "/assurance-temporaire-plaque-ww",
    label: "Plaque WW",
    metaTitle: "Assurance temporaire plaque WW en ligne | TempAssur",
    metaDescription:
      "Véhicule en plaque WW ? Assurance temporaire en ligne, dans la limite de validité de votre certificat provisoire. Attestation par e-mail ou WhatsApp.",
    h1: "Assurance temporaire plaque WW",
    intro:
      "Un véhicule tout juste acheté ou importé circule souvent sous un certificat provisoire d’immatriculation (CPI), reconnaissable à sa plaque WW. En attendant la carte grise définitive, il doit être assuré dès qu’il prend la route.",
    sections: [
      {
        heading: "Un véhicule en WW s’assure comme les autres",
        paragraphs: [
          "TempAssur assure les véhicules en plaque WW aux mêmes conditions qu’un véhicule avec une immatriculation définitive : responsabilité civile, souscription en ligne et attestation immédiate.",
        ],
      },
      {
        heading: "La durée ne peut pas dépasser la validité du certificat",
        paragraphs: [
          "C’est le seul point de vigilance : la durée de la garantie ne peut pas dépasser la date de fin de validité du CPI. Si votre certificat expire dans 10 jours, la durée maximale assurable est de 10 jours.",
          "Vérifiez cette date avant de choisir votre durée.",
        ],
      },
      HOW_TO_SUBSCRIBE,
    ],
    faq: [
      {
        question: "Peut-on assurer un véhicule en plaque WW ?",
        answer:
          "Oui. TempAssur assure les véhicules en plaque WW aux mêmes conditions qu’un véhicule avec une immatriculation définitive.",
      },
      {
        question: "Quelle durée choisir avec une plaque WW ?",
        answer:
          "Celle dont vous avez besoin, sans dépasser la date de fin de validité de votre certificat provisoire d’immatriculation.",
      },
      {
        question: "Que risque-t-on à rouler sans assurance ?",
        answer:
          "La responsabilité civile est obligatoire dès le premier mètre. Rouler sans assurance coûte jusqu’à 3 750 € d’amende, avec suspension de permis possible.",
      },
    ],
    related: [
      { label: "Assurance auto temporaire", href: "/assurance-temporaire-automobile" },
      { label: "Import / export d’un véhicule", href: "/assurance-temporaire-import-export" },
      { label: "Article : assurer un véhicule en plaque WW", href: "/blog/souscrire-assurance-temporaire-plaque-ww" },
    ],
  },

  "achat-vente-vehicule": {
    route: "/assurance-temporaire-achat-vente-vehicule",
    label: "Achat ou vente d’un véhicule",
    metaTitle: "Assurance temporaire achat ou vente de véhicule | TempAssur",
    metaDescription:
      "Vous achetez ou vendez un véhicule ? Assurance temporaire en ligne 7j/7 pour repartir couvert le jour même. Attestation par e-mail ou WhatsApp.",
    h1: "Assurance temporaire pour l’achat ou la vente d’un véhicule",
    intro:
      "Vous venez d’acheter un véhicule à l’autre bout de la France, ou vous devez le déplacer pour le vendre ? Sans assurance, impossible de reprendre la route légalement : la responsabilité civile est obligatoire dès le premier mètre.",
    sections: [
      {
        heading: "Repartir assuré le jour même",
        paragraphs: [
          "La souscription est 100 % en ligne, 7j/7 : estimez votre tarif en 30 secondes, souscrivez en 5 minutes, payez en ligne et recevez votre attestation par e-mail ou WhatsApp, même un dimanche.",
        ],
      },
      {
        heading: "Une durée adaptée à votre besoin",
        paragraphs: [
          "Vous choisissez la durée dont vous avez besoin, le temps de rapatrier le véhicule puis de souscrire votre contrat annuel en connaissance de cause. Les durées disponibles dépendent du type de véhicule.",
        ],
      },
      {
        heading: "Le véhicule doit être immatriculé",
        paragraphs: ["Une plaque provisoire WW convient. Dans ce cas, la durée ne peut pas dépasser la validité du certificat provisoire."],
      },
      HOW_TO_SUBSCRIBE,
    ],
    faq: [
      {
        question: "Puis-je assurer une voiture que je viens d’acheter le week-end ?",
        answer:
          "Oui. La souscription est en ligne 7j/7 et l’attestation arrive par e-mail ou WhatsApp, même un dimanche.",
      },
      {
        question: "Le véhicule doit-il déjà être à mon nom ?",
        answer:
          "Le souscripteur du contrat n’est pas obligatoirement le propriétaire du véhicule. Une autre personne peut souscrire l’assurance à son nom.",
      },
      {
        question: "Que risque-t-on à rentrer sans assurance ?",
        answer: "Rouler sans assurance coûte jusqu’à 3 750 € d’amende, avec suspension de permis possible.",
      },
    ],
    related: [
      { label: "Assurance auto temporaire", href: "/assurance-temporaire-automobile" },
      { label: "Plaque WW", href: "/assurance-temporaire-plaque-ww" },
      { label: "Article : voiture achetée le week-end", href: "/blog/voiture-achetee-week-end-assurance-jour-meme" },
    ],
  },

  "import-export": {
    route: "/assurance-temporaire-import-export",
    label: "Import / export",
    metaTitle: "Assurance temporaire import export véhicule | TempAssur",
    metaDescription:
      "Véhicule importé ou à exporter ? Assurance temporaire en ligne pour vos trajets, y compris en plaque WW. Attestation par e-mail ou WhatsApp.",
    h1: "Assurance temporaire pour l’import ou l’export d’un véhicule",
    intro:
      "Importer ou exporter un véhicule implique souvent quelques trajets avant l’immatriculation définitive ou le départ. Pendant ces trajets, le véhicule doit être assuré.",
    sections: [
      {
        heading: "Véhicule importé en plaque WW",
        paragraphs: [
          "Un véhicule importé circule souvent sous un certificat provisoire d’immatriculation. Il s’assure aux mêmes conditions qu’un véhicule avec une immatriculation définitive, sans dépasser la date de fin de validité du certificat.",
        ],
      },
      {
        heading: "Véhicule encore immatriculé à l’étranger",
        paragraphs: [
          "Tout dépend du pays d’immatriculation. Pour un véhicule immatriculé dans la plupart des pays européens, votre adresse de résidence doit être située en France. Pour les autres pays, il faut souscrire une assurance frontière. Le formulaire vous indique la règle dès que vous choisissez le pays.",
        ],
      },
      {
        heading: "Vérifiez tout votre trajet",
        paragraphs: [
          "Votre assurance temporaire couvre 35 pays, et jusqu’à 42 pays avec l’extension de pays, disponible pour l’automobile uniquement. Vérifiez que tous les pays traversés sont couverts, y compris ceux où vous ne faites que passer.",
        ],
      },
      HOW_TO_SUBSCRIBE,
    ],
    faq: [
      {
        question: "Puis-je assurer un véhicule importé avant sa carte grise définitive ?",
        answer:
          "Oui, un véhicule en plaque WW s’assure comme les autres, sans dépasser la date de fin de validité du certificat provisoire.",
      },
      {
        question: "Mon véhicule a encore ses plaques étrangères, que choisir ?",
        answer:
          "Cela dépend du pays d’immatriculation : le formulaire vous indique si votre résidence doit être en France ou s’il faut souscrire une assurance frontière.",
      },
      {
        question: "Suis-je couvert sur tout le trajet d’export ?",
        answer:
          "Seulement dans les pays couverts par votre contrat. Consultez la liste avant de partir et contactez-nous en cas de doute.",
      },
    ],
    related: [
      { label: "Plaque WW", href: "/assurance-temporaire-plaque-ww" },
      { label: "Assurance frontière", href: "/assurance-frontiere" },
      { label: "Pays couverts", href: "/pays-couverts" },
    ],
  },

  "sortie-fourriere": {
    route: "/assurance-temporaire-sortie-fourriere",
    label: "Sortie de fourrière",
    metaTitle: "Assurance temporaire sortie de fourrière | TempAssur",
    metaDescription:
      "Besoin d’une attestation pour récupérer votre véhicule en fourrière ? Assurance temporaire en ligne, attestation par e-mail ou WhatsApp dès le paiement.",
    h1: "Assurance temporaire pour une sortie de fourrière",
    intro:
      "Pour récupérer un véhicule en fourrière, la loi impose de présenter une attestation d’assurance en cours de validité, avec le permis et la carte grise. Si votre véhicule n’était plus assuré, ou si votre contrat a été résilié entre-temps, vous êtes bloqué.",
    sections: [
      {
        heading: "Une attestation en quelques minutes",
        paragraphs: [
          "Souscrivez en ligne, recevez l’attestation par e-mail ou WhatsApp, présentez-la à la fourrière et repartez avec votre véhicule. Chaque jour de garde coûtant de l’argent, la rapidité compte : l’attestation part immédiatement après le paiement et la signature électronique.",
        ],
      },
      {
        heading: "Quelle durée choisir ?",
        paragraphs: [
          "Le temps de récupérer le véhicule et de souscrire une assurance classique : 8 ou 15 jours suffisent souvent. Prévoyez 30 jours si vous devez aussi passer le contrôle technique ou vendre le véhicule, lorsque cette durée existe pour votre véhicule.",
        ],
      },
      HOW_TO_SUBSCRIBE,
    ],
    faq: [
      {
        question: "Quels documents présenter à la fourrière ?",
        answer: "Une attestation d’assurance en cours de validité, avec le permis et la carte grise.",
      },
      {
        question: "En combien de temps reçoit-on l’attestation ?",
        answer: "Elle part immédiatement après le paiement et la signature électronique, par e-mail ou WhatsApp.",
      },
      {
        question: "Puis-je souscrire si mon assureur m’a résilié ?",
        answer:
          "Cela dépend du motif. Une résiliation pour sinistre au cours des 5 dernières années n’est pas éligible. En cas de doute, écrivez-nous sur WhatsApp.",
      },
    ],
    related: [
      { label: "Assurance auto temporaire", href: "/assurance-temporaire-automobile" },
      { label: "Après une résiliation", href: "/assurance-temporaire-apres-resiliation" },
      { label: "Article : sortie de fourrière", href: "/blog/assurance-sortie-fourriere" },
    ],
  },

  "apres-resiliation": {
    route: "/assurance-temporaire-apres-resiliation",
    label: "Après une résiliation",
    metaTitle: "Assurance temporaire après une résiliation | TempAssur",
    metaDescription:
      "Résilié par votre assureur ? Selon le motif, l’assurance temporaire peut vous permettre de continuer à rouler. Vérifiez les conditions avant de souscrire.",
    h1: "Assurance temporaire après une résiliation",
    intro:
      "Votre assureur a résilié votre contrat et vous devez continuer à rouler ? L’assurance temporaire peut être une solution en attendant un nouveau contrat, mais tout dépend du motif de la résiliation.",
    sections: [
      {
        heading: "Résiliation pour non-paiement",
        paragraphs: ["Une résiliation pour non-paiement peut être assurée en temporaire, si vous remplissez les autres conditions de souscription."],
      },
      {
        heading: "Résiliation pour sinistre",
        paragraphs: [
          "Une résiliation pour sinistre au cours des 5 dernières années n’est pas éligible à la souscription en ligne. Contactez-nous : nous étudierons votre situation pour chercher une solution personnalisée, sans pouvoir vous la garantir.",
        ],
      },
      {
        heading: "Soyez exact dans vos déclarations",
        paragraphs: [
          "Avant le paiement, vous certifiez répondre NON aux quatre déclarations du conducteur. Une fausse déclaration peut entraîner la nullité du contrat.",
        ],
      },
      {
        heading: "Une solution d’attente",
        paragraphs: ["L’assurance temporaire vous couvre le temps de trouver un contrat durable. Elle ne remplace pas une assurance annuelle sur le long terme."],
      },
    ],
    faq: [
      {
        question: "Je suis résilié pour non-paiement, puis-je souscrire ?",
        answer: "Oui, si vous remplissez les autres conditions de souscription et pouvez répondre NON aux quatre déclarations.",
      },
      {
        question: "Je suis résilié pour sinistre il y a moins de 5 ans, que faire ?",
        answer:
          "Vous n’êtes pas éligible à la souscription en ligne. Contactez-nous pour que nous étudiions votre situation, sans garantie de solution.",
      },
      {
        question: "Je suis malussé à la recherche d’un assureur, suis-je éligible ?",
        answer:
          "Non. Les malussés à la recherche d’un nouvel assureur et les personnes en attente d’une décision du Bureau Central de Tarification ne peuvent pas souscrire en ligne.",
      },
    ],
    related: [
      { label: "Assurance auto temporaire", href: "/assurance-temporaire-automobile" },
      { label: "Sortie de fourrière", href: "/assurance-temporaire-sortie-fourriere" },
      { label: "Contactez-nous", href: "/contact" },
    ],
  },

  succession: {
    route: "/assurance-temporaire-succession",
    label: "Véhicule en succession",
    metaTitle: "Assurance temporaire véhicule en succession | TempAssur",
    metaDescription:
      "Véhicule d’un proche décédé à déplacer pour une expertise, un contrôle technique ou une vente ? Assurance temporaire en ligne, sans engagement annuel.",
    h1: "Assurance temporaire pour un véhicule en succession",
    intro:
      "Après le décès d’un proche, son véhicule doit parfois être déplacé alors que la succession n’est pas terminée. Une assurance temporaire couvre ces trajets ponctuels, sans engagement annuel.",
    sections: [
      {
        heading: "Les situations concernées",
        paragraphs: ["Le véhicule, parfois en indivision entre héritiers, doit être assuré dès qu’il prend la route, par exemple pour :"],
        items: ["une expertise ;", "un passage au contrôle technique ;", "une vente."],
      },
      {
        heading: "Qui peut souscrire ?",
        paragraphs: [
          "Le souscripteur du contrat n’est pas obligatoirement le propriétaire du véhicule. Une autre personne peut souscrire l’assurance à son nom, si elle remplit les conditions de souscription.",
        ],
      },
      {
        heading: "Quelle durée choisir ?",
        paragraphs: ["Choisissez la durée correspondant au déplacement prévu. Si plusieurs démarches sont à venir, prévoyez une durée qui les couvre toutes."],
      },
      HOW_TO_SUBSCRIBE,
    ],
    faq: [
      {
        question: "Puis-je assurer le véhicule d’un proche décédé ?",
        answer:
          "Le souscripteur n’est pas obligatoirement le propriétaire du véhicule. En cas de doute sur votre situation, contactez-nous avant de souscrire.",
      },
      {
        question: "Faut-il un contrat annuel pour vendre le véhicule ?",
        answer: "Une assurance temporaire peut couvrir les trajets nécessaires à la vente, sans engagement annuel.",
      },
      {
        question: "Le véhicule est en indivision, cela pose-t-il problème ?",
        answer: "Contactez-nous avec les détails de votre situation avant de souscrire : nous vous répondons 7j/7.",
      },
    ],
    related: [
      { label: "Assurance auto temporaire", href: "/assurance-temporaire-automobile" },
      { label: "Contrôle technique", href: "/assurance-temporaire-controle-technique" },
      { label: "Achat ou vente d’un véhicule", href: "/assurance-temporaire-achat-vente-vehicule" },
    ],
  },

  "controle-technique": {
    route: "/assurance-temporaire-controle-technique",
    label: "Contrôle technique",
    metaTitle: "Assurance temporaire contrôle technique | TempAssur",
    metaDescription:
      "Véhicule non assuré à conduire au contrôle technique ? Une assurance temporaire de 8 à 15 jours suffit souvent. Attestation par e-mail ou WhatsApp.",
    h1: "Assurance temporaire pour le contrôle technique",
    intro:
      "Votre véhicule n’est plus assuré et vous devez le conduire au centre de contrôle technique ? Le trajet reste soumis à l’obligation d’assurance : la responsabilité civile est obligatoire dès le premier mètre.",
    sections: [
      {
        heading: "Une courte assurance suffit souvent",
        paragraphs: ["Pour conduire le véhicule au centre, une assurance de 8 à 15 jours suffit souvent. Vous ne payez que la durée dont vous avez besoin, sans engagement annuel."],
      },
      {
        heading: "Pensez à la suite",
        paragraphs: ["Si vous devez ensuite vendre le véhicule ou souscrire un contrat classique, choisissez une durée qui couvre aussi ces démarches."],
      },
      HOW_TO_SUBSCRIBE,
    ],
    faq: [
      {
        question: "Faut-il être assuré pour aller au contrôle technique ?",
        answer: "Oui. La responsabilité civile est obligatoire dès le premier mètre, y compris pour ce trajet.",
      },
      {
        question: "Quelle durée choisir ?",
        answer: "Une assurance de 8 à 15 jours suffit souvent pour conduire le véhicule au centre.",
      },
      {
        question: "Que risque-t-on à y aller sans assurance ?",
        answer: "Rouler sans assurance coûte jusqu’à 3 750 € d’amende, avec suspension de permis possible.",
      },
    ],
    related: [
      { label: "Assurance auto temporaire", href: "/assurance-temporaire-automobile" },
      { label: "Véhicule en succession", href: "/assurance-temporaire-succession" },
      { label: "Sortie de fourrière", href: "/assurance-temporaire-sortie-fourriere" },
    ],
  },
}
