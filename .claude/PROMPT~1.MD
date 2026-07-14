# Prompt pour Claude Code — Refonte TempAssur (tempassur.com)

Copie-colle tout ce qui suit dans Claude Code, avec en pièces jointes :
- `dossier-developpeur-tempassur.pdf` (spec complète, source de vérité pour tous les textes et règles fonctionnelles)
- `Classeur3.xlsx` (grille tarifaire, source de vérité pour tous les prix)

---

## Rôle et contexte

Tu travailles sur le repo Next.js existant du site **TempAssur** (assurance temporaire de véhicules, 1 à 90 jours — marque de WN Conseil, courtier ORIAS n° 24004933). Le site est en préprod sur Hostinger (`mediumvioletred-oryx-872860.hostingersite.com`), la cible finale est `www.tempassur.com`.

Le fichier `dossier-developpeur-tempassur.pdf` ci-joint est **la spec complète et définitive** : arborescence, contenu texte intégral de chaque page, règles de tarification, logique du tunnel de souscription, pages légales, SEO, blog. Le fichier `Classeur3.xlsx` est **la seule source de vérité pour les prix** — aucun prix ne doit être codé en dur ou inventé.

Avant de coder, lis intégralement le PDF (31 pages) et ouvre le fichier Excel pour comprendre sa structure exacte (feuilles, colonnes, tranches). Explore ensuite le repo existant pour identifier ce qui doit être conservé, corrigé ou remplacé.

**Règle d'or : ne rien inventer.** Tous les textes de pages (sections 3 à 9 du PDF) sont à reprendre tels quels (copier-coller), tous les prix viennent exclusivement de la grille Excel. Si une information manque (ex. libellés définitifs des garanties auto en attente des CG/IPID — voir §10 du PDF), pose-moi la question au lieu de deviner.

---

## 0. Priorités (à traiter dans cet ordre — §0 du PDF)

1. Remplacer tous les prix « dès X €/jour » actuellement affichés (accueil, vignettes) par des valeurs calculées depuis la grille Excel — les prix actuels du site sont tous faux (trop bas).
2. Tarificateur d'accueil : « Estimez votre assurance en 30 secondes », catégorie Automobile présélectionnée, prix affiché immédiatement (aucun champ e-mail), CTA « Aller vers la souscription ».
3. Raccourcis de durée dynamiques par catégorie (§3.2), générés depuis la grille — jamais un raccourci sans tarif correspondant.
4. Tunnel : étape « pays d'immatriculation + pays de résidence » en premier, bascule automatique vers les tarifs DOM-TOM, options non éligibles grisées (jamais masquées).
5. Éligibilité conducteur contrôlée à la saisie : âge ≥ 21 ans (via date de naissance) et permis ≥ 2 ans (via date d'obtention), front + back.
6. Pop-up de déclarations obligatoire et bloquant avant paiement (§4.6).
7. Bloc « aide au paiement » sous le bouton Payer, numéro et e-mail cliquables (`tel:`, `mailto:`).
8. Pages légales remplacées par les versions du §7 (mentions légales, CGV, confidentialité) + nouvelle page `/reclamation`.
9. SEO : redirections 301 depuis les anciennes URLs, une page par produit, page `/pays-couverts`, schema.org, fiche Google Maps intégrée (§8).
10. WhatsApp partout : bouton « Souscrire par WhatsApp » (`https://wa.me/33605938479`) dans le header, le hero, chaque page produit, + bouton flottant mobile ; mention « attestation par e-mail OU WhatsApp » mise en avant partout.

---

## 1. Modèle de données — grille tarifaire (§1.1 et §11 du PDF)

Construis une table `tarifs` (ou équivalent DB/JSON) avec les dimensions suivantes, calquées exactement sur les colonnes du fichier Excel :

- `produit` (automobile, poids_lourd, camping_car, quadricycle, bus_autocar, tracteur_agricole, remorque, frontiere)
- `sous_type` (ex. quad / voiturette / buggy pour quadricycle ; ≤3,5T / >3,5T pour camping-car ; tranche de puissance fiscale pour automobile)
- `duree` (en jours, uniquement les valeurs présentes dans le fichier)
- `zone` (métropole / DOM-TOM)
- `prix`

Et une table séparée `tarifs_options` : `option` (garantie_conducteur, assistance, extension_pays) × `produit` × `duree` × `prix`. Une option n'existe que si elle a des colonnes dans le fichier Excel pour cette catégorie (ex. **le poids lourd n'a aucune option** — ne rien afficher).

