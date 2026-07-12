import type { Metadata } from "next"

import { Container } from "@/components/shared/container"
import { PageHero } from "@/components/layout/page-hero"
import { siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: "Mentions légales",
  description: `Mentions légales de ${siteConfig.name}, édité par ${siteConfig.legalName}, courtier d'assurance immatriculé ORIAS n°${siteConfig.orias}.`,
}

export default function MentionsLegalesPage() {
  return (
    <>
      <PageHero eyebrow="Informations légales" title="Mentions légales" />
      <section className="section-y">
        <Container className="mx-auto flex max-w-3xl flex-col gap-10">
          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-navy">Éditeur du site</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Le site {siteConfig.url} est édité par {siteConfig.legalName}, société à
              responsabilité limitée unipersonnelle (EURL) au capital de 1 000 €, immatriculée au
              Registre du Commerce et des Sociétés de Nanterre sous le numéro 929 812 642, SIRET
              929 812 642 00015, numéro de TVA intracommunautaire FR14929812642.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Siège social : {siteConfig.address}.
              <br />
              Représentant légal : Walid NEFZI.
              <br />
              Téléphone : {siteConfig.phone}. Email :{" "}
              <a href={`mailto:${siteConfig.email}`} className="underline hover:text-primary">
                {siteConfig.email}
              </a>
              .
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-navy">Statut réglementaire</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {siteConfig.legalName} exerce une activité de courtage en assurances et est
              immatriculée auprès de l&apos;ORIAS (Organisme pour le Registre unique des
              Intermédiaires en Assurance, Banque et Finance) sous le numéro {siteConfig.orias}
              , consultable sur{" "}
              <a
                href="https://www.orias.fr"
                target="_blank"
                rel="noreferrer noopener"
                className="underline hover:text-primary"
              >
                www.orias.fr
              </a>
              . Cette activité est placée sous le contrôle de l&apos;Autorité de Contrôle
              Prudentiel et de Résolution (ACPR), 4 Place de Budapest, CS 92459, 75436 Paris Cedex
              09.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-navy">Réclamations et médiation</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Toute réclamation peut être adressée à notre service réclamation via{" "}
              <a href={`mailto:${siteConfig.email}`} className="underline hover:text-primary">
                {siteConfig.email}
              </a>
              . À défaut de réponse satisfaisante, le client peut saisir l&apos;Instance
              d&apos;Expertise et d&apos;Arbitrage Mutuelle (IEAM), 31 bis-33 rue Daru, 75008
              Paris — +33 1 42 27 28 83.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-navy">Hébergement</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Ce site est hébergé par Hostinger International Ltd, 61 Lordou Vironos Street, 6023
              Larnaca, Chypre —{" "}
              <a
                href="https://www.hostinger.fr/contact"
                target="_blank"
                rel="noreferrer noopener"
                className="underline hover:text-primary"
              >
                www.hostinger.fr/contact
              </a>
              .
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-navy">Propriété intellectuelle</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              L&apos;ensemble des contenus présents sur ce site (textes, images, logos, mise en
              page) est protégé par le droit de la propriété intellectuelle. Toute reproduction ou
              représentation, totale ou partielle, sans autorisation préalable est interdite.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-navy">Données personnelles</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Le traitement des données personnelles collectées sur ce site est conforme à la loi
              Informatique et Libertés du 6 janvier 1978 modifiée et au Règlement Général sur la
              Protection des Données (RGPD). Conformément à cette réglementation, vous disposez
              d&apos;un droit d&apos;accès, de rectification et de suppression de vos données,
              que vous pouvez exercer en écrivant à{" "}
              <a href={`mailto:${siteConfig.email}`} className="underline hover:text-primary">
                {siteConfig.email}
              </a>
              . Pour plus de détails, consultez notre{" "}
              <a href="/politique-de-confidentialite" className="underline hover:text-primary">
                politique de confidentialité et de cookies
              </a>
              .
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-navy">Limitation de responsabilité</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {siteConfig.legalName} décline toute responsabilité en cas de dommage résultant
              d&apos;une utilisation du site non conforme à sa destination ou d&apos;informations
              erronées transmises par l&apos;utilisateur.
            </p>
          </div>
        </Container>
      </section>
    </>
  )
}
