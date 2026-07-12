export interface VehicleContent {
  intro: string
  reasons: string[]
  coverage: string
  duration: string
  price: string
}

export const VEHICLE_CONTENT: Record<string, VehicleContent> = {
  automobiles: {
    intro:
      "Vous n'avez pas forcément besoin d'assurer votre véhicule pour un an. L'assurance temporaire automobile de TempAssur couvre vos besoins ponctuels et urgents : prêt de voiture, achat en attente de carte grise définitive, transition entre deux contrats annuels ou essai avant achat.",
    reasons: [
      "Conduire un véhicule prêté ou emprunté sans figurer au contrat annuel",
      "Assurer une voiture tout juste achetée, en attente de la carte grise définitive",
      "Couvrir la période de transition entre deux contrats d'assurance annuels",
      "Essayer un véhicule avant achat ou faire un déplacement ponctuel",
    ],
    coverage: "Voitures particulières et utilitaires légers.",
    duration: "De 1 à 90 jours, avec un délai minimum de 20 minutes avant la prise d'effet.",
    price: "À partir de 4,10 €/jour.",
  },
  "tracteurs-agricoles": {
    intro:
      "L'assurance temporaire pour tracteur agricole répond à des besoins ponctuels : déplacer un tracteur avant sa vente, reprendre l'activité après un entretien, ou couvrir une mission exceptionnelle ou une transition contractuelle, sans souscrire un contrat annuel disproportionné.",
    reasons: [
      "Déplacer un tracteur avant sa vente ou son transfert",
      "Reprendre la circulation après un entretien ou une réparation",
      "Couvrir une mission agricole exceptionnelle et ponctuelle",
      "Assurer la transition entre deux contrats annuels",
    ],
    coverage: "Tracteurs agricoles homologués (type TRA) et engins assimilés.",
    duration: "De 1 à 90 jours, avec un délai minimum de 20 minutes avant la prise d'effet.",
    price: "À partir de 12,35 €/jour.",
  },
  quadricycles: {
    intro:
      "L'assurance temporaire quadricycle couvre voiturettes sans permis, buggies et quads à moteur pour un usage occasionnel — vacances, loisirs ou essai avant achat — sans engagement sur l'année.",
    reasons: [
      "Assurer un usage occasionnel : vacances, loisirs, sorties ponctuelles",
      "Essayer un véhicule avant de l'acheter",
      "Couvrir un déplacement ponctuel sans souscrire de contrat annuel",
    ],
    coverage:
      "Voiturettes sans permis, buggies et quads à moteur. Pour les voiturettes sans permis, une carte d'identité est requise en plus du permis de conduire.",
    duration: "De 1 à 90 jours, avec un délai minimum de 20 minutes avant la prise d'effet.",
    price: "À partir de 3,50 €/jour.",
  },
  "bus-autocars": {
    intro:
      "L'assurance temporaire bus et autocars permet de couvrir un transport de voyageurs pour un événement ponctuel, le remplacement d'un véhicule immobilisé ou une mission exceptionnelle, sans contrat annuel.",
    reasons: [
      "Assurer un transport de voyageurs pour un événement ponctuel",
      "Remplacer temporairement un véhicule immobilisé",
      "Couvrir une mission exceptionnelle ou une transition contractuelle",
    ],
    coverage: "Bus et autocars homologués (type TCP).",
    duration: "De 1 à 90 jours, avec un délai minimum de 20 minutes avant la prise d'effet.",
    price: "À partir de 11,69 €/jour.",
  },
  "poids-lourds": {
    intro:
      "L'assurance temporaire poids lourds permet de faire circuler un véhicule professionnel pendant une durée limitée tout en restant couvert : déplacement avant vente, reprise après entretien, mission exceptionnelle ou transition contractuelle.",
    reasons: [
      "Déplacer un véhicule avant sa vente ou son transfert",
      "Reprendre l'activité après un entretien ou une réparation",
      "Couvrir une mission professionnelle exceptionnelle et ponctuelle",
      "Assurer la transition entre deux contrats annuels",
    ],
    coverage: "Porteurs, tracteurs routiers, camions et véhicules utilitaires lourds.",
    duration: "De 1 à 90 jours, avec un délai minimum de 20 minutes avant la prise d'effet.",
    price: "À partir de 11,60 €/jour.",
  },
  remorques: {
    intro:
      "Plutôt qu'un contrat annuel disproportionné par rapport à l'usage réel, l'assurance temporaire remorque s'adapte à un déménagement, un besoin de transport ponctuel ou une circulation avant vente.",
    reasons: [
      "Couvrir un déménagement ou un transport ponctuel",
      "Assurer un usage occasionnel plutôt qu'un contrat annuel",
      "Faire circuler une remorque avant sa vente",
    ],
    coverage:
      "Remorques, semi-remorques et caravanes. Pour les remorques de moins de 3,5 T, la carte grise du véhicule tracteur est également requise.",
    duration: "De 1 à 90 jours, avec un délai minimum de 20 minutes avant la prise d'effet.",
    price: "À partir de 7,10 €/jour.",
  },
  "camping-cars": {
    intro:
      "Protégez votre camping-car le temps d'un voyage ou d'une saison, sans payer une année complète pour quelques semaines d'utilisation.",
    reasons: [
      "Couvrir un voyage ou une saison, sans engagement annuel",
      "Assurer un camping-car récemment acheté ou emprunté",
      "Adapter la couverture à une utilisation réellement occasionnelle",
    ],
    coverage: "Camping-cars, PTAC inférieur ou supérieur à 3,5 T.",
    duration: "De 1 à 90 jours, avec un délai minimum de 20 minutes avant la prise d'effet.",
    price: "À partir de 4,25 €/jour.",
  },
  "assurance-frontiere": {
    intro:
      "L'assurance frontière s'adresse aux conducteurs de véhicules terrestres à moteur non immatriculés dans un pays membre du système carte verte, qui souhaitent circuler en France ou en Europe.",
    reasons: [
      "Faire entrer sur le territoire un véhicule immatriculé hors Espace Économique Européen",
      "Satisfaire à l'obligation d'assurance avant de franchir la frontière",
      "Voyager en règle, avec une attestation immédiate",
    ],
    coverage: "Tous véhicules immatriculés hors Union européenne (hors système carte verte).",
    duration:
      "Contrat de 30 ou 90 jours uniquement, conformément au Code des assurances (pas d'autres durées possibles).",
    price: "À partir de 3,90 €/jour.",
  },
}
