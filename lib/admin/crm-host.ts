// Le CRM (ancien « admin-panel ») est celui de WN Conseil, pas l'administration du site TempAssur :
// il est servi sur le domaine de la société. La même application répond sur deux adresses :
//   - gestion.wnconseil.com  → le CRM seulement (jamais indexé) ;
//   - www.tempassur.com      → le site public ; /admin-panel y redirige vers le CRM.
export const CRM_HOST = (process.env.CRM_HOST ?? "gestion.wnconseil.com").toLowerCase()

// Adresse publique du site TempAssur, pour renvoyer vers lui les pages publiques demandées sur l'adresse du CRM.
export const PUBLIC_SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.tempassur.com"

// Hôtes du site public sur lesquels /admin-panel doit rediriger vers le CRM.
const PUBLIC_HOSTS = new Set(["www.tempassur.com", "tempassur.com"])

// La redirection de l'ancienne adresse n'est activée qu'une fois la nouvelle en service
// (variable CRM_REDIRECT_ENABLED=1 sur Vercel) : le CRM n'est jamais injoignable pendant la bascule.
const REDIRECT_ENABLED = process.env.CRM_REDIRECT_ENABLED === "1"

const hostOf = (host: string | null | undefined) => (host ?? "").toLowerCase().split(":")[0]

export const isCrmHost = (host: string | null | undefined) => hostOf(host) === CRM_HOST

export const shouldRedirectAdminToCrm = (host: string | null | undefined) => REDIRECT_ENABLED && PUBLIC_HOSTS.has(hostOf(host))

export const NOINDEX = "noindex, nofollow, noarchive"
