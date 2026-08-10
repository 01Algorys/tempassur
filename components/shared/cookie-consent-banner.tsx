"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"

import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import {
  getStoredCookieConsent,
  loadGtm,
  onReopenCookieBanner,
  setStoredCookieConsent,
} from "@/lib/cookie-consent"

interface CookieConsentBannerProps {
  gtmId?: string
}

export function CookieConsentBanner({ gtmId }: CookieConsentBannerProps) {
  const t = useTranslations("cookieConsent")
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const stored = getStoredCookieConsent()
    if (stored === "granted" && gtmId) {
      loadGtm(gtmId)
    }
    setVisible(stored === null)

    return onReopenCookieBanner(() => setVisible(true))
  }, [gtmId])

  function handleDecision(value: "granted" | "denied") {
    setStoredCookieConsent(value)
    if (value === "granted" && gtmId) {
      loadGtm(gtmId)
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-border bg-white p-4 shadow-[0_-8px_24px_-6px_rgba(0,0,0,0.15)] sm:p-5">
      <div className="mx-auto flex max-w-5xl flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {t("description")}{" "}
          <Link href="/politique-de-confidentialite#cookies" className="font-semibold text-primary hover:underline">
            {t("learnMore")}
          </Link>
        </p>
        <div className="flex w-full shrink-0 gap-2 sm:w-auto">
          <Button type="button" variant="outline" className="flex-1 sm:flex-none" onClick={() => handleDecision("denied")}>
            {t("reject")}
          </Button>
          <Button type="button" variant="cta" className="flex-1 sm:flex-none" onClick={() => handleDecision("granted")}>
            {t("accept")}
          </Button>
        </div>
      </div>
    </div>
  )
}
