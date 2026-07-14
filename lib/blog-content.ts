import type { VehicleSlug } from "@/types"

export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }

export interface BlogArticle {
  slug: string
  title: string
  metaDescription: string
  date: string
  body: BlogBlock[]
  relatedProducts: VehicleSlug[]
}

export interface BlogBrief {
  title: string
  slug: string
  brief: string
}

// Articles migrés depuis www.tempassur.com (dossier §9.1), mêmes slugs conservés pour
// préserver le référencement. Le texte a été récrit à neuf (pas une reprise du contenu
// existant) pour rester rigoureusement aligné sur les règles actuelles de tarification
// et de garanties (§1/§5) ; seuls les deux articles marqués comme "texte intégral" dans
// le dossier (§9.2.1 et §9.2.2/§9.2.3, plus bas) sont repris mot pour mot depuis le
// dossier lui-même.
export const BLOG_ARTICLES: BlogArticle[] = [
  {
    slug: "assurance-temporaire-caravane-remorque-semi",
    title: "Assurance temporaire pour remorque, semi-remorque ou caravane",
    metaDescription:
      "Remorque, semi-remorque ou caravane à assurer pour quelques jours ? La solution temporaire TempAssur, sans engagement annuel.",
    date: "2025-09-27",
    relatedProducts: ["remorques", "camping-cars"],
    body: [
      {
        type: "p",
        text: "Déménagement, prêt entre particuliers, départ en vacances avec une caravane ou convoyage avant une vente : ces usages ponctuels ne justifient pas toujours un contrat annuel. Au-delà de 750 kg de PTAC, une remorque ou une caravane doit disposer de sa propre responsabilité civile — celle du véhicule tracteur ne suffit plus.",
      },
      { type: "h2", text: "Ce que couvre le contrat" },
      {
        type: "p",
        text: "Le contrat temporaire remorque comprend la responsabilité civile obligatoire et la défense pénale et recours suite à accident. Aucune option n'est proposée pour cette catégorie.",
      },
      { type: "h2", text: "Quelle durée choisir ?" },
      {
        type: "p",
        text: "La grille propose des durées de 1 à 15 jours, avec deux raccourcis pratiques : 8 et 15 jours. Le tarificateur affiche toutes les durées disponibles avec leur prix.",
      },
      {
        type: "p",
        text: "La souscription se fait entièrement en ligne, et l'attestation part par e-mail ou WhatsApp dès la signature électronique du contrat.",
      },
    ],
  },
  {
    slug: "souscrire-assurance-temporaire-plaque-ww",
    title: "Peut-on assurer temporairement un véhicule avec des plaques WW ?",
    metaDescription:
      "Certificat provisoire d'immatriculation (plaque WW) : comment l'assurer temporairement avec TempAssur.",
    date: "2025-07-16",
    relatedProducts: ["automobiles", "poids-lourds"],
    body: [
      {
        type: "p",
        text: "Un véhicule tout juste acheté ou importé circule souvent, pendant quelques semaines, sous un certificat provisoire d'immatriculation (CPI), reconnaissable à sa plaque « WW ». En attendant la carte grise définitive, ce véhicule doit malgré tout être assuré dès qu'il prend la route.",
      },
      { type: "h2", text: "Un véhicule en WW s'assure comme les autres" },
      {
        type: "p",
        text: "TempAssur assure les véhicules en plaque WW aux mêmes conditions qu'un véhicule avec une immatriculation définitive : responsabilité civile, souscription en ligne, attestation immédiate. Un seul point de vigilance : la durée de la garantie ne peut pas dépasser la date de fin de validité du CPI. Si le certificat expire dans 10 jours, la durée maximale assurable est de 10 jours.",
      },
      { type: "h2", text: "Comment souscrire" },
      {
        type: "p",
        text: "Choisissez la catégorie de votre véhicule dans le tarificateur, indiquez sa date de mise en circulation et ses informations, puis réglez en ligne : l'attestation arrive par e-mail ou WhatsApp, quelques minutes après signature électronique.",
      },
    ],
  },
  {
    slug: "suppression-vignette-assurance-temporaire",
    title: "Suppression de la vignette verte : ce qui change pour l'assurance temporaire",
    metaDescription: "Depuis avril 2024, la vignette verte a disparu : comment prouver votre assurance temporaire lors d'un contrôle ?",
    date: "2025-07-27",
    relatedProducts: ["automobiles"],
    body: [
      {
        type: "p",
        text: "Depuis le 1er avril 2024, l'apposition de la vignette verte sur le pare-brise n'est plus obligatoire : les forces de l'ordre vérifient désormais l'assurance d'un véhicule directement via le Fichier des Véhicules Assurés (FVA).",
      },
      { type: "h2", text: "Ce qui remplace la carte verte" },
      {
        type: "p",
        text: "Pour un contrat temporaire, l'attestation numérique envoyée par e-mail ou WhatsApp après la souscription joue ce rôle : elle indique la période de validité, le véhicule assuré et l'assureur, et peut être présentée imprimée ou sur smartphone en cas de contrôle.",
      },
      { type: "h2", text: "Ce qui ne change pas" },
      {
        type: "p",
        text: "La durée de la garantie temporaire reste de 1 à 90 jours, et la responsabilité civile demeure obligatoire dès le premier kilomètre. Gardez à bord une pièce d'identité, le certificat d'immatriculation et votre attestation d'assurance.",
      },
    ],
  },
  {
    slug: "garanties-assurance-auto-provisoire",
    title: "Quelles garanties inclut une assurance auto temporaire ?",
    metaDescription: "Responsabilité civile, défense pénale et recours, options automobile : le détail des garanties TempAssur.",
    date: "2025-07-27",
    relatedProducts: ["automobiles", "assurance-frontiere"],
    body: [
      {
        type: "p",
        text: "Une assurance temporaire n'est pas une version allégée d'un contrat classique : elle doit couvrir les mêmes obligations légales, pour une durée choisie de 1 à 90 jours.",
      },
      { type: "h2", text: "La responsabilité civile, garantie obligatoire" },
      {
        type: "p",
        text: "Elle couvre les dommages matériels et corporels causés à un tiers en cas d'accident responsable. Rouler sans cette garantie expose à une amende pouvant atteindre 3 750 €, à une suspension de permis et à l'immobilisation du véhicule.",
      },
      { type: "h2", text: "La défense pénale et recours" },
      {
        type: "p",
        text: "Incluse dans tous nos contrats, elle prend en charge votre défense en cas de poursuite liée à un accident, et permet d'engager un recours contre le tiers responsable.",
      },
      { type: "h2", text: "Les options, réservées à l'automobile" },
      {
        type: "p",
        text: "Pour la catégorie automobile uniquement, trois options existent, dont le prix dépend de la durée choisie : la garantie du conducteur, l'assistance, et l'extension de circulation vers 7 pays supplémentaires (Albanie, Azerbaïdjan, Macédoine du Nord, Maroc, Moldavie, Tunisie, Turquie). Elles ne sont pas disponibles dans les DOM-TOM. Les autres catégories de véhicules (poids lourd, camping-car, quadricycle, bus, tracteur agricole, remorque, assurance frontière) ne comportent pas d'options : seules la responsabilité civile et la défense pénale et recours sont proposées, conformément à la grille tarifaire.",
      },
    ],
  },
  {
    slug: "assurance-frontiere-temporaire-auto",
    title: "Qu'est-ce que l'assurance frontière ?",
    metaDescription: "Véhicule immatriculé hors UE ou carte verte absente ? L'assurance frontière TempAssur couvre 35 pays, pas seulement la France.",
    date: "2025-07-26",
    relatedProducts: ["assurance-frontiere", "automobiles"],
    body: [
      {
        type: "p",
        text: "Un véhicule immatriculé hors Union européenne et hors système carte verte ne peut pas circuler légalement en France sans une couverture spécifique : c'est le rôle de l'assurance frontière.",
      },
      { type: "h2", text: "Une couverture qui dépasse la France" },
      {
        type: "p",
        text: "Chez TempAssur, l'assurance frontière ne se limite pas au territoire français : elle couvre les mêmes 35 pays d'Europe et du pourtour méditerranéen que nos assurances temporaires classiques. Elle est disponible en 30 ou 90 jours, et inclut la responsabilité civile ainsi que la défense pénale et recours.",
      },
      { type: "h2", text: "Qui est concerné ?" },
      {
        type: "p",
        text: "Les voyageurs venant en Europe avec leur véhicule, les Français de l'étranger de retour temporaire avec un véhicule immatriculé hors UE, et les véhicules en transit ou en cours d'importation.",
      },
      {
        type: "p",
        text: "La souscription se fait 100 % en ligne, y compris avant votre arrivée en France, avec une date d'effet différée si besoin.",
      },
    ],
  },
  {
    // Texte intégral repris du dossier développeur §9.2.1 — remplace entièrement
    // l'ancien article, qui laissait croire à tort que l'Algérie était couverte.
    slug: "assurance-temporaire-auto-maghreb-turquie",
    title: "Rouler au Maroc, en Tunisie ou en Turquie avec une assurance temporaire : l'option extension de pays",
    metaDescription:
      "Assurance temporaire maroc, assurance auto tunisie, carte verte turquie : comment souscrire l'option extension de circulation avec TempAssur.",
    date: "2026-07-14",
    relatedProducts: ["automobiles", "assurance-frontiere"],
    body: [
      {
        type: "p",
        text: "Vous partez au Maghreb ou en Turquie avec votre voiture ? Depuis la France, votre assurance temporaire standard couvre 35 pays européens — mais pas le Maroc, la Tunisie ni la Turquie. La solution : l'option extension de circulation, disponible chez TempAssur pour les automobiles de moins de 3,5 tonnes.",
      },
      { type: "h2", text: "Ce que couvre l'extension" },
      {
        type: "p",
        text: "En plus des 35 pays de base, l'extension ouvre la circulation dans 7 pays : Albanie, Azerbaïdjan, Macédoine du Nord, Maroc, Moldavie, Tunisie et Turquie. Vous recevez une carte internationale d'assurance mentionnant ces pays — c'est elle qui fait foi au passage de la frontière et lors des contrôles.",
      },
      { type: "h2", text: "Attention : l'Algérie n'est pas couverte" },
      {
        type: "p",
        text: "Aucune de nos formules, avec ou sans extension, ne couvre l'Algérie. Pour y circuler, une assurance locale doit être souscrite à la frontière algérienne. De même, la Biélorussie, l'Iran, la Russie et l'Ukraine ne sont jamais couverts.",
      },
      { type: "h2", text: "Comment souscrire" },
      {
        type: "p",
        text: "Choisissez « Automobile » dans notre tarificateur, votre durée (1 à 90 jours), puis cochez l'option « Extension de pays » : le prix s'ajuste selon la durée choisie. Vous recevez votre attestation et votre carte internationale par e-mail ou WhatsApp en quelques minutes — pratique quand on prépare un embarquement à Sète, Marseille ou Gênes.",
      },
      { type: "h2", text: "Bon à savoir" },
      {
        type: "p",
        text: "L'extension concerne uniquement les automobiles : pour un poids lourd ou un camping-car, contactez-nous au +33 6 05 93 84 79 (WhatsApp), nous étudierons une solution personnalisée.",
      },
    ],
  },
  {
    slug: "assurance-temporaire-pour-tracteur-agricole",
    title: "Assurance temporaire pour tracteur agricole",
    metaDescription: "Moissons, convoyage, achat ou vente : assurance temporaire tracteur agricole en ligne avec TempAssur.",
    date: "2025-07-12",
    relatedProducts: ["tracteurs-agricoles", "poids-lourds"],
    body: [
      {
        type: "p",
        text: "Un tracteur ou un engin agricole n'a pas toujours besoin d'être assuré à l'année : période de moissons, convoyage après achat ou vente, prêt entre exploitants, ou déplacement exceptionnel sur route sont autant de situations où une couverture ponctuelle suffit.",
      },
      { type: "h2", text: "Une couverture simple" },
      {
        type: "p",
        text: "Le contrat temporaire tracteur agricole comprend la responsabilité civile obligatoire et la défense pénale et recours suite à accident, sans option supplémentaire. Les durées disponibles vont jusqu'à 15 jours, avec deux raccourcis pratiques : 8 et 15 jours.",
      },
      {
        type: "p",
        text: "La souscription se fait en ligne, sans déplacement : renseignez le véhicule et le conducteur, réglez en ligne, et recevez votre attestation par e-mail ou WhatsApp.",
      },
    ],
  },
  {
    slug: "assurance-provisoire-automobile",
    title: "Assurance temporaire automobile pour les professionnels",
    metaDescription: "Transporteurs, artisans, importateurs : l'assurance temporaire automobile TempAssur pour vos besoins ponctuels.",
    date: "2025-07-04",
    relatedProducts: ["automobiles", "poids-lourds"],
    body: [
      {
        type: "p",
        text: "Un véhicule en transit, une opération d'import-export, une mission exceptionnelle ou une période d'attente avant un contrat annuel : les professionnels ont, eux aussi, régulièrement besoin d'une couverture ponctuelle plutôt que d'un engagement à l'année.",
      },
      { type: "h2", text: "Une solution adaptée à l'activité pro" },
      {
        type: "p",
        text: "Transporteurs, artisans, commerçants, indépendants ou importateurs de véhicules peuvent souscrire une assurance temporaire pour un véhicule de tourisme, un utilitaire ou un poids lourd, de 1 à 90 jours, avec les mêmes garanties que pour un particulier : responsabilité civile et défense pénale et recours, plus les options automobile si besoin.",
      },
      {
        type: "p",
        text: "La souscription reste 100 % en ligne, avec une attestation reçue immédiatement après paiement et signature électronique.",
      },
    ],
  },
  {
    slug: "assurance-automobile-temporaire",
    title: "5 situations où l'assurance auto temporaire fait la différence",
    metaDescription: "Achat/vente, usage ponctuel, véhicule en transit : les situations où l'assurance temporaire s'impose.",
    date: "2025-06-20",
    relatedProducts: ["automobiles", "camping-cars"],
    body: [
      { type: "h2", text: "Un achat ou une vente de véhicule" },
      {
        type: "p",
        text: "Déplacer un véhicule pour un essai, une formalité administrative ou une livraison, sans carte grise définitive : l'assurance temporaire permet de circuler immédiatement après l'achat, sans souscrire un contrat annuel inutile si le véhicule doit être revendu rapidement.",
      },
      { type: "h2", text: "Un usage occasionnel" },
      {
        type: "p",
        text: "Un véhicule secondaire utilisé seulement quelques semaines par an — camping-car, remorque ou voiture de collection — coûte moins cher à assurer à la durée réelle d'utilisation qu'à l'année.",
      },
      { type: "h2", text: "Une location entre particuliers" },
      {
        type: "p",
        text: "Quand un véhicule est loué en dehors d'une grande agence, la couverture d'assurance n'est pas toujours incluse : une assurance temporaire comble ce vide en quelques minutes.",
      },
      { type: "h2", text: "Un véhicule en transit" },
      {
        type: "p",
        text: "Importation depuis l'étranger, changement de carte grise en cours : le temps de régulariser la situation administrative, le véhicule doit rester assuré.",
      },
      { type: "h2", text: "Une situation particulière" },
      {
        type: "p",
        text: "Un conducteur en recherche d'un nouvel assureur peut avoir besoin d'une solution ponctuelle. Chez TempAssur, l'éligibilité reste conditionnée aux déclarations présentées lors de la souscription — en cas de doute sur votre situation, contactez-nous avant de souscrire.",
      },
    ],
  },
  {
    slug: "assurance-temporaire-vs-annuelle",
    title: "Assurance temporaire ou annuelle : comment choisir ?",
    metaDescription: "Assurance temporaire ou assurance annuelle : quelles différences, et laquelle choisir selon votre usage ?",
    date: "2025-06-10",
    relatedProducts: ["automobiles", "camping-cars"],
    body: [
      {
        type: "p",
        text: "Les deux formules répondent à des besoins différents : l'une couvre un usage ponctuel de quelques jours, l'autre un usage régulier tout au long de l'année.",
      },
      { type: "h2", text: "L'assurance temporaire : payer pour l'usage réel" },
      {
        type: "p",
        text: "De 1 à 90 jours, sans engagement, souscrite en ligne en quelques minutes : elle convient à un véhicule utilisé occasionnellement, à un besoin transitoire (import/export, vacances) ou à une attente avant un contrat annuel.",
      },
      { type: "h2", text: "L'assurance annuelle : pour un usage quotidien" },
      {
        type: "p",
        text: "Avec un engagement de 12 mois et davantage de garanties disponibles, elle reste plus adaptée à un véhicule utilisé toute l'année.",
      },
      {
        type: "p",
        text: "Pour un usage occasionnel ou une situation temporaire, l'assurance auto temporaire — rapide à souscrire et sans engagement — reste la solution la plus économique.",
      },
    ],
  },
]

