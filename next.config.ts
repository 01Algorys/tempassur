import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

// Redirections 301 (dossier §8) : anciennes URLs WordPress + ancien schéma de routing
// dynamique /assurance/[slug] de cette même refonte, vers les nouvelles pages produit.
const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Ancien schéma /assurance/[slug] (préproduction) -> nouvelles URLs dédiées.
      { source: "/assurance/automobiles", destination: "/assurance-temporaire-automobile", permanent: true },
      { source: "/assurance/poids-lourds", destination: "/assurance-temporaire-poids-lourd", permanent: true },
      { source: "/assurance/camping-cars", destination: "/assurance-temporaire-camping-car", permanent: true },
      { source: "/assurance/quadricycles", destination: "/assurance-temporaire-quadricycle", permanent: true },
      { source: "/assurance/bus-autocars", destination: "/assurance-temporaire-bus-autocar", permanent: true },
      {
        source: "/assurance/tracteurs-agricoles",
        destination: "/assurance-temporaire-tracteur-agricole",
        permanent: true,
      },
      { source: "/assurance/remorques", destination: "/assurance-temporaire-remorque", permanent: true },
      { source: "/assurance/assurance-frontiere", destination: "/assurance-frontiere", permanent: true },

      // Ancienne page CGV de cette refonte -> nouvelle URL courte /cgv.
      { source: "/conditions-generales-de-vente", destination: "/cgv", permanent: true },

      // Fusion des 2 articles doublons sur la plaque WW (dossier §9.1).
      {
        source: "/assurance-temporaire-certificat-provisoire-ww",
        destination: "/blog/souscrire-assurance-temporaire-plaque-ww",
        permanent: true,
      },

      // Anciennes URLs WordPress (tempassur.com), dossier §8.
      { source: "/souscription/", destination: "/souscription", permanent: true },
      { source: "/qui-sommes-nous/", destination: "/qui-sommes-nous", permanent: true },
      { source: "/contactez-nous/", destination: "/contact", permanent: true },
      { source: "/nos-garanties/", destination: "/assurance-temporaire-automobile", permanent: true },
    ]
  },
};

export default withNextIntl(nextConfig);