Règles de dérivation :
- Camping-car ≤ 3,5 T = tarif véhicule léger + 20 €, alignée sur les durées du véhicule léger ; > 3,5 T = grille camping-car dédiée.
- Tous les « à partir de X €/jour » du site (accueil, vignettes, pages produit, schema.org `offers.priceSpecification`) = `MIN(prix)` de la catégorie concernée, calculé dynamiquement, jamais en dur.
- Les raccourcis de durée (§3.2) sont générés à partir des durées réellement présentes dans la grille pour chaque catégorie — ne jamais coder les raccourcis suivants en dur sans les valider contre le fichier :

| Catégorie | Raccourcis | Présélection |
|---|---|---|
| Automobile | 8 · 15 · 30 · 90 j | 30 j |
| Camping-car | 8 · 15 · 30 · 90 j | 30 j |
| Poids lourd | 8 · 15 j | 15 j |
| Tracteur agricole | 8 · 15 j | 15 j |
| Bus, autocars | 8 · 15 j | 15 j |
| Remorques | 8 · 15 j | 15 j |
| Quadricycles | 10 · 15 · 20 · 30 j | 30 j |
| Assurance frontière | 30 · 90 j | 30 j |

- Si pays d'immatriculation OU de résidence = DOM-TOM → charger la grille DOM-TOM + bandeau « Les tarifs DOM-TOM diffèrent de la métropole. » Les options (garantie du conducteur, assistance, extension de pays) ne sont **pas disponibles** en DOM-TOM : les afficher grisées avec « Non éligible pour ce pays », jamais masquées.

**Écris un script d'ingestion** qui parse `Classeur3.xlsx` et génère/peuple ces tables, plutôt que de recopier les valeurs à la main — le fichier est la source de vérité et pourra être remis à jour.

---

## 2. Arborescence du site (§2 du PDF)

```
/                                  Accueil (tarificateur)
/souscription                      Tunnel de souscription (multi-étapes)
/merci                              Page de remerciement post-paiement

Pages produit :
/assurance-temporaire-automobile
/assurance-temporaire-poids-lourd
/assurance-temporaire-camping-car
/assurance-temporaire-quadricycle
/assurance-temporaire-bus-autocar
/assurance-temporaire-tracteur-agricole
/assurance-temporaire-remorque
/assurance-frontiere
/pays-couverts

Contenu / confiance :
/qui-sommes-nous
/faq
/avis (optionnel, phase 2 : avis Google intégrés)
/contact
/blog + articles

Cas d'usage SEO (phase 2, même gabarit que les pages produit) :
/assurance-temporaire-plaque-ww
/assurance-temporaire-achat-vente-vehicule
/assurance-temporaire-import-export
/assurance-temporaire-sortie-fourriere
/assurance-temporaire-apres-resiliation
/assurance-temporaire-succession
/assurance-temporaire-controle-technique

Légal :
/mentions-legales
/cgv
/politique-de-confidentialite
/reclamation (nouvelle page, obligatoire)

Technique :
/sitemap.xml /robots.txt  404 personnalisée
```

Implémente header, footer et 404 en composants partagés — textes exacts au §2.1, §2.2, §2.3 du PDF (logo, menu, tel/WhatsApp cliquables, bouton flottant WhatsApp mobile, mentions légales en footer, copyright).

---

## 3. Page d'accueil (§3 du PDF, blocs 3.1 à 3.10)

Implémente dans l'ordre, textes exacts du PDF :
1. **Hero** (3.1) — title/meta SEO fournis, H1, sous-titre, CTA « Estimer votre assurance en 30 secondes » + « Souscrire par WhatsApp ».
2. **Tarificateur** (3.2) — 8 catégories avec mini-définitions, champ durée avec raccourcis dynamiques (voir tableau ci-dessus), prix affiché immédiatement (tarif minimum, pas de champ e-mail), CTA « Aller vers la souscription » + WhatsApp avec message pré-rempli.
3. **Bandeau de réassurance** (3.3) — 5 points fournis.
4. **Vignettes véhicules** (3.4) — 8 vignettes, prix `à partir de` généré dynamiquement depuis la grille.
5. **Bloc cas d'usage** (3.5) — grille de 10 cartes.
6. **Comment ça marche** (3.6) — 3 étapes.
7. **Bloc pays couverts** (3.7) — résumé + lien `/pays-couverts`.
8. **Avis clients** (3.8) — widget Google Business Profile (`https://maps.app.goo.gl/7fc1hB29zkNHGjbZ8`), NAP identique partout.
9. **FAQ courte** (3.9) — 5 questions, balisage `schema.org/FAQPage`.
10. **Bloc aide au paiement** (3.10) — réutilisé version courte dans le tunnel.

