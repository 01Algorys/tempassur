const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

// Même format que les contrats souscrits sur le site (lib/contract-fulfillment.ts :
// WN-<année>-<8 derniers caractères du paiement Stripe>) au lieu du compteur CT-<année>-0001
// du CRM. 8 caractères aléatoires : un doublon est très improbable, et le CRM refuse de
// toute façon un numéro déjà utilisé.
export function generateContratNumero(): string {
  const bytes = new Uint8Array(8)
  crypto.getRandomValues(bytes)
  const suffix = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("")
  return `WN-${new Date().getFullYear()}-${suffix}`
}
