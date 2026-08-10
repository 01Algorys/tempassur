export type CookieConsentValue = "granted" | "denied"

export const COOKIE_CONSENT_STORAGE_KEY = "tempassur-cookie-consent"

export function getStoredCookieConsent(): CookieConsentValue | null {
  if (typeof window === "undefined") return null
  const value = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY)
  return value === "granted" || value === "denied" ? value : null
}

export function setStoredCookieConsent(value: CookieConsentValue) {
  window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, value)
}

// Injects the GTM snippet on demand, once consent has been granted — GTM must
// never fire before the visitor has actively opted in (RGPD/CNIL requirement).
export function loadGtm(containerId: string) {
  if (document.getElementById("gtm-script")) return

  const dataLayerScript = document.createElement("script")
  dataLayerScript.id = "gtm-script"
  dataLayerScript.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${containerId}');`
  document.head.appendChild(dataLayerScript)

  const noscript = document.createElement("noscript")
  const iframe = document.createElement("iframe")
  iframe.src = `https://www.googletagmanager.com/ns.html?id=${containerId}`
  iframe.height = "0"
  iframe.width = "0"
  iframe.style.display = "none"
  iframe.style.visibility = "hidden"
  noscript.appendChild(iframe)
  document.body.prepend(noscript)
}

// Same-tab pub/sub so the footer's "manage cookies" link can reopen the banner
// after a decision has already been made and the banner has unmounted itself.
const REOPEN_EVENT = "tempassur:cookie-consent:reopen"

export function requestReopenCookieBanner() {
  window.dispatchEvent(new Event(REOPEN_EVENT))
}

export function onReopenCookieBanner(handler: () => void) {
  window.addEventListener(REOPEN_EVENT, handler)
  return () => window.removeEventListener(REOPEN_EVENT, handler)
}