---

## 4. Tunnel de souscription `/souscription` (§4 du PDF)

Structure en une page scrollable : formulaire multi-étapes en haut, définition produit + garanties en bas (§4.9), prix recalculé en permanence dans un encart sticky.

- **Étape 1 — Localisation** (4.1, nouvelle, en premier) : pays d'immatriculation + pays/territoire de résidence (DOM-TOM listés individuellement). Bascule grille DOM-TOM + bandeau si applicable.
- **Étape 2 — Véhicule** (4.2) : catégorie pré-remplie, sous-type selon catégorie (poids camping-car, sous-type quadricycle, puissance fiscale auto), immatriculation/marque/modèle.
- **Étape 3 — Durée et date d'effet** (4.3) : mêmes raccourcis dynamiques, contrôle que la date d'effet n'est pas antérieure à maintenant.
- **Étape 4 — Conducteur** (4.4) : civilité, identité, permis. **Blocage immédiat front+back** si âge < 21 ans ou permis < 2 ans, avec les messages exacts du PDF.
- **Étape 5 — Options** (4.5) : uniquement les options présentes dans la grille pour la catégorie ; prix dépendant de la durée ; option incompatible → grisée avec message, jamais masquée.
- **Pop-up déclarations** (4.6) : bloquant avant paiement, 4 questions exactes du PDF, case à cocher unique obligatoire, horodatage et stockage de l'acceptation (preuve), + cases distinctes CGV / IPID / conditions générales du contrat.
- **Étape 6 — Paiement** (4.7) : récapitulatif avec liens « Modifier », cases obligatoires, bouton « Payer [MONTANT] € en toute sécurité », bloc aide au paiement juste sous le bouton (numéro/WhatsApp/e-mail cliquables), message d'échec de paiement exact.
- **Page `/merci`** (4.8) : texte exact, tracking de conversion GA4/Google Ads **uniquement sur cette page**.
- **Bas de page produit** (4.9) : définition, garanties, liste des 35 pays communs, mention de variation + lien `/pays-couverts`.

---

## 5. Gabarit des pages produit (§5 et §6.1–6.9 du PDF)

