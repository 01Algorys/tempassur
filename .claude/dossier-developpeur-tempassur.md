# TempAssur — Dossier développeur (texte intégral, version finale du 14 juillet 2026)

> Ce fichier est la transcription exacte du PDF `dossier-developpeur-tempassur.pdf` fourni par le client (WN Conseil / Walid Nefzi). Il fait foi pour tout le contenu texte, les règles de tarification et la logique fonctionnelle du site. Ne pas reformuler les blocs de texte destinés aux pages du site.

Site en préprod : mediumvioletred-oryx-872860.hostingersite.com → domaine cible : www.tempassur.com

**Mode d'emploi pour le développeur** : ce dossier contient le texte intégral de chaque page (accueil, 8 pages produit, pays couverts, qui sommes-nous, FAQ, contact, tunnel, paiement, remerciement, 4 pages légales, 404, header, footer, articles de blog). Les blocs en citation sont à copier-coller tels quels. Les prix viennent exclusivement du fichier Excel joint (§1.1). Rien d'autre à inventer.

## 0. Lecture rapide — les 10 priorités

1. Corriger tous les prix « dès X €/jour » affichés sur l'accueil et les vignettes : ils doivent venir de la grille tarifaire officielle (Classeur3.xlsx), jamais être saisis à la main. Les prix actuels du site sont tous inférieurs au tarif réel.
2. Tarificateur accueil : « Estimez votre assurance en 30 secondes », Automobile présélectionné, prix affichés directement (pas de champ e-mail), bouton « Aller vers la souscription ».
3. Raccourcis de durée dynamiques par catégorie (voir §3.2) — ne jamais afficher un raccourci sans tarif dans la grille.
4. Tunnel : pays d'immatriculation + pays de résidence en premier → bascule tarifs DOM-TOM + gestion des options non éligibles (grisées, jamais masquées).
5. Éligibilité conducteur dans le formulaire : âge ≥ 21 ans et permis ≥ 2 ans, contrôlés à la saisie (date de naissance + date d'obtention du permis).
6. Pop-up de déclarations obligatoire avant paiement (§4.6) — bloquant.
7. Bloc « aide au paiement » sous le bouton Payer, numéro et e-mail cliquables (tel: / mailto:).
8. Pages légales remplacées par les versions du §7 (mentions légales, CGV, confidentialité + nouvelle page /reclamation).
9. SEO : redirections 301 depuis tempassur.com, une page par produit, page /pays-couverts, schema.org, fiche Google Maps intégrée (§8).
10. WhatsApp partout : bouton « Souscrire par WhatsApp » (https://wa.me/33605938479) dans le header, le hero, chaque page produit et en bouton flottant sur mobile — et « attestation par e-mail OU WhatsApp » mis en avant partout (hero, vignettes, FAQ, page merci).

Contacts officiels du site : WhatsApp / tél. **+33 6 05 93 84 79** (7j/7) · fixe **+33 9 70 70 53 41** · **contact@tempassur.com**. Un seul numéro principal partout : le 06 (le 01 84 80 30 40 qui traîne dans les anciennes CGV disparaît).

## 1. Contexte

- WN Conseil, EURL au capital de 1 000 €, RCS Nanterre 929 812 642, siège : Bureau 3, 6 Rue des Bateliers, 92110 Clichy. Gérant : Walid Nefzi. Courtier en assurances, ORIAS n° 24004933 (www.orias.fr). TVA FR14929812642.
- TempAssur distribue des assurances temporaires (1 à 90 jours) portées par des entreprises d'assurance agréées, régies par le Code des assurances.
- Formule de réassurance à utiliser sur le site : « **Assureurs agréés — vos contrats sont portés par des entreprises d'assurance régies par le Code des assurances.** » (Ne jamais écrire « partenaires certifiés ACPR ».)

### 1.1 Le fichier Excel est LA référence

Le fichier Excel (grille tarifaire) transmis avec ce dossier est la seule source de vérité pour les produits et la souscription. Le développeur l'applique tel quel, sans interprétation :

- **Produits, sous-types, tranches** (puissance, poids), **durées et prix** : exactement ceux du fichier Excel. Une combinaison absente du fichier n'existe pas sur le site.
- **Options** : uniquement celles présentes dans le fichier Excel, pour les catégories où elles existent. Exemple : le poids lourd n'a pas de colonnes d'options dans le fichier → aucune option proposée pour le poids lourd. Les options existantes sont : garantie du conducteur, assistance, extension de pays (catégorie automobile). Le prix de chaque option dépend de la durée (colonnes du fichier).
- **Tarifs DOM-TOM** : le fichier contient une grille DOM-TOM pour toutes les catégories → tous les véhicules sont assurables dans les DOM-TOM, aux tarifs DOM-TOM du fichier.
- Les textes des pages (sections 3 à 7 et 9 de ce dossier) sont à copier-coller tels quels.

**Règle DOM-TOM (implémentation)** : si pays d'immatriculation OU de résidence = DOM-TOM → charger les tarifs DOM-TOM de la grille + bandeau « Les tarifs DOM-TOM diffèrent de la métropole ». Les options (garantie du conducteur, assistance, extension de pays) ne sont pas disponibles dans les DOM-TOM : les afficher grisées avec la mention « Non éligible pour ce pays ».

### 1.2 Pays couverts — règle unique

Vérifié case par case sur les cartes internationales d'assurance : une seule liste de pays pour tout le site (temporaire et frontière), à maintenir en un seul endroit (variable globale / table unique en BDD).

- **35 pays couverts** (temporaire ET frontière) : Allemagne, Andorre, Autriche, Belgique, Bosnie-Herzégovine, Bulgarie, Chypre, Croatie, Danemark, Espagne, Estonie, Finlande, France, Grèce, Hongrie, Irlande, Islande, Israël, Italie, Lettonie, Lituanie, Luxembourg, Malte, Monténégro, Norvège, Pays-Bas, Pologne, Portugal, République tchèque, Roumanie, Royaume-Uni, Serbie, Slovaquie, Slovénie, Suède, Suisse — Monaco, Saint-Marin et Liechtenstein sont assimilés (France / Italie / Suisse). (La carte internationale d'assurance remise au client fait foi.)
- **11 pays exclus** : Albanie, Azerbaïdjan, Biélorussie, Iran, Macédoine du Nord, Maroc, Moldavie, Russie, Tunisie, Turquie, Ukraine.
- **Extension de pays** (option, automobile uniquement, hors DOM-TOM) : rachète 7 des 11 exclusions — Albanie, Azerbaïdjan, Macédoine du Nord, Maroc, Moldavie, Tunisie, Turquie.
- **4 pays jamais couverts**, quelle que soit l'option : Biélorussie, Iran, Russie, Ukraine.
- Partout où une liste de pays est évoquée : lien « Voir la liste complète des pays couverts » → page /pays-couverts (§6.9).
- Mention à afficher sous chaque liste : « La couverture de certains pays peut varier selon la compagnie, le véhicule, la durée et les options choisies. Vous comptez rouler dans un pays non listé ? Contactez-nous : WhatsApp / tél. +33 6 05 93 84 79. »

## 2. Arborescence complète du site

```
/ Accueil (tarificateur)
/souscription Tunnel de souscription (multi-étapes)
/merci Page de remerciement post-paiement

— Pages produit —
/assurance-temporaire-automobile
/assurance-temporaire-poids-lourd
/assurance-temporaire-camping-car
/assurance-temporaire-quadricycle (quad, voiturette sans permis, buggy)
/assurance-temporaire-bus-autocar
/assurance-temporaire-tracteur-agricole
/assurance-temporaire-remorque
/assurance-frontiere
/pays-couverts Liste des 35 pays + extension

— Contenu / confiance —
/qui-sommes-nous
/faq
/avis (option : avis Google intégrés)
/contact
/blog + articles (§9)

— Cas d'usage SEO (phase 2, mêmes gabarits que les pages produit) —
/assurance-temporaire-plaque-ww
/assurance-temporaire-achat-vente-vehicule
/assurance-temporaire-import-export
/assurance-temporaire-sortie-fourriere
/assurance-temporaire-apres-resiliation
/assurance-temporaire-succession
/assurance-temporaire-controle-technique

— Légal —
/mentions-legales
/cgv
/politique-de-confidentialite
/reclamation (nouvelle page, obligatoire)

— Technique —
/sitemap.xml /robots.txt 404 personnalisée
```

### 2.1 Header (toutes les pages) — à copier-coller

- Logo TempAssur (lien accueil)
- Menu : Accueil · Nos assurances ▾ (Automobile, Poids lourd, Camping-car, Quadricycles, Bus & autocars, Tracteur agricole, Remorques, Assurance frontière) · Pays couverts · Blog · FAQ · Contact
- À droite : +33 6 05 93 84 79 (cliquable tel:) + bouton vert « Souscrire par WhatsApp » (https://wa.me/33605938479) + bouton bleu « Souscrire en ligne » (→ /souscription)
- Sur mobile : bouton WhatsApp flottant en bas à droite, visible sur toutes les pages.

### 2.2 Footer (toutes les pages) — à copier-coller

TempAssur — L'assurance temporaire de 1 à 90 jours, pour tous les véhicules. Attestation immédiate par e-mail ou WhatsApp.

Nos assurances : Automobile · Poids lourd · Camping-car · Quadricycles · Bus & autocars · Tracteur agricole · Remorques · Assurance frontière · Pays couverts

Informations : Qui sommes-nous · FAQ · Blog · Contact · Réclamation · Mentions légales · CGV · Politique de confidentialité · Gérer mes cookies

Contact : WhatsApp / tél. +33 6 05 93 84 79 (7j/7) · +33 9 70 70 53 41 · contact@tempassur.com · Bureau 3, 6 Rue des Bateliers, 92110 Clichy · [Retrouvez-nous sur Google Maps]

WN Conseil — Courtier en assurances · ORIAS n° 24004933 (www.orias.fr) · Assureurs agréés — vos contrats sont portés par des entreprises d'assurance régies par le Code des assurances. · Paiement sécurisé [logos CB/Visa/Mastercard]

© TempAssur {année} — Tous droits réservés

### 2.3 Page 404 — à copier-coller

Oups, cette page n'existe pas. Pas de panique : votre assurance, elle, est bien là. [Estimer mon tarif en 30 secondes] [Retour à l'accueil] — ou écrivez-nous sur WhatsApp : +33 6 05 93 84 79.

## 3. Page d'accueil — contenu complet, bloc par bloc (à copier-coller)

L'accueil est composé, dans l'ordre, des blocs 3.1 à 3.10. Tous les textes sont définitifs.

### 3.1 Hero

- Title (SEO) : Assurance temporaire auto & tous véhicules de 1 à 90 jours | TempAssur
- Meta description : Assurance temporaire immédiate de 1 à 90 jours : auto, poids lourd, camping-car, quad, remorque, assurance frontière. Attestation par e-mail ou WhatsApp en quelques minutes. Dès [PRIX_MIN_AUTO] €/jour.

**Assurance temporaire de 1 à 90 jours — attestation immédiate par e-mail ou WhatsApp**

Auto, poids lourd, camping-car, quad, bus, tracteur, remorque et assurance frontière. Souscription 100 % en ligne, 7j/7. Assureurs agréés : vos contrats sont portés par des entreprises d'assurance régies par le Code des assurances.

Boutons du hero : [Estimer votre assurance en 30 secondes] (ancre vers le tarificateur) + [Souscrire par WhatsApp] (https://wa.me/33605938479).

### 3.2 Tarificateur (bloc principal du hero)

Titre du bloc : « Estimez votre assurance en 30 secondes »

**Champ 1 — Catégorie** : 8 choix, Automobile présélectionné. Chaque catégorie porte une mini-définition affichée sous son libellé :

- Automobile — véhicules privés et utilitaires de moins de 3,5 T
- Poids lourd — camions, tracteurs routiers et porteurs de plus de 3,5 T
- Camping-car — camping-cars et fourgons aménagés
- Quadricycles — quads homologués, voiturettes sans permis, buggys
- Bus, autocars — transport de personnes
- Tracteur agricole — tracteurs et engins agricoles
- Remorques — remorques, semi-remorques et caravanes (poids lourd et léger)
- Assurance frontière — véhicules immatriculés hors Union européenne et hors système carte verte, ou véhicules immatriculés à l'étranger devant circuler en France et en Europe

**Champ 2 — Durée** : libellé par défaut « Choisir votre durée » (pas « 1 jour »). Au clic, la liste complète des durées avec le prix en face de chacune. Au-dessus de la liste, des raccourcis dynamiques par catégorie :

| Catégorie | Raccourcis | Présélection | Badge « La plus choisie » |
|---|---|---|---|
| Automobile | 8 · 15 · 30 · 90 j | 30 j | 30 j |
| Camping-car | 8 · 15 · 30 · 90 j | 30 j | 30 j |
| Poids lourd | 8 · 15 j | 15 j | 15 j |
| Tracteur agricole | 8 · 15 j | 15 j | 15 j |
| Bus, autocars | 8 · 15 j | 15 j | 15 j |
| Remorques | 8 · 15 j | 15 j | 15 j |
| Quadricycles | 10 · 15 · 20 · 30 j | 30 j | 30 j |
| Assurance frontière | 30 · 90 j | 30 j | 30 j |

**Règle absolue** : un raccourci ne s'affiche que si la combinaison catégorie × durée existe dans la grille tarifaire. Les raccourcis sont générés depuis la grille, pas codés en dur.

**Champ 3 — Prix affiché immédiatement** : pas de champ e-mail, aucune coordonnée demandée à ce stade. Le prix affiché est le tarif minimum de la catégorie (« à partir de »), avec la mention : « Prix minimum pour cette durée. Le tarif définitif dépend du véhicule, des options choisies — et le prix des options dépend de la durée. »

- Camping-car : afficher le tarif « ≤ 3,5 T » ; le prix est ajusté selon le poids dans le tunnel.
- Quadricycles : afficher le tarif du sous-type le moins cher ; le prix est ajusté selon le sous-type (quad / voiturette / buggy) dans le tunnel.

CTA : « Aller vers la souscription » (remplace « Continuer ») + bouton secondaire « Souscrire par WhatsApp » (https://wa.me/33605938479 avec message pré-rempli : « Bonjour, je souhaite une assurance temporaire [catégorie] pour [durée] jours »).

### 3.3 Bandeau de réassurance (sous le hero)

- Attestation immédiate par e-mail ou WhatsApp
- Paiement 100 % sécurisé (CB)
- Courtier français — ORIAS n° 24004933
- Assureurs agréés — entreprises régies par le Code des assurances
- 7j/7 par téléphone et WhatsApp : +33 6 05 93 84 79

### 3.4 Vignettes « Nos véhicules »

8 vignettes (une par produit), chacune : icône, nom, mini-définition (§3.2), « à partir de [PRIX_GRILLE] €/jour » (valeur = minimum réel de la grille pour la catégorie, généré dynamiquement), lien vers la page produit. Ne jamais reprendre les anciens prix du site — ils sont tous faux.

### 3.5 Bloc « Dans quelles situations ? » (cas d'usage — filon SEO)

Grille de cartes cliquables (phase 2 : chaque carte → sa page dédiée) : Achat / vente d'un véhicule · Plaque provisoire WW · Import / export · Sortie de fourrière · Résiliation par votre assureur · Véhicule en succession · Passage du contrôle technique · Prêt ou emprunt d'un véhicule · Véhicule immatriculé à l'étranger (assurance frontière) · Conduite occasionnelle d'un second véhicule.

### 3.6 Bloc « Comment ça marche » (3 étapes)

1. Estimez votre tarif en 30 secondes, sans laisser vos coordonnées.
2. Souscrivez en ligne en 5 minutes, payez par carte bancaire.
3. Recevez votre attestation par e-mail ou WhatsApp, signez électroniquement — vous êtes couvert.

### 3.7 Bloc pays couverts (résumé)

« Votre assurance temporaire vous couvre en France et dans 35 pays d'Europe et du pourtour méditerranéen — la même liste pour l'assurance temporaire et l'assurance frontière. Besoin du Maroc, de la Tunisie ou de la Turquie ? Une extension est possible pour les automobiles. [Voir la liste complète des pays couverts →] » (lien /pays-couverts)

### 3.8 Avis clients

Intégrer la fiche Google Business Profile : https://maps.app.goo.gl/7fc1hB29zkNHGjbZ8 — widget d'avis (note + derniers avis) via l'API Places ou un plugin d'avis, avec lien « Voir tous nos avis Google ». NAP (nom, adresse, téléphone) strictement identique à la fiche : WN Conseil / TempAssur, Bureau 3, 6 Rue des Bateliers, 92110 Clichy, +33 6 05 93 84 79.

### 3.9 FAQ courte (5 questions, balisage schema.org FAQPage)

1. **En combien de temps suis-je assuré ?** — En quelques minutes : souscription en ligne, paiement CB, signature électronique, attestation envoyée par e-mail ou WhatsApp.
2. **Qui peut souscrire ?** — Tout conducteur d'au moins 21 ans, titulaire du permis depuis au moins 2 ans, répondant aux conditions déclarées lors de la souscription.
3. **Dans quels pays suis-je couvert ?** — En France et dans 35 pays (même liste pour la temporaire et la frontière). Extension possible vers 7 pays supplémentaires pour les automobiles.
4. **Puis-je annuler mon contrat ?** — Les contrats temporaires sont à durée ferme, sans tacite reconduction (voir CGV).
5. **L'assurance frontière, c'est pour qui ?** — Pour les véhicules immatriculés hors UE et hors système carte verte qui doivent circuler en France et en Europe.

### 3.10 Bloc aide au paiement (réutilisé dans le tunnel, §4.8)

Besoin d'aide pour finaliser votre paiement ? Nous sommes disponibles 7j/7 : appelez-nous ou écrivez-nous sur WhatsApp au +33 6 05 93 84 79, ou par e-mail à contact@tempassur.com. Nous vous accompagnons étape par étape et pouvons vous proposer une solution personnalisée.

Numéro cliquable (tel:+33605938479), lien WhatsApp (wa.me/33605938479), e-mail cliquable (mailto:contact@tempassur.com), icônes téléphone / WhatsApp / e-mail. Version courte pour le tunnel, placée juste sous le bouton « Payer ».

## 4. Tunnel de souscription /souscription

Principe général : la demande de souscription en haut de page, la définition du produit et ses garanties en bas de la même page. Prix recalculé et affiché en permanence (encart sticky) à chaque changement d'option, avec la mention « Le prix des options dépend de la durée ».

### 4.1 Étape 1 — Localisation (nouvelle, en premier)

- Pays d'immatriculation du véhicule (liste déroulante)
- Pays / territoire de résidence (liste déroulante, DOM-TOM listés individuellement : Guadeloupe, Martinique, Guyane, La Réunion, Mayotte…)
- Si DOM-TOM (immat ou résidence) → charger la grille DOM-TOM du fichier Excel + bandeau : « Les tarifs applicables aux DOM-TOM diffèrent de ceux de la métropole. » Toutes les catégories restent disponibles ; seules les options sont grisées « Non éligible pour ce pays » (§1.1).

### 4.2 Étape 2 — Véhicule

Catégorie (pré-remplie depuis le tarificateur) + sous-type quand il existe :
- Camping-car : poids (≤ 3,5 T / > 3,5 T) → ajuste le tarif (règle grille : « véhicule léger + 20 € » pour ≤ 3,5 T, alignée sur les durées du véhicule léger).
- Quadricycles : quad homologué / voiturette sans permis / buggy → chacun sa grille.
- Automobile : puissance fiscale (tranches de la grille, ex. < 16 CV) — le tarif mini affiché correspond à la tranche la plus basse, il augmente selon la tranche.
- Immatriculation, marque, modèle.

### 4.3 Étape 3 — Durée et date d'effet

Durée (mêmes raccourcis dynamiques que §3.2) + date et heure d'effet. Contrôle : la date d'effet ne peut pas être antérieure à maintenant.

### 4.4 Étape 4 — Conducteur (éligibilité contrôlée à la saisie)

Champs : civilité, nom, prénom, date de naissance, e-mail, téléphone, adresse, numéro de permis, date d'obtention du permis.
- Âge < 21 ans → blocage immédiat : « Nos contrats sont réservés aux conducteurs d'au moins 21 ans. »
- Permis < 2 ans → blocage immédiat : « Nos contrats exigent au moins 2 ans de permis. »

Les deux contrôles se font dans le formulaire (front + back), avant le paiement — pas dans le pop-up.

### 4.5 Étape 5 — Options (selon la matrice §1.1)

Les options proposées sont exactement celles du fichier Excel, pour les catégories où elles y figurent (exemple : pas de colonnes d'options pour le poids lourd → aucune option affichée). Chaque option montre son prix pour la durée choisie (le prix des options dépend de la durée). Option incompatible (mauvaise catégorie, DOM-TOM…) → grisée, visible, avec la mention « Non éligible pour ce pays » (ou « Non disponible pour ce véhicule »). Jamais masquée.

- Garantie du conducteur (automobile)
- Extension de pays : Albanie, Azerbaïdjan, Macédoine du Nord, Maroc, Moldavie, Tunisie, Turquie (automobile uniquement)
- Assistance (automobile — non disponible DOM-TOM)

### 4.6 Pop-up de déclarations — obligatoire avant paiement

Au clic sur « Procéder au paiement », pop-up bloquant (aussi accessible clavier / mobile plein écran). Titre : « Déclarations du conducteur ». Texte d'intro : « Pour valider votre souscription, vous devez pouvoir répondre NON aux quatre questions suivantes concernant le conducteur : »

1. A-t-il déclaré, au cours des 36 derniers mois, plus de 2 sinistres matériels responsables ou partiellement responsables ET/OU 1 sinistre corporel responsable ou non responsable ?
2. A-t-il été résilié pour sinistre par un précédent assureur au cours des 5 dernières années ?
3. A-t-il fait l'objet d'une condamnation pénale pour infraction au code de la route, alcoolémie ou usage de stupéfiants ?
4. Fait-il partie des malussés à la recherche d'un nouvel assureur, ou est-il en attente d'une décision du Bureau Central de Tarification (BCT) ?

Case à cocher unique (obligatoire) : « Je certifie répondre NON à l'ensemble de ces questions. Je comprends qu'une fausse déclaration peut entraîner la nullité du contrat (art. L.113-8 du Code des assurances). »

Lien secondaire : « Vous êtes concerné par l'une de ces situations ? Contactez-nous, une solution personnalisée est peut-être possible » → WhatsApp / tél.

Boutons : « Je certifie et je continue » (actif seulement si case cochée) / « Annuler ». Horodater et stocker l'acceptation (preuve). Dans le même écran ou juste avant paiement : acceptation des CGV, du document d'information (IPID) et des conditions générales du contrat (cases distinctes, liens vers les PDF).

### 4.7 Étape 6 — Page de paiement (textes complets)

Titre de la page : « Récapitulatif et paiement sécurisé »

Récapitulatif (encadré) : Véhicule · Catégorie · Durée · Date et heure d'effet · Options choisies · Total TTC. Lien « Modifier » vers chaque étape.

Cases à cocher obligatoires avant d'activer le bouton :
- ☐ « J'accepte les [Conditions générales de vente] et j'ai pris connaissance du [document d'information (IPID)] et des [conditions générales du contrat]. »
- ☐ Déclarations du conducteur : certifiées via le pop-up §4.6 (déclenché au clic sur « Procéder au paiement »).

Bouton principal : « Payer [MONTANT] € en toute sécurité » + logos CB/Visa/Mastercard + mention « Paiement sécurisé — vos données bancaires ne sont jamais stockées par TempAssur. »

Juste sous le bouton « Payer » (obligatoire) :

Besoin d'aide pour finaliser votre paiement ? Vous rencontrez une difficulté pour finaliser votre souscription ou votre paiement ? Nous sommes là 7j/7 : Appelez-nous ou écrivez-nous sur WhatsApp : +33 6 05 93 84 79. Ou par e-mail : contact@tempassur.com. Nous vous accompagnons étape par étape et pouvons vous proposer une solution personnalisée.

(Numéro cliquable tel:+33605938479, lien wa.me/33605938479, e-mail cliquable — icônes téléphone et e-mail pour attirer l'œil, surtout sur mobile.)

Message en cas d'échec de paiement : « Le paiement n'a pas abouti. Aucune somme n'a été débitée. Réessayez ou contactez-nous : WhatsApp +33 6 05 93 84 79 — nous trouvons une solution immédiatement. »

### 4.8 Page /merci (remerciement)

**Merci pour votre confiance !** Votre demande de souscription est enregistrée et en cours de traitement.

**Vérifiez votre boîte mail** (y compris les spams) : vous allez recevoir dans les prochaines minutes un lien sécurisé pour **signer électroniquement vos documents**.

**Prochaine étape : signez les documents reçus par e-mail** pour que la garantie entre en vigueur.

**Heure d'effet imminente ou déjà passée ?** Si vous n'avez pas reçu l'e-mail, contactez-nous immédiatement pour accélérer le traitement : **WhatsApp (recommandé) ou téléphone : +33 6 05 93 84 79 · contact@tempassur.com**

Ajouter le suivi de conversion (GA4 / Google Ads) sur cette page uniquement.

### 4.9 Bas de page du tunnel — définition du produit

Sous le formulaire, pour chaque produit : sa définition, ses garanties incluses, la liste des pays couverts en commun à toutes les compagnies (les 35), et la mention : « Selon les informations de l'assuré, le véhicule, la durée et les options choisies, ces pays peuvent varier d'une compagnie à l'autre. Si vous comptez rouler dans un pays qui n'est pas dans la liste commune, contactez-nous : WhatsApp / tél. +33 6 05 93 84 79. » + lien « cliquez ici » → /pays-couverts.

## 5. Gabarit commun des pages produit

Chaque page produit suit la même structure (bon pour le SEO et pour le développement — un seul template) :

1. H1 + intro (2-3 phrases, mot-clé principal dans les 100 premiers mots)
2. Encart tarif : « à partir de [PRIX_GRILLE] €/jour » + durées disponibles + CTA « Estimer mon tarif » (renvoie au tarificateur pré-filtré) + « Souscrire par WhatsApp »
3. Garanties incluses (selon compagnie, §1.1) + options éventuelles
4. Pays couverts (résumé + lien /pays-couverts)
5. Cas d'usage (liste adaptée au produit)
6. Conditions d'éligibilité (21 ans / 2 ans de permis + déclarations §4.6)
7. FAQ produit (3-5 questions, schema FAQPage)
8. Maillage interne : liens vers 2-3 autres pages produit + 2 articles de blog liés

Garanties à afficher :
- Automobile : responsabilité civile obligatoire + défense pénale et recours. Options (selon fichier Excel) : garantie du conducteur, extension 7 pays, assistance. (Libellés définitifs à valider sur les CG/IPID — point ouvert §10.)
- Toutes les autres catégories (poids lourd, frontière, camping-car, quadricycles, bus, tracteur, remorques) : RC + défense pénale et recours uniquement — l'afficher clairement, aucune option (conformément au fichier Excel).

## 6. Pages produit — contenus rédigés

### 6.1 /assurance-temporaire-automobile — texte intégral

**Title** : Assurance auto temporaire 1 à 90 jours dès [PRIX] €/jour | TempAssur
**Meta** : Assurez une voiture ou un utilitaire de 1 à 90 jours. Souscription en ligne en 5 minutes, attestation immédiate par e-mail ou WhatsApp. Dès [PRIX] €/jour.

**Assurance auto temporaire de 1 à 90 jours**

Besoin d'assurer une voiture ou un utilitaire de moins de 3,5 tonnes pour quelques jours ? L'assurance auto temporaire TempAssur vous couvre de 1 à 90 jours, sans engagement et sans tacite reconduction. Souscription 100 % en ligne en 5 minutes, attestation envoyée immédiatement par e-mail ou WhatsApp.

À partir de [PRIX_GRILLE] €/jour — durées de 1 à 90 jours. [Estimer mon tarif en 30 secondes] [Souscrire par WhatsApp]

**Quels véhicules ?**

Tous les véhicules particuliers et utilitaires de moins de 3,5 tonnes, quelle que soit la puissance : citadine, berline, SUV, fourgonnette… Le tarif dépend de la puissance fiscale et de la durée choisie.

**Vos garanties**

Incluses : responsabilité civile (obligatoire — dommages causés aux tiers) et défense pénale et recours suite à accident. Options (leur prix dépend de la durée) :
- Garantie du conducteur — vous protège aussi en cas d'accident responsable ;
- Extension de circulation — Albanie, Azerbaïdjan, Macédoine du Nord, Maroc, Moldavie, Tunisie, Turquie ;
- Assistance.

**Où êtes-vous couvert ?**

En France et dans 35 pays d'Europe et du pourtour méditerranéen. Avec l'extension, ajoutez le Maroc, la Tunisie, la Turquie et 4 autres pays. [Voir la liste complète des pays couverts]

**Dans quelles situations ?**

Achat ou vente d'un véhicule · plaque provisoire WW · prêt de véhicule · import / export · sortie de fourrière · résiliation par votre assureur · véhicule en succession · passage du contrôle technique · conduite occasionnelle.

**Qui peut souscrire ?**

Tout conducteur d'au moins 21 ans, titulaire du permis depuis au moins 2 ans, répondant aux déclarations présentées lors de la souscription.

**Questions fréquentes**

Quel est le prix d'une assurance auto temporaire ? À partir de [PRIX_GRILLE] €/jour ; le tarif exact dépend de la durée et de la puissance fiscale, il s'affiche immédiatement dans notre tarificateur.
Puis-je aller au Maroc, en Tunisie ou en Turquie ? Oui, avec l'option extension de circulation (automobiles uniquement).
Suis-je couvert dans les DOM-TOM ? Oui — les tarifs DOM-TOM diffèrent de la métropole et les options n'y sont pas disponibles.
Quels documents vais-je recevoir ? Votre contrat, votre attestation d'assurance et votre carte internationale d'assurance, par e-mail ou WhatsApp, après signature électronique.

[Estimer mon tarif en 30 secondes] [Souscrire par WhatsApp]

### 6.2 /assurance-temporaire-poids-lourd — texte intégral

**Title** : Assurance poids lourd temporaire dès [PRIX] €/jour | TempAssur
**Meta** : Camion, porteur, tracteur routier : assurance temporaire poids lourd en ligne. Attestation immédiate par e-mail ou WhatsApp.

**Assurance temporaire poids lourd (+ de 3,5 T)**

Camion porteur, tracteur routier, semi : assurez votre poids lourd pour un convoyage, un achat, un import ou une mission ponctuelle, aux durées prévues par notre grille. Attestation immédiate par e-mail ou WhatsApp.

À partir de [PRIX_GRILLE] €/jour. [Estimer mon tarif en 30 secondes] [Souscrire par WhatsApp]

**Vos garanties**

Responsabilité civile (obligatoire) + défense pénale et recours suite à accident.

**Où êtes-vous couvert ?**

En France et dans 35 pays. [Voir la liste complète des pays couverts]. DOM-TOM : oui, avec des tarifs spécifiques.

**Dans quelles situations ?**

Convoyage après achat ou vente · plaque WW · import / export · sortie de fourrière · attente entre deux contrats annuels.

**Qui peut souscrire ?**

Conducteur d'au moins 21 ans, 2 ans de permis, permis adapté au véhicule, déclarations conformes (voir souscription).

**Questions fréquentes**

Quelles durées ? Celles de notre grille (raccourcis 8 et 15 jours) — le tarificateur affiche toutes les durées disponibles avec leur prix.
Le conducteur doit-il être le souscripteur ? Non, mais il doit être déclaré et remplir les conditions d'éligibilité.
Documents reçus ? Contrat, attestation et carte internationale d'assurance, par e-mail ou WhatsApp.

[Estimer mon tarif en 30 secondes] [Souscrire par WhatsApp]

### 6.3 /assurance-temporaire-camping-car — texte intégral

**Title** : Assurance camping-car temporaire 1 à 90 jours | TempAssur
**Meta** : Assurance temporaire camping-car et fourgon aménagé, de 1 à 90 jours. Souscription en ligne, attestation par e-mail ou WhatsApp.

**Assurance temporaire camping-car et fourgon aménagé**

Partez l'esprit tranquille : assurance temporaire camping-car de 1 à 90 jours, idéale pour un voyage ponctuel, un prêt, un achat ou un rapatriement. Le prix affiché correspond aux modèles de moins de 3,5 T ; il est ajusté selon le poids lors de la souscription.

À partir de [PRIX_GRILLE] €/jour. [Estimer mon tarif en 30 secondes] [Souscrire par WhatsApp]

**Vos garanties**

Responsabilité civile (obligatoire) + défense pénale et recours suite à accident.

**Où êtes-vous couvert ?**

En France et dans 35 pays d'Europe — parfait pour un road-trip. [Voir la liste complète des pays couverts]. DOM-TOM : oui, tarifs spécifiques.

**Dans quelles situations ?**

Voyage ponctuel · location ou prêt entre particuliers · achat / vente · rapatriement · sortie d'hivernage · contrôle technique.

**Questions fréquentes**

Mon fourgon aménagé est-il accepté ? Oui, les fourgons aménagés sont assurés comme les camping-cars.
Mon camping-car dépasse 3,5 T ? Il est assurable : le tarif est ajusté selon le poids à la souscription.
Qui peut souscrire ? Conducteur d'au moins 21 ans avec 2 ans de permis.

[Estimer mon tarif en 30 secondes] [Souscrire par WhatsApp]

### 6.4 /assurance-temporaire-quadricycle — texte intégral

**Title** : Assurance temporaire quad, voiturette sans permis, buggy | TempAssur
**Meta** : Quad homologué, voiturette sans permis ou buggy : assurance temporaire en ligne, attestation par e-mail ou WhatsApp.

**Assurance temporaire quadricycles : quad, voiturette, buggy**

Quad homologué, voiturette sans permis ou buggy : assurez votre quadricycle pour la durée dont vous avez vraiment besoin. Le prix d'appel affiché correspond au sous-type le moins cher ; le tarif exact s'ajuste selon votre véhicule à la souscription.

À partir de [PRIX_GRILLE] €/jour. [Estimer mon tarif en 30 secondes] [Souscrire par WhatsApp]

**Vos garanties**

Responsabilité civile (obligatoire) + défense pénale et recours suite à accident.

**Où êtes-vous couvert ?**

En France et dans 35 pays. [Voir la liste complète des pays couverts]. DOM-TOM : oui, tarifs spécifiques.

**Dans quelles situations ?**

Achat / vente · saison estivale · sortie de fourrière · véhicule de loisir utilisé quelques semaines par an · contrôle technique.

**Questions fréquentes**

Quel permis pour une voiturette sans permis ? Dès 14 ans le permis AM (ex-BSR) suffit pour conduire — mais pour souscrire chez nous, le conducteur doit avoir 21 ans et 2 ans de permis.
Mon quad n'est pas homologué route ? Il n'est pas assurable pour circuler sur la voie publique.
Quelles durées ? Celles de la grille — raccourcis 10, 15, 20 et 30 jours.

[Estimer mon tarif en 30 secondes] [Souscrire par WhatsApp]

### 6.5 /assurance-temporaire-bus-autocar — texte intégral

**Title** : Assurance temporaire bus et autocar | TempAssur
**Meta** : Assurez un bus ou un autocar pour un convoyage, un achat ou une vente. Souscription en ligne, attestation immédiate.

**Assurance temporaire bus et autocars**

Assurez un bus ou un autocar pour un convoyage, un achat, une vente ou un transfert de véhicule. Souscription 100 % en ligne, attestation immédiate par e-mail ou WhatsApp.

À partir de [PRIX_GRILLE] €/jour. [Estimer mon tarif en 30 secondes] [Souscrire par WhatsApp]

**Vos garanties**

Responsabilité civile (obligatoire) + défense pénale et recours suite à accident.

**Où êtes-vous couvert ?**

En France et dans 35 pays. [Voir la liste complète des pays couverts]. DOM-TOM : oui, tarifs spécifiques.

**Dans quelles situations ?**

Convoyage après achat ou vente aux enchères · import / export · repositionnement de flotte · sortie de fourrière.

**Questions fréquentes**

Quelles durées ? Celles de la grille (raccourcis 8 et 15 jours).
Le transport de passagers est-il couvert ? La garantie couvre la responsabilité civile du véhicule ; pour un usage commercial avec passagers, contactez-nous avant de souscrire : +33 6 05 93 84 79.

[Estimer mon tarif en 30 secondes] [Souscrire par WhatsApp]

### 6.6 /assurance-temporaire-tracteur-agricole — texte intégral

**Title** : Assurance tracteur agricole temporaire dès [PRIX] €/jour | TempAssur
**Meta** : Moissons, convoyage, achat : assurance temporaire tracteur agricole en ligne, attestation par e-mail ou WhatsApp.

**Assurance temporaire tracteur agricole**

Moissons, convoyage, achat ou vente : assurez votre tracteur ou engin agricole pour quelques jours, sans engagement annuel. Souscription en ligne, attestation par e-mail ou WhatsApp.

À partir de [PRIX_GRILLE] €/jour. [Estimer mon tarif en 30 secondes] [Souscrire par WhatsApp]

**Vos garanties**

Responsabilité civile (obligatoire) + défense pénale et recours suite à accident.

**Où êtes-vous couvert ?**

En France et dans 35 pays. [Voir la liste complète des pays couverts]. DOM-TOM : oui, tarifs spécifiques.

**Dans quelles situations ?**

Période de moissons ou de récolte · convoyage après achat / vente · prêt entre exploitants · déplacement exceptionnel sur route.

**Questions fréquentes**

Quelles durées ? Celles de la grille (raccourcis 8 et 15 jours).
Un tracteur ancien / de collection est-il accepté ? Oui s'il est immatriculé. → À lire aussi : notre article « Assurance temporaire pour tracteur agricole »

[Estimer mon tarif en 30 secondes] [Souscrire par WhatsApp]

### 6.7 /assurance-temporaire-remorque — texte intégral

**Title** : Assurance temporaire remorque, semi-remorque, caravane | TempAssur
**Meta** : Remorque, semi-remorque ou caravane : assurance temporaire obligatoire au-delà de 750 kg. Souscription en ligne immédiate.

**Assurance temporaire remorques, semi-remorques et caravanes**

Remorque légère ou lourde, semi-remorque, caravane : au-delà de 750 kg de PTAC, une assurance responsabilité civile dédiée est obligatoire — celle du véhicule tracteur ne suffit plus. Assurez la vôtre pour un convoyage, un achat ou un déplacement ponctuel.

À partir de [PRIX_GRILLE] €/jour. [Estimer mon tarif en 30 secondes] [Souscrire par WhatsApp]

**Vos garanties**

Responsabilité civile (obligatoire) + défense pénale et recours suite à accident.

**Où êtes-vous couvert ?**

En France et dans 35 pays. [Voir la liste complète des pays couverts]. DOM-TOM : oui, tarifs spécifiques.

**Dans quelles situations ?**

Achat / vente · déménagement · départ en vacances avec une caravane · transport ponctuel de matériel · import / export.

**Questions fréquentes**

Ma remorque fait moins de 750 kg ? Elle est en principe couverte par l'assurance du véhicule tracteur — vérifiez votre contrat.
Quelles durées ? Celles de la grille (raccourcis 8 et 15 jours). → À lire aussi : notre article « Assurance temporaire caravane, remorque ou semi-remorque »

[Estimer mon tarif en 30 secondes] [Souscrire par WhatsApp]

### 6.8 /assurance-frontiere — texte intégral

**Title** : Assurance frontière : circuler en France et en Europe avec un véhicule étranger | TempAssur
**Meta** : Véhicule immatriculé hors UE ou à l'étranger ? L'assurance frontière vous couvre en France et dans 35 pays. 30 ou 90 jours, attestation immédiate.

**Assurance frontière — pour circuler en France et en Europe**

Votre véhicule est immatriculé hors Union européenne et hors système carte verte — ou immatriculé à l'étranger et doit circuler en France ? L'assurance frontière est la solution légale et obligatoire pour prendre la route. Et chez TempAssur, elle ne couvre pas que la France : vous êtes couvert dans 35 pays, la même liste que nos assurances temporaires.

Disponible en 30 ou 90 jours — attestation par e-mail ou WhatsApp. [Estimer mon tarif] [Souscrire par WhatsApp]

**À qui s'adresse l'assurance frontière ?**

- Aux voyageurs qui viennent en Europe avec leur véhicule : Maghreb, Balkans hors carte verte, Moyen-Orient, Amériques…
- Aux Français de l'étranger de retour temporaire avec un véhicule immatriculé hors UE ;
- Aux véhicules en transit ou en cours d'importation.

**Vos garanties**

Responsabilité civile (obligatoire) + défense pénale et recours suite à accident. Vous recevez une carte internationale d'assurance valable dans les 35 pays couverts.

**Où êtes-vous couvert ?**

Dans 35 pays, pas seulement en France — c'est l'un des grands avantages de notre contrat frontière. [Voir la liste complète des pays couverts]

**Questions fréquentes**

Suis-je couvert seulement en France ? Non : votre assurance frontière TempAssur vous couvre dans les 35 pays de la liste commune (Allemagne, Espagne, Italie, Suisse…).
Quels documents fournir ? La pièce d'identité ou le passeport du conducteur, son permis, et le certificat d'immatriculation du véhicule.
Puis-je souscrire avant d'arriver en France ? Oui, 100 % en ligne, avec une date d'effet différée : vos documents vous attendent dans votre boîte mail ou sur WhatsApp.
Quelles durées ? 30 ou 90 jours (30 jours est la formule la plus choisie).

[Estimer mon tarif] [Souscrire par WhatsApp]

### 6.9 /pays-couverts — texte intégral

**Title** : Pays couverts par votre assurance temporaire et frontière | TempAssur
**Meta** : La liste complète des 35 pays couverts par nos assurances temporaires et frontière, et les 7 pays accessibles avec l'option extension.

**Dans quels pays êtes-vous couvert ?**

Bonne nouvelle : nos assurances temporaires et notre assurance frontière couvrent la même liste de 35 pays. Une seule liste à retenir, quel que soit votre contrat.

**Les 35 pays couverts**

Allemagne · Andorre · Autriche · Belgique · Bosnie-Herzégovine · Bulgarie · Chypre · Croatie · Danemark · Espagne · Estonie · Finlande · France · Grèce · Hongrie · Irlande · Islande · Israël · Italie · Lettonie · Lituanie · Luxembourg · Malte · Monténégro · Norvège · Pays-Bas · Pologne · Portugal · République tchèque · Roumanie · Royaume-Uni · Serbie · Slovaquie · Slovénie · Suède · Suisse (Monaco, Saint-Marin et le Liechtenstein sont assimilés à la France, à l'Italie et à la Suisse.) (À afficher en tableau 3 colonnes avec drapeaux.)

**Besoin d'aller plus loin ? L'option extension de circulation**

Pour les automobiles uniquement (hors DOM-TOM), l'option extension ouvre 7 pays supplémentaires : Albanie · Azerbaïdjan · Macédoine du Nord · Maroc · Moldavie · Tunisie · Turquie. Son prix dépend de la durée du contrat.

**Jamais couverts, quelle que soit l'option**

Biélorussie · Iran · Russie · Ukraine (bloc rouge)

La couverture de certains pays peut varier selon la compagnie, le véhicule, la durée et les options choisies. Vous comptez rouler dans un pays qui n'est pas dans la liste ? Contactez-nous : WhatsApp / tél. +33 6 05 93 84 79 — nous vérifions pour vous.

La carte internationale d'assurance remise avec votre contrat fait foi.

[Estimer mon tarif en 30 secondes] [Souscrire par WhatsApp]

Cette page est la cible de tous les liens « cliquez ici » / « liste des pays » du site.

### 6.10 /qui-sommes-nous — texte intégral

**Title** : Qui sommes-nous ? Courtier en assurance temporaire | TempAssur
**Meta** : TempAssur (WN Conseil), courtier français ORIAS n° 24004933, spécialiste de l'assurance temporaire de 1 à 90 jours pour tous les véhicules.

**Qui sommes-nous ?**

TempAssur est la marque de WN Conseil, cabinet de courtage en assurances français basé à Clichy (Hauts-de-Seine), immatriculé à l'ORIAS sous le n° 24004933. Notre spécialité : l'assurance temporaire, de 1 à 90 jours, pour tous les véhicules — automobile, poids lourd, camping-car, quadricycle, bus, tracteur agricole, remorque — et l'assurance frontière pour les véhicules immatriculés à l'étranger.

**Notre promesse**

- La rapidité : souscription 100 % en ligne en 5 minutes, attestation envoyée immédiatement par e-mail ou WhatsApp — même le week-end.
- La disponibilité : une vraie équipe joignable 7j/7 par téléphone et WhatsApp au +33 6 05 93 84 79. Un blocage au paiement, une urgence, une question ? Nous répondons.
- La transparence : les prix s'affichent avant que vous ne laissiez la moindre coordonnée, et vos contrats sont portés par des entreprises d'assurance agréées, régies par le Code des assurances.

**Où nous trouver**

Bureau 3, 6 Rue des Bateliers, 92110 Clichy. (Carte Google Maps intégrée + lien vers la fiche.)

[Estimer mon tarif en 30 secondes] [Nous contacter]

### 6.11 /faq — texte intégral (schema FAQPage)

**Questions fréquentes**

**La souscription**

En combien de temps suis-je assuré ? En quelques minutes : estimation du tarif, souscription en ligne, paiement par carte, signature électronique — puis votre attestation arrive par e-mail ou WhatsApp.
Qui peut souscrire ? Tout conducteur d'au moins 21 ans, titulaire du permis depuis au moins 2 ans, répondant aux déclarations présentées avant le paiement (sinistres, résiliation, condamnations, malus).
Puis-je souscrire pour quelqu'un d'autre ? Oui, mais le conducteur doit être déclaré et remplir toutes les conditions d'éligibilité.
Puis-je choisir l'heure d'effet ? Oui, à la souscription — la garantie démarre après signature des documents.

**Les prix**

Comment le prix est-il calculé ? Selon la catégorie de véhicule, la durée, la zone (métropole ou DOM-TOM) et les options. Le prix des options dépend de la durée. Tout s'affiche dans le tarificateur, sans laisser votre e-mail.
Les tarifs DOM-TOM sont-ils les mêmes ? Non, ils diffèrent de la métropole ; ils s'affichent automatiquement dès que vous indiquez votre pays de résidence ou d'immatriculation. Les options n'y sont pas disponibles.

**La couverture**

Dans quels pays suis-je couvert ? En France et dans 35 pays — la même liste pour l'assurance temporaire et l'assurance frontière. [Voir la liste]
Puis-je aller au Maroc, en Tunisie ou en Turquie ? Oui, avec l'option extension de circulation (automobiles uniquement).
Quelles garanties sont incluses ? La responsabilité civile obligatoire et la défense pénale et recours. Pour l'automobile, des options existent : garantie du conducteur, extension de pays, assistance.

**Les documents**

Quels documents vais-je recevoir ? Votre contrat, votre attestation d'assurance et votre carte internationale d'assurance — par e-mail ou WhatsApp, au choix.
Je n'ai pas reçu mon attestation. Vérifiez vos spams. Si l'heure d'effet approche, contactez-nous immédiatement : WhatsApp / tél. +33 6 05 93 84 79 — nous accélérons le traitement.

**L'annulation**

Puis-je annuler ou me faire rembourser ? Les contrats temporaires sont à durée ferme, sans tacite reconduction ; une fois la garantie en vigueur, ils ne peuvent être ni annulés ni remboursés (voir CGV).

Une autre question ? WhatsApp / tél. +33 6 05 93 84 79 (7j/7) ou contact@tempassur.com.

### 6.12 /contact — texte intégral

**Title** : Contactez TempAssur — 7j/7 par WhatsApp, téléphone ou e-mail

**Contactez-nous — nous répondons 7j/7**

Le plus rapide : WhatsApp — [Écrire sur WhatsApp : +33 6 05 93 84 79]
Par téléphone : +33 6 05 93 84 79 · +33 9 70 70 53 41
Par e-mail : contact@tempassur.com
Par courrier : WN Conseil / TempAssur, Bureau 3, 6 Rue des Bateliers, 92110 Clichy

Formulaire : Nom · E-mail · Téléphone · Sujet (Souscription / Paiement / Attestation / Réclamation / Autre) · Message · bouton Envoyer.
Message de confirmation : « Merci ! Votre message est bien envoyé, nous revenons vers vous rapidement. Urgent ? WhatsApp : +33 6 05 93 84 79. »

(Carte Google Maps intégrée — fiche : https://maps.app.goo.gl/7fc1hB29zkNHGjbZ8)

## 7. Pages légales — textes complets à intégrer

Base : pages actuelles de tempassur.com, corrigées. L'article 8 des CGV (rétractation) est conservé tel quel à la demande du client. Le reste est mis en conformité avec le statut de courtier (distribution d'assurances). **Faire valider l'ensemble par un avocat avant mise en ligne.**

### 7.1 /mentions-legales

**Éditeur du site**

Le site www.tempassur.com est édité par WN Conseil, Entreprise Unipersonnelle à Responsabilité Limitée (EURL) au capital de 1 000,00 €, immatriculée au RCS de Nanterre sous le numéro 929 812 642. Siège social : Bureau 3, 6 Rue des Bateliers, 92110 Clichy, France · SIRET : 929 812 642 00015 · TVA intracommunautaire : FR14929812642. Directeur de la publication : Walid Nefzi, gérant. Téléphone : +33 6 05 93 84 79 (WhatsApp) · +33 9 70 70 53 41 · E-mail : contact@tempassur.com

**Activité réglementée — distribution d'assurances**

WN Conseil est courtier en assurances, immatriculé à l'ORIAS sous le n° 24004933 (catégorie courtier d'assurance ou de réassurance — COA), vérifiable sur www.orias.fr. WN Conseil exerce son activité sous le contrôle de l'Autorité de Contrôle Prudentiel et de Résolution (ACPR) — 4 place de Budapest, CS 92459, 75436 Paris Cedex 09 — acpr.banque-france.fr. Les contrats d'assurance distribués sur ce site sont portés par des entreprises d'assurance agréées, régies par le Code des assurances. La liste des compagnies partenaires est disponible sur demande ; le nom de l'assureur de votre contrat figure sur vos documents contractuels. WN Conseil ne détient aucune participation directe ou indirecte dans une entreprise d'assurance, et aucune entreprise d'assurance ne détient de participation dans WN Conseil. WN Conseil travaille avec plusieurs entreprises d'assurance et n'est pas soumis à une obligation contractuelle de travailler exclusivement avec l'une d'elles ; la liste des compagnies partenaires est disponible sur demande. WN Conseil est rémunéré par une commission incluse dans la prime d'assurance.

**Réclamation et médiation**

Pour toute réclamation, consultez notre page Réclamation. Après épuisement des recours internes, vous pouvez saisir gratuitement le médiateur compétent (coordonnées sur la page Réclamation).

**Hébergement**

Le site est hébergé par HOSTINGER INTERNATIONAL LTD, 61 Lordou Vironos Street, 6023 Larnaca, Chypre — www.hostinger.fr/contact.

**Mise en garde**

Les informations fournies sur le site TempAssur ont un caractère informatif et ne sauraient en aucun cas être considérées comme des conseils. Bien que WN Conseil s'efforce de maintenir les informations du site à jour et précises, des inexactitudes ou des omissions peuvent survenir. Si vous identifiez un problème, merci de nous en informer par e-mail en détaillant le problème. Toute utilisation du site et tout téléchargement de contenu se font sous la responsabilité de l'utilisateur. WN Conseil décline toute responsabilité en cas de dommage résultant de ces actions. Tout contenu téléchargé se fait aux risques et périls de l'utilisateur et sous sa seule responsabilité. En conséquence, WN Conseil ne saurait être tenue responsable d'un quelconque dommage subi par l'ordinateur de l'utilisateur ou d'une perte de données consécutive à la navigation.

**Propriété intellectuelle**

L'intégralité du contenu du site TempAssur (textes, graphiques, images, vidéos, etc.) est protégée par le droit de la propriété intellectuelle et est la propriété exclusive de WN Conseil ou de ses partenaires. Toute reproduction, représentation ou exploitation, totale ou partielle, de ces contenus, sans autorisation expresse et préalable de WN Conseil, est strictement interdite. Les marques et logos présents sur le site sont également protégés et leur utilisation est prohibée sans accord préalable.

**Données personnelles**

Les données personnelles collectées via le site TempAssur sont traitées en conformité avec la loi « Informatique et Libertés » du 6 janvier 1978, ainsi qu'avec le Règlement Général sur la Protection des Données (RGPD). Les informations collectées sont destinées à la gestion de vos demandes, à l'établissement de devis et à la gestion des contrats d'assurance. WN Conseil garantit la confidentialité des données personnelles et s'engage à ne pas les transmettre à des tiers à des fins de prospection commerciale. Vous disposez d'un droit d'accès, de rectification et de suppression de vos données en contactant WN Conseil à l'adresse suivante : contact@tempassur.com. Pour en savoir plus, consultez notre Politique de confidentialité.

**Contact**

Par e-mail : contact@tempassur.com · Par téléphone : +33 6 05 93 84 79 (WhatsApp) · +33 9 70 70 53 41

### 7.2 /cgv — Conditions générales de vente (texte intégral)

**Conditions générales de vente (CGV)**

**1. Présentation du site**

La société WN Conseil, EURL au capital de 1 000,00 €, immatriculée au RCS de Nanterre sous le numéro 929 812 642. Siège social : Bureau 3, 6 Rue des Bateliers, 92110 Clichy, France · E-mail : contact@tempassur.com · Numéro ORIAS : 24004933 (www.orias.fr). WN Conseil intervient en qualité de courtier en assurances (ORIAS n° 24004933). Les contrats d'assurance souscrits via le site TempAssur sont conclus entre le client et l'entreprise d'assurance qui porte le risque (son nom figure sur les documents contractuels), WN Conseil agissant en qualité d'intermédiaire et n'étant pas partie au contrat d'assurance. Les présentes conditions générales de vente (CGV) régissent les ventes effectuées sur le site TempAssur.

**2. Objet**

Les présentes CGV ont pour objet de définir les droits et obligations des parties dans le cadre de la vente en ligne de produits d'assurance temporaire proposés sur le site TempAssur.

**3. Acceptation des CGV**

Toute commande effectuée sur le site TempAssur implique l'acceptation pleine et entière des présentes CGV. Le client déclare en avoir pris connaissance avant de passer commande.

**4. Produits et services**

TempAssur propose des produits d'assurance temporaire adaptés à différents types de véhicules. Les caractéristiques essentielles des produits sont décrites sur le site. Il est de la responsabilité du client de s'assurer que le produit choisi correspond à ses besoins. Avant toute souscription, le client reçoit le document d'information sur le produit d'assurance (IPID) ainsi que les conditions générales du contrat. Les conditions d'éligibilité (âge minimum de 21 ans, permis de conduire depuis au moins 2 ans, déclarations relatives aux antécédents) sont vérifiées lors de la souscription ; toute fausse déclaration expose l'assuré aux sanctions prévues aux articles L.113-8 et L.113-9 du Code des assurances.

**5. Commande**

La commande se fait en ligne, par le biais du site TempAssur. Le client doit sélectionner le produit d'assurance souhaité, remplir les informations requises, et valider sa commande. La validation de la commande entraîne l'acceptation des prix et descriptions des produits, ainsi que des présentes CGV, et comprend l'acceptation expresse des déclarations du conducteur présentées avant paiement. Le client reçoit ensuite un e-mail de confirmation de sa commande.

**6. Prix**

Les prix affichés sur le site TempAssur sont indiqués en euros et incluent la TVA applicable au jour de la commande. WN Conseil se réserve le droit de modifier ses prix à tout moment, mais les produits seront facturés sur la base des tarifs en vigueur au moment de la validation de la commande.

**7. Paiement**

Le paiement s'effectue par carte bancaire ou tout autre moyen indiqué sur le site. Le client garantit qu'il est pleinement habilité à utiliser le moyen de paiement choisi. Le montant de la commande sera débité au moment de la validation de celle-ci.

**8. Droit de rétractation**

En raison de la nature temporaire des contrats d'assurance proposés sur le site TempAssur, le client renonce expressément à son droit de rétractation. Une fois le contrat souscrit et la garantie en vigueur, aucune annulation ni remboursement ne sera possible. Le client reconnaît que le contrat est à durée ferme et sans tacite reconduction, et qu'il ne peut donc être résilié.

**9. Responsabilité**

WN Conseil s'engage à fournir des produits conformes aux dispositions légales en vigueur. Toutefois, WN Conseil ne peut être tenue responsable des dommages indirects résultant de l'utilisation des produits vendus sur le site.

**10. Données personnelles**

Les informations collectées par WN Conseil lors de la commande sont nécessaires pour le traitement de celle-ci. Elles sont traitées conformément à la législation sur la protection des données. Le client peut exercer ses droits d'accès, de rectification et de suppression de ses données en contactant WN Conseil.

**11. Modifications des CGV**

WN Conseil se réserve le droit de modifier les présentes CGV à tout moment. Les conditions applicables sont celles en vigueur au moment de la commande.

**12. Loi applicable et litiges**

Les présentes Conditions Générales de Vente sont régies par la loi française. En cas de litige lié à une commande ou à l'application des présentes CGV, le client est invité à contacter le service client de WN Conseil afin de tenter de résoudre le différend à l'amiable. Pour les litiges relatifs à un contrat d'assurance, le client peut saisir gratuitement La Médiation de l'Assurance : www.mediation-assurance.org — Pôle CSCA, TSA 50110, 75441 Paris Cedex 09. Pour les autres litiges relatifs au site, le médiateur de la consommation désigné est l'IEAM (Institut d'Expertise, d'Arbitrage et de Médiation) : 31 bis – 33 rue Daru, 75008 Paris — www.ieam.eu — contact@ieam.eu. En cas de recours à la justice, les tribunaux compétents seront ceux du ressort du siège social de WN Conseil.

**13. Contact**

Pour toute question ou réclamation, vous pouvez contacter TempAssur : Par e-mail : contact@tempassur.com · Par téléphone ou WhatsApp : +33 6 05 93 84 79 · Voir aussi notre page Réclamation.

*(Article 8 conservé à l'identique à la demande du client. Ensemble à faire valider par un avocat.)*

### 7.3 /politique-de-confidentialite (texte intégral)

*(Remplace l'ancienne page, qui contenait des passages du gabarit WordPress — commentaires, images EXIF — sans rapport avec le nouveau site.)*

**Politique de confidentialité et de cookies**

**1. Responsable de traitement**

La présente politique décrit comment WN Conseil (opérant sous le nom TempAssur), Bureau 3, 6 Rue des Bateliers, 92110 Clichy — contact@tempassur.com — collecte, utilise, stocke et protège vos données personnelles via le site www.tempassur.com.

**2. Données collectées**

- Devis et souscription : identité, coordonnées, date de naissance, informations du permis de conduire, informations du véhicule, antécédents déclarés (sinistres, résiliation, condamnations, malus).
- Paiement : les données bancaires sont traitées directement par notre prestataire de paiement sécurisé ; TempAssur ne les stocke jamais.
- Formulaires de contact : les données saisies, votre adresse IP et l'agent utilisateur de votre navigateur (prévention de la fraude et des messages indésirables).
- Navigation : cookies et mesure d'audience (voir §7).

**3. Finalités et bases légales**

Établissement des devis et exécution du contrat (exécution contractuelle) ; obligations légales du courtier, dont le devoir de conseil et la lutte contre le blanchiment (obligation légale) ; gestion de la relation client, statistiques et amélioration du site (intérêt légitime) ; communications commerciales (consentement, retirable à tout moment).

**4. Destinataires**

Les entreprises d'assurance partenaires, pour l'établissement et la gestion de vos contrats ; nos prestataires techniques (hébergement, paiement, signature électronique, envoi d'e-mails et de messages WhatsApp). WN Conseil ne vend jamais vos données personnelles.

**5. Durées de conservation**

Données contractuelles : pendant la durée du contrat puis conformément aux prescriptions légales (5 ans minimum, jusqu'à 10 ans pour les documents comptables). Prospects : 3 ans après le dernier contact.

**6. Vos droits**

Vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation, de portabilité et d'opposition : écrivez à contact@tempassur.com. Vous pouvez également introduire une réclamation auprès de la CNIL (www.cnil.fr).

**7. Cookies**

Lors de votre première visite, un bandeau vous permet d'accepter ou de refuser les cookies par catégorie : cookies nécessaires au fonctionnement du site, mesure d'audience, marketing. Durée de vie maximale : 13 mois. Vous pouvez modifier vos choix à tout moment via le lien « Gérer mes cookies » en bas de page.

**8. Sécurité**

Nous mettons en œuvre des mesures de sécurité appropriées (chiffrement TLS, accès restreints, prestataires certifiés) pour protéger vos données contre tout accès non autorisé, divulgation ou destruction.

**9. Modifications et contact**

Cette politique peut être mise à jour à tout moment ; la version en vigueur est celle publiée sur cette page. Pour toute question : contact@tempassur.com · +33 6 05 93 84 79 (WhatsApp) · +33 9 70 70 53 41.

### 7.4 /reclamation (nouvelle page — obligatoire)

**Une réclamation ?**

Nous nous efforçons de répondre à toute réclamation dans les meilleurs délais.

**1. Contactez notre service réclamation**
Par e-mail : contact@tempassur.com (objet : « Réclamation ») · Par courrier : WN Conseil — Service Réclamations, Bureau 3, 6 Rue des Bateliers, 92110 Clichy · Par téléphone : +33 6 05 93 84 79. Nous accusons réception de votre réclamation sous 10 jours ouvrables et y répondons sous 2 mois maximum.

**2. La réclamation concerne votre contrat d'assurance**
Si notre réponse ne vous satisfait pas, vous pouvez saisir le service réclamation de l'entreprise d'assurance qui porte votre contrat (nom et coordonnées dans vos conditions générales).

**3. La médiation**
Après épuisement de ces recours, vous pouvez saisir gratuitement La Médiation de l'Assurance : www.mediation-assurance.org — Pôle CSCA, TSA 50110, 75441 Paris Cedex 09. Pour un litige relatif au site (hors contrat d'assurance) : IEAM, 31 bis – 33 rue Daru, 75008 Paris — www.ieam.eu.

## 8. SEO technique — checklist développeur

1. **Domaine et redirections** : à la mise en ligne, canonical = https://www.tempassur.com (déjà le cas en préprod — vérifier qu'aucune URL Hostinger n'est indexée : noindex sur la préprod + auth basique). Plan de 301 depuis les anciennes URLs WordPress : /souscription/?step=… → nouvelles pages produit ; /qui-sommes-nous/, /contactez-nous/ → /contact, /nos-garanties/ → page produit auto, articles de blog → mêmes slugs conservés (§9).
2. Un seul H1 par page, hiérarchie H2/H3 propre, titles ≤ 60 caractères, meta descriptions ≤ 155.
3. **Schema.org (JSON-LD)** : InsuranceAgency (accueil : nom, adresse Clichy, téléphone, horaires, lien fiche Google Maps, aggregateRating si avis intégrés) · FAQPage (accueil, /faq, pages produit) · BreadcrumbList · Article (blog) · Service ou Product avec offers.priceSpecification sur les pages produit (prix « à partir de » depuis la grille).
4. **Performance / Core Web Vitals** : images WebP/AVIF + loading="lazy", LCP < 2,5 s, tarificateur en rendu serveur ou hydratation légère (le prix doit être dans le HTML initial), pas de layout shift sur le hero.
5. **Maillage interne** : accueil → 8 pages produit → /pays-couverts → blog, et retour. Chaque article de blog pointe vers sa page produit avec une ancre descriptive.
6. **Sitemap.xml + robots.txt**, soumission Search Console (propriété déjà vérifiée : réutiliser le token google-site-verification existant).
7. **Tout le site en français** — corriger le formulaire anglais de la préprod (« Get A Free Quote Now » → « Obtenir mon tarif »).
8. **Fiche Google Business Profile** (https://maps.app.goo.gl/7fc1hB29zkNHGjbZ8) : lien dans le footer, widget avis sur l'accueil, NAP identique partout, encourager les avis post-souscription (e-mail J+2 avec lien direct « Laissez-nous un avis »).
9. **Mesure** : GTM + GA4 (conversion = page /merci uniquement), suivi des clics WhatsApp et tel: comme événements.
10. **Numéros cliquables partout** : tel:+33605938479, mailto:contact@tempassur.com, https://wa.me/33605938479.

## 9. Blog — migration, corrections et nouveaux articles

### 9.1 Articles existants sur tempassur.com : à migrer (mêmes slugs + 301)

| Article (slug actuel) | Action |
|---|---|
| /assurance-temporaire-caravane-remorque-semi/ | Migrer tel quel, lien vers /assurance-temporaire-remorque |
| /assurance-temporaire-certificat-provisoire-ww/ | Fusionner avec l'article plaques WW ci-dessous (doublon SEO) |
| /souscrire-assurance-temporaire-plaque-ww/ | Article conservé après fusion : y intégrer le contenu du doublon, 301 du doublon vers celui-ci |
| /suppression-vignette-assurance-temporaire/ | Migrer tel quel |
| /garanties-assurance-auto-provisoire/ | Migrer, aligner la liste des garanties sur §5 (RC + défense pénale et recours ; options automobile) |
| /assurance-frontiere-temporaire-auto/ | Migrer, ajouter le message « couvre 35 pays, pas seulement la France » + lien /assurance-frontiere et /pays-couverts |
| /assurance-temporaire-auto-maghreb-turquie/ | À corriger impérativement : l'article laisse entendre une couverture de l'Algérie. L'extension ne couvre que Maroc, Tunisie, Turquie (+ Albanie, Azerbaïdjan, Macédoine du Nord, Moldavie). L'Algérie n'est pas couverte — le dire explicitement. Remplacer par la version réécrite §9.2.1 |
| /assurance-temporaire-pour-tracteur-agricole/ | Migrer, lien vers /assurance-temporaire-tracteur-agricole |
| /assurance-provisoire-automobile/ | Migrer tel quel (cible pro) |
| /assurance-automobile-temporaire/ (5 situations) | Migrer, relier chaque situation à sa future page cas d'usage |
| /assurance-temporaire-vs-annuelle/ | Migrer tel quel |

Chaque article migré : ajouter un CTA en fin d'article (« Estimez votre tarif en 30 secondes ») + 2-3 liens internes vers les pages produit.

### 9.2 Nouveaux articles — 3 rédigés + 5 briefs

#### 9.2.1 « Rouler au Maroc, en Tunisie ou en Turquie avec une assurance temporaire : l'option extension de pays » (remplace l'article Maghreb/Turquie)

Mots-clés : assurance temporaire maroc, assurance auto tunisie, carte verte turquie.

Vous partez au Maghreb ou en Turquie avec votre voiture ? Depuis la France, votre assurance temporaire standard couvre 35 pays européens — mais pas le Maroc, la Tunisie ni la Turquie. La solution : l'option extension de circulation, disponible chez TempAssur pour les automobiles de moins de 3,5 tonnes.

**Ce que couvre l'extension.** En plus des 35 pays de base, l'extension ouvre la circulation dans 7 pays : Albanie, Azerbaïdjan, Macédoine du Nord, Maroc, Moldavie, Tunisie et Turquie. Vous recevez une carte internationale d'assurance mentionnant ces pays — c'est elle qui fait foi au passage de la frontière et lors des contrôles.

**Attention : l'Algérie n'est pas couverte.** Aucune de nos formules, avec ou sans extension, ne couvre l'Algérie. Pour y circuler, une assurance locale doit être souscrite à la frontière algérienne. De même, la Biélorussie, l'Iran, la Russie et l'Ukraine ne sont jamais couverts.

**Comment souscrire.** Choisissez « Automobile » dans notre tarificateur, votre durée (1 à 90 jours), puis cochez l'option « Extension de pays » : le prix s'ajuste selon la durée choisie. Vous recevez votre attestation et votre carte internationale par e-mail ou WhatsApp en quelques minutes — pratique quand on prépare un embarquement à Sète, Marseille ou Gênes.

**Bon à savoir.** L'extension concerne uniquement les automobiles : pour un poids lourd ou un camping-car, contactez-nous au +33 6 05 93 84 79 (WhatsApp), nous étudierons une solution personnalisée.

#### 9.2.2 « Voiture achetée le week-end : comment repartir assuré le jour même »

Mots-clés : assurance auto immédiate, assurer voiture jour même, assurance achat voiture.

Vous venez d'acheter une voiture d'occasion un samedi soir et le vendeur habite à 300 km ? Sans assurance, impossible de reprendre la route légalement : la responsabilité civile est obligatoire dès le premier mètre, et rouler sans assurance coûte jusqu'à 3 750 € d'amende, avec suspension de permis possible.

**L'assurance temporaire, la solution immédiate.** Chez TempAssur, la souscription est 100 % en ligne, 7j/7 : estimez votre tarif en 30 secondes, souscrivez en 5 minutes, payez par carte et recevez votre attestation par e-mail ou WhatsApp — même un dimanche. Vous choisissez la durée exacte dont vous avez besoin, de 1 à 90 jours, le temps de rapatrier le véhicule puis de souscrire votre contrat annuel en connaissance de cause.

**Les conditions.** Avoir au moins 21 ans, 2 ans de permis, et répondre aux déclarations d'antécédents présentées lors de la souscription. Le véhicule doit être immatriculé (une plaque provisoire WW convient — voir notre article dédié).

**Combien ça coûte ?** À partir de quelques euros par jour pour une automobile, selon la durée et la puissance ; le tarif exact s'affiche immédiatement dans notre tarificateur, sans laisser votre e-mail. Une journée d'assurance temporaire coûte bien moins cher qu'un engagement annuel pris dans la précipitation.

#### 9.2.3 « Sortie de fourrière : quelle assurance pour récupérer votre véhicule ? »

Mots-clés : assurance sortie de fourrière, attestation assurance fourrière, récupérer voiture fourrière.

Pour récupérer un véhicule en fourrière, la loi impose de présenter une attestation d'assurance en cours de validité (avec le permis et la carte grise). Problème : si votre véhicule a été mis en fourrière précisément parce qu'il n'était plus assuré — ou si votre assureur a résilié le contrat entre-temps — vous êtes bloqué.

**L'assurance temporaire débloque la situation en quelques minutes.** Souscrivez en ligne une assurance de 1 à 90 jours, recevez l'attestation par e-mail ou WhatsApp, présentez-la à la fourrière et repartez avec votre véhicule. Chaque jour de garde coûtant de l'argent, la rapidité compte : chez TempAssur, l'attestation part immédiatement après le paiement et la signature électronique.

**Quelle durée choisir ?** Le temps de récupérer le véhicule et de souscrire une assurance classique : 8 ou 15 jours suffisent souvent ; 30 jours si vous devez aussi passer le contrôle technique ou vendre le véhicule.

**Les conditions.** Conducteur d'au moins 21 ans avec 2 ans de permis, et déclarations d'antécédents conformes (notamment : pas de résiliation pour sinistre au cours des 5 dernières années). En cas de doute sur votre situation, écrivez-nous sur WhatsApp au +33 6 05 93 84 79 : nous vous répondons 7j/7.

### 9.2.4 Briefs des 5 articles suivants (à rédiger en phase 2)

1. « Plaque WW et assurance temporaire : le duo gagnant pour un véhicule importé » — fusion des 2 articles WW existants + cas import/export ; lien /assurance-temporaire-plaque-ww.
2. « Résilié par votre assureur : quelles solutions pour continuer à rouler ? » — distinguer résiliation pour non-paiement (assurable en temporaire) et résiliation pour sinistre < 5 ans (non éligible → contact pour solution personnalisée) ; ton prudent, pas de promesse.
3. « Vendre la voiture d'un proche décédé : l'assurance temporaire pour la succession » — véhicule en indivision, déplacement pour expertise/vente/contrôle technique.
4. « Contrôle technique d'un véhicule non assuré : comment faire ? » — courte assurance 8-15 jours pour conduire le véhicule au centre.
5. « Assurance temporaire à 21 ans : conditions et conseils » — clarifier l'éligibilité (21 ans + 2 ans de permis), gérer la déception des 18-20 ans en proposant des alternatives honnêtes.

Rythme conseillé : 2 articles/mois, catégorie et maillage systématiques vers les pages produit.

## 10. Points ouverts (bloquants ou à fournir au développeur)

1. **CG et IPID des contrats** : à fournir au développeur pour le bloc « Garanties incluses » définitif de la page automobile et pour les liens documentaires du tunnel (§4.6).
2. **Validation avocat** des pages légales (§7), notamment l'article 8 des CGV conservé tel quel et l'articulation IEAM / Médiation de l'Assurance.
3. **Unification des numéros** : supprimer le +33 1 84 80 30 40 des anciennes CGV ; numéro principal partout : +33 6 05 93 84 79.

## 11. Annexe — Grille tarifaire

La grille officielle est le fichier Classeur3.xlsx (transmis au développeur avec ce dossier). Règles d'implémentation :

- La grille est la seule source de vérité des prix : à charger en base (table tarifs : produit × sous-type × tranche de puissance/poids × durée × zone métropole/DOM-TOM × prix), jamais de prix en dur dans le front.
- Tous les « à partir de » du site (accueil, vignettes, pages produit, schema.org) sont calculés = MIN(prix) de la catégorie concernée.
- Raccourcis de durée générés depuis les durées réellement présentes dans la grille (§3.2).
- Camping-car ≤ 3,5 T = tarif véhicule léger + 20 €, aligné sur les durées du véhicule léger ; > 3,5 T = grille camping-car.
- Prix des options : dépend de la durée (table dédiée tarifs_options).
