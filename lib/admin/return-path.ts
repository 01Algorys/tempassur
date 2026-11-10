// Page de retour après un formulaire plein écran (?retour=/admin-panel/...).
// Seuls les chemins internes de l'admin sont acceptés : pas de redirection ouverte.
export function safeReturnPath(value: string | string[] | null | undefined, fallback: string): string {
  const path = Array.isArray(value) ? value[0] : value
  if (!path || !path.startsWith("/admin-panel/") || path.startsWith("//") || path.includes("\\")) return fallback
  return path
}

/** Variante sans repli : undefined si le paramètre est absent ou refusé. */
export function returnParam(value: string | string[] | null | undefined): string | undefined {
  return safeReturnPath(value, "") || undefined
}

/** Ajoute ?retour=<chemin> à un lien de formulaire. */
export function withReturn(href: string, retour: string): string {
  return `${href}${href.includes("?") ? "&" : "?"}retour=${encodeURIComponent(retour)}`
}