Un seul template pour les 8 pages produit + `/pays-couverts`, avec la structure du §5 (H1+intro, encart tarif, garanties, pays couverts, cas d'usage, éligibilité, FAQ, maillage interne). Reprends le texte intégral fourni pour chaque page (§6.1 à 6.9) **tel quel**, mot pour mot — ce sont des contenus rédigés définitifs, pas des exemples.

Garanties par catégorie (§5, à confirmer définitivement — voir point ouvert §10) :
- Automobile : RC obligatoire + défense pénale et recours ; options : garantie du conducteur, extension 7 pays, assistance.
- Toutes les autres catégories : RC + défense pénale et recours uniquement, aucune option.

---

## 6. Pages contenu (§6.10–6.12)

`/qui-sommes-nous`, `/faq` (balisage FAQPage), `/contact` (formulaire avec champs exacts + message de confirmation + carte Google Maps intégrée) — textes intégraux du PDF.

---

## 7. Pages légales (§7 du PDF)

Implémente `/mentions-legales`, `/cgv`, `/politique-de-confidentialite` avec le texte intégral fourni, et crée la nouvelle page `/reclamation` (obligatoire, n'existe pas encore). Note dans ton rapport final que **ces pages doivent être validées par un avocat avant mise en ligne** (mentionné explicitement dans le PDF) — ne pas les publier comme définitives sans cette validation.

Unifie les numéros de téléphone : un seul numéro principal partout, `+33 6 05 93 84 79`. Supprime toute occurrence du `+33 1 84 80 30 40` qui traînerait dans d'anciennes CGV.

---

## 8. SEO technique (§8 du PDF)

- Canonical = `https://www.tempassur.com` ; noindex + auth basique sur la préprod Hostinger.
- Plan de redirections 301 depuis les anciennes URLs WordPress (`/souscription/?step=…`, `/qui-sommes-nous/`, `/contactez-nous/`, `/nos-garanties/`, slugs de blog conservés — voir §9).
- Un seul H1/page, hiérarchie H2/H3 propre, titles ≤ 60 caractères, meta descriptions ≤ 155.
- Schema.org JSON-LD : `InsuranceAgency` (accueil), `FAQPage` (accueil, /faq, pages produit), `BreadcrumbList`, `Article` (blog), `Product`/`Service` avec `offers.priceSpecification` (pages produit).
- Core Web Vitals : images WebP/AVIF + lazy-loading, LCP < 2,5s, prix du tarificateur dans le HTML initial (SSR ou hydratation légère — pas de layout shift sur le hero).
- Maillage interne accueil → 8 pages produit → /pays-couverts → blog et retour.
- `sitemap.xml` + `robots.txt`, réutiliser le token `google-site-verification` existant.
- Tout le site en français — corriger tout reliquat anglais de la préprod (ex. « Get A Free Quote Now » → « Obtenir mon tarif »).
- Fiche Google Business Profile (`https://maps.app.goo.gl/7fc1hB29zkNHGjbZ8`) : lien footer, widget avis accueil, NAP identique partout.
- GTM + GA4 (conversion = page `/merci` uniquement), tracking des clics WhatsApp et `tel:` comme événements.
- Liens cliquables partout : `tel:+33605938479`, `mailto:contact@tempassur.com`, `https://wa.me/33605938479`.

---

## 9. Blog (§9 du PDF)

- Migre les 11 articles existants avec 301 sur les mêmes slugs (liste et actions exactes au §9.1), en particulier : **fusionner** les deux articles doublons sur la plaque WW, et **réécrire entièrement** l'article Maghreb/Turquie (il laisse croire à tort que l'Algérie est couverte — remplacer par le texte fourni au §9.2.1 qui précise explicitement que l'Algérie n'est jamais couverte).
- Intègre les 3 nouveaux articles rédigés en texte intégral (§9.2.1, 9.2.2, 9.2.3).
- Crée les gabarits/briefs pour les 5 articles à rédiger en phase 2 (§9.2.4) — pas de contenu à inventer, juste la structure (title, slug, brief).
- Chaque article : CTA fin d'article + 2-3 liens internes vers pages produit.

---

## 10. Points ouverts — à me remonter, ne pas deviner (§10 du PDF)

1. CG et IPID des contrats manquants → bloque le texte définitif des garanties auto et les liens documentaires du tunnel. Utilise un placeholder clairement marqué `[EN ATTENTE CG/IPID]` et signale-le dans ton rapport.
2. Validation avocat des pages légales non faite — les publier avec un avertissement interne, ne pas les considérer comme figées.
3. Vérifier qu'aucune occurrence de l'ancien numéro `+33 1 84 80 30 40` ne subsiste.

---

## Contraintes transverses

- Aucun prix codé en dur — tout vient de la grille Excel ingérée en base/JSON.
- Aucune option affichée pour une catégorie qui n'en a pas dans le fichier Excel (ex. poids lourd).
- Options non éligibles = grisées + message, **jamais masquées**.
- Formule de réassurance imposée : « Assureurs agréés — vos contrats sont portés par des entreprises d'assurance régies par le Code des assurances. » — ne jamais écrire « partenaires certifiés ACPR ».
- WhatsApp (`https://wa.me/33605938479`) et téléphone (`tel:+33605938479`) cliquables sur toutes les pages concernées.
- Textes des sections 3 à 9 du PDF : copier-coller exact, ne pas reformuler.

---

## Plan d'exécution suggéré

1. Explorer le repo existant (structure, stack, composants réutilisables) et le fichier Excel (feuilles/colonnes réelles) avant de coder quoi que ce soit.
2. Construire le modèle de données + script d'ingestion de la grille tarifaire (§1/§11) — c'est la fondation de tout le reste.
3. Header/footer/404 partagés (§2.1–2.3).
4. Page d'accueil complète (§3), avec tarificateur fonctionnel branché sur la grille.
5. Tunnel de souscription (§4), y compris pop-up déclarations et contrôles d'éligibilité.
6. Gabarit + 8 pages produit + `/pays-couverts` (§5–6).
7. Pages contenu (qui-sommes-nous, FAQ, contact).
8. Pages légales + `/reclamation`.
9. SEO technique (redirections, schema.org, sitemap, tracking).
10. Blog (migration + nouveaux articles).
11. **Vérification finale** : parcourir chaque page générée contre le texte du PDF section par section (diff manuel), tester le tarificateur avec plusieurs combinaisons catégorie/durée/pays contre la grille Excel, tester les blocages d'éligibilité (âge/permis), tester le pop-up de déclarations, vérifier tous les liens `tel:`/`mailto:`/`wa.me`, et lister dans un rapport final tout ce qui reste en attente (CG/IPID, validation avocat, contenu phase 2).

Signale-moi toute ambiguïté ou information manquante au lieu de la deviner — en particulier le contenu exact des garanties/options si les CG/IPID ne sont toujours pas fournis.
