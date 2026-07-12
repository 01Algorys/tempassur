export interface FaqCategory {
  id: string
  title: string
  items: { id: string; question: string; answer: string }[]
}

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: "pays-couverts",
    title: "Pays couverts par l'assurance auto temporaire",
    items: [
      {
        id: "pays-couverts-1",
        question: "Dans quels pays mon véhicule est-il couvert par la responsabilité civile ?",
        answer:
          "L'assurance temporaire auto couvre la responsabilité civile en Autriche, Belgique, Bulgarie, Chypre, République Tchèque, Allemagne, Danemark, Espagne, Estonie, France, Finlande, Grèce, Hongrie, Croatie, Italie, Irlande, Islande, Luxembourg, Lituanie, Lettonie, Malte, Norvège, Pays-Bas, Portugal, Pologne, Roumanie, Suède, Slovaquie, Slovénie, Suisse et Royaume-Uni.",
      },
    ],
  },
  {
    id: "assurance-frontiere",
    title: "Assurance frontière",
    items: [
      {
        id: "frontiere-1",
        question: "Quels sont les pays accessibles avec une assurance frontière ?",
        answer:
          "L'assurance frontière couvre les mêmes 31 pays que l'assurance temporaire, plus quatre pays supplémentaires : la Serbie, l'Andorre, la Bosnie-Herzégovine et le Monténégro.",
      },
      {
        id: "frontiere-2",
        question: "Qui doit souscrire une assurance frontière ?",
        answer:
          "Les conducteurs de véhicules terrestres à moteur qui ne sont pas immatriculés dans un pays membre du système carte verte doivent la souscrire. Cela concerne les véhicules immatriculés en dehors de l'Espace Économique Européen.",
      },
      {
        id: "frontiere-3",
        question: "Quelle est la durée du contrat d'assurance frontière ?",
        answer:
          "L'assurance frontière ne peut être souscrite que pour une durée de 30 jours ou 90 jours, conformément au Code des assurances.",
      },
    ],
  },
  {
    id: "eligibilite",
    title: "Conditions d'éligibilité à l'assurance auto temporaire",
    items: [
      {
        id: "eligibilite-1",
        question: "Puis-je souscrire une assurance auto temporaire si j'ai eu plusieurs sinistres récents ?",
        answer:
          "Non, si vous avez déclaré au cours des 36 derniers mois plus de 2 sinistres matériels (responsables ou partiellement responsables) ou un sinistre corporel.",
      },
      {
        id: "eligibilite-2",
        question: "Puis-je souscrire si mon précédent assureur m'a résilié pour sinistre ?",
        answer:
          "Non, vous ne serez pas éligible si vous avez été résilié pour sinistre par un assureur au cours des 5 dernières années.",
      },
      {
        id: "eligibilite-3",
        question: "Que se passe-t-il si j'ai eu une condamnation pénale liée à la conduite ?",
        answer:
          "Si vous avez été condamné pour infraction au Code de la route, alcoolémie ou usage de stupéfiants, vous ne pourrez pas souscrire cette assurance.",
      },
      {
        id: "eligibilite-4",
        question: "Mon malus peut-il m'empêcher d'obtenir une assurance temporaire ?",
        answer:
          "Oui, si vous êtes malussé ou en attente d'une décision du Bureau Central de Tarification, vous ne pourrez pas souscrire.",
      },
    ],
  },
  {
    id: "documents",
    title: "Documents nécessaires pour souscrire une assurance temporaire",
    items: [
      {
        id: "documents-1",
        question: "Quels documents sont requis pour le conducteur assuré ?",
        answer:
          "Le permis de conduire national (recto-verso), valide pour la catégorie du véhicule, délivré depuis au moins 2 ans, pour un conducteur âgé de 21 à 90 ans. Une carte d'identité est requise uniquement pour les voiturettes sans permis.",
      },
      {
        id: "documents-2",
        question: "Quels documents sont nécessaires pour le véhicule assuré ?",
        answer:
          "Vous devez fournir l'un des documents suivants : carte grise (recto-verso), certificat provisoire d'immatriculation en cours de validité, facture d'adjudication datant de moins de 2 mois, fiche d'immobilisation police datant de moins de 2 mois, ou certificat de cession accompagné du talon de la carte grise.",
      },
      {
        id: "documents-3",
        question: "Y a-t-il des documents spécifiques pour certains types de véhicules ?",
        answer:
          "Oui. Pour les véhicules de plus de 30 CV fiscaux ou valant plus de 45 000 €, des photos sous plusieurs angles sont demandées. Pour les remorques de moins de 3,5 T, la carte grise du véhicule tracteur est requise.",
      },
    ],
  },
  {
    id: "location",
    title: "Assurance auto temporaire pour véhicules de location",
    items: [
      {
        id: "location-1",
        question: "Puis-je assurer un véhicule de location ?",
        answer:
          "Oui, mais TempAssur ne peut pas assurer les véhicules loués auprès de Hertz, Europcar, Sixt, Budget, Avis, Enterprise, Thrifty ou National Car Rental.",
      },
      {
        id: "location-2",
        question: "Que faire si le véhicule est loué auprès d'une autre agence ?",
        answer:
          "Si le véhicule est loué à l'étranger, l'assurance ne peut pas être souscrite. S'il est loué en France auprès d'une autre agence, l'assurance temporaire est possible.",
      },
    ],
  },
  {
    id: "pays-non-couverts",
    title: "Pays non couverts par l'assurance temporaire",
    items: [
      {
        id: "non-couverts-1",
        question: "Dans quels pays mon véhicule n'est-il pas couvert par l'assurance temporaire ?",
        answer:
          "L'assurance ne couvre pas l'Albanie, l'Azerbaïdjan, la Biélorussie, l'Iran, le Maroc, la Moldavie, la Macédoine du Nord, la Russie, la Tunisie, la Turquie et l'Ukraine.",
      },
      {
        id: "non-couverts-2",
        question: "Que se passe-t-il si je me rends dans un pays non couvert ?",
        answer:
          "Vous ne serez pas protégé en cas d'accident ou de sinistre et pourriez être contraint de payer tous les frais liés aux dommages.",
      },
      {
        id: "non-couverts-3",
        question: "Comment savoir si mon trajet est bien assuré ?",
        answer:
          "Avant de souscrire, vérifiez la liste des pays couverts ou contactez le service client.",
      },
      {
        id: "non-couverts-4",
        question: "Que faire si j'ai besoin d'une assurance pour l'un des pays exclus ?",
        answer:
          "TempAssur conseille de souscrire auprès d'un assureur local ou de vérifier la disponibilité d'une assurance frontière au point d'entrée.",
      },
      {
        id: "non-couverts-5",
        question:
          "Je viens de Tunisie et je souhaite voyager en France avec mon véhicule : comment faire pour être assuré ?",
        answer:
          "Deux options : souscrire une assurance frontière à l'entrée du territoire (15 à 90 jours) ou souscrire une assurance auto temporaire directement en ligne avant l'arrivée en France, avec attestation immédiate et conformité aux exigences légales françaises.",
      },
    ],
  },
]