// 2 nouveaux articles rédigés en texte intégral (dossier §9.2.2 et §9.2.3), repris mot
// pour mot depuis le dossier développeur.
BLOG_ARTICLES.push(
  {
    slug: "voiture-achetee-week-end-assurance-jour-meme",
    title: "Voiture achetée le week-end : comment repartir assuré le jour même",
    metaDescription: "Assurance auto immédiate, assurer voiture jour même, assurance achat voiture : la solution TempAssur.",
    date: "2026-07-14",
    relatedProducts: ["automobiles"],
    body: [
      {
        type: "p",
        text: "Vous venez d'acheter une voiture d'occasion un samedi soir et le vendeur habite à 300 km ? Sans assurance, impossible de reprendre la route légalement : la responsabilité civile est obligatoire dès le premier mètre, et rouler sans assurance coûte jusqu'à 3 750 € d'amende, avec suspension de permis possible.",
      },
      { type: "h2", text: "L'assurance temporaire, la solution immédiate" },
      {
        type: "p",
        text: "Chez TempAssur, la souscription est 100 % en ligne, 7j/7 : estimez votre tarif en 30 secondes, souscrivez en 5 minutes, payez par carte et recevez votre attestation par e-mail ou WhatsApp — même un dimanche. Vous choisissez la durée exacte dont vous avez besoin, de 1 à 90 jours, le temps de rapatrier le véhicule puis de souscrire votre contrat annuel en connaissance de cause.",
      },
      { type: "h2", text: "Les conditions" },
      {
        type: "p",
        text: "Avoir au moins 21 ans, 2 ans de permis, et répondre aux déclarations d'antécédents présentées lors de la souscription. Le véhicule doit être immatriculé (une plaque provisoire WW convient).",
      },
      { type: "h2", text: "Combien ça coûte ?" },
      {
        type: "p",
        text: "À partir de quelques euros par jour pour une automobile, selon la durée et la puissance ; le tarif exact s'affiche immédiatement dans notre tarificateur, sans laisser votre e-mail. Une journée d'assurance temporaire coûte bien moins cher qu'un engagement annuel pris dans la précipitation.",
      },
    ],
  },
  {
    slug: "assurance-sortie-fourriere",
    title: "Sortie de fourrière : quelle assurance pour récupérer votre véhicule ?",
    metaDescription: "Assurance sortie de fourrière, attestation assurance fourrière, récupérer voiture fourrière avec TempAssur.",
    date: "2026-07-14",
    relatedProducts: ["automobiles"],
    body: [
      {
        type: "p",
        text: "Pour récupérer un véhicule en fourrière, la loi impose de présenter une attestation d'assurance en cours de validité (avec le permis et la carte grise). Problème : si votre véhicule a été mis en fourrière précisément parce qu'il n'était plus assuré — ou si votre assureur a résilié le contrat entre-temps — vous êtes bloqué.",
      },
      { type: "h2", text: "L'assurance temporaire débloque la situation en quelques minutes" },
      {
        type: "p",
        text: "Souscrivez en ligne une assurance de 1 à 90 jours, recevez l'attestation par e-mail ou WhatsApp, présentez-la à la fourrière et repartez avec votre véhicule. Chaque jour de garde coûtant de l'argent, la rapidité compte : chez TempAssur, l'attestation part immédiatement après le paiement et la signature électronique.",
      },
      { type: "h2", text: "Quelle durée choisir ?" },
      {
        type: "p",
        text: "Le temps de récupérer le véhicule et de souscrire une assurance classique : 8 ou 15 jours suffisent souvent ; 30 jours si vous devez aussi passer le contrôle technique ou vendre le véhicule.",
      },
      { type: "h2", text: "Les conditions" },
      {
        type: "p",
        text: "Conducteur d'au moins 21 ans avec 2 ans de permis, et déclarations d'antécédents conformes (notamment : pas de résiliation pour sinistre au cours des 5 dernières années). En cas de doute sur votre situation, écrivez-nous sur WhatsApp au +33 6 05 93 84 79 : nous vous répondons 7j/7.",
      },
    ],
  }
)

