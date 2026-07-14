"use client"

import { Mail, MessageCircle, Phone } from "lucide-react"

import { TelLink } from "@/components/shared/tel-link"
import { siteConfig, whatsappUrl } from "@/lib/site"
import { trackEvent } from "@/lib/analytics"

interface PaymentHelpProps {
  /** "home" = bloc §3.10 complet (accueil) ; "tunnel" = version courte sous le bouton Payer (§4.7). */
  variant?: "home" | "tunnel"
  className?: string
}

export function PaymentHelp({ variant = "home", className }: PaymentHelpProps) {
  return (
    <div className={className}>
      <p className="text-sm font-bold text-navy">Besoin d&apos;aide pour finaliser votre paiement ?</p>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
        {variant === "tunnel"
          ? "Vous rencontrez une difficulté pour finaliser votre souscription ou votre paiement ? Nous sommes là 7j/7 : appelez-nous ou écrivez-nous sur WhatsApp, ou par e-mail. Nous vous accompagnons étape par étape et pouvons vous proposer une solution personnalisée."
          : "Nous sommes disponibles 7j/7 : appelez-nous ou écrivez-nous sur WhatsApp, ou par e-mail. Nous vous accompagnons étape par étape et pouvons vous proposer une solution personnalisée."}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold">
        <TelLink phone={siteConfig.phone} className="flex items-center gap-1.5 text-primary hover:underline">
          <Phone className="size-4" strokeWidth={2} />
          {siteConfig.phone}
        </TelLink>
        <a
          href={whatsappUrl()}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("whatsapp_click")}
          className="flex items-center gap-1.5 text-primary hover:underline"
        >
          <MessageCircle className="size-4" strokeWidth={2} />
          WhatsApp
        </a>
        <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-1.5 text-primary hover:underline">
          <Mail className="size-4" strokeWidth={2} />
          {siteConfig.email}
        </a>
      </div>
    </div>
  )
}