// Briefs des 5 articles à rédiger en phase 2 (dossier §9.2.4) — structure uniquement,
// pas de contenu à inventer. Pas de page publique tant que le texte n'est pas fourni.
export const BLOG_BRIEFS: BlogBrief[] = [
  {
    title: "Plaque WW et assurance temporaire : le duo gagnant pour un véhicule importé",
    slug: "plaque-ww-assurance-temporaire-vehicule-importe",
    brief:
      "Fusion des 2 articles WW existants + cas import/export ; lien vers la page produit automobile.",
  },
  {
    title: "Résilié par votre assureur : quelles solutions pour continuer à rouler ?",
    slug: "resilie-assureur-solutions-continuer-rouler",
    brief:
      "Distinguer résiliation pour non-paiement (assurable en temporaire) et résiliation pour sinistre < 5 ans (non éligible → contact pour solution personnalisée) ; ton prudent, pas de promesse.",
  },
  {
    title: "Vendre la voiture d'un proche décédé : l'assurance temporaire pour la succession",
    slug: "vendre-voiture-proche-decede-assurance-succession",
    brief: "Véhicule en indivision, déplacement pour expertise/vente/contrôle technique.",
  },
  {
    title: "Contrôle technique d'un véhicule non assuré : comment faire ?",
    slug: "controle-technique-vehicule-non-assure",
    brief: "Courte assurance 8-15 jours pour conduire le véhicule au centre.",
  },
  {
    title: "Assurance temporaire à 21 ans : conditions et conseils",
    slug: "assurance-temporaire-21-ans-conditions-conseils",
    brief:
      "Clarifier l'éligibilité (21 ans + 2 ans de permis), gérer la déception des 18-20 ans en proposant des alternatives honnêtes.",
  },
]
