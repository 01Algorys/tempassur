import { MessageCircle } from "lucide-react"
import { useTranslations } from "next-intl"

import { whatsappUrl } from "@/lib/site"

// Bouton WhatsApp flottant mobile, visible sur toutes les pages (dossier §2.1).
export function FloatingWhatsappButton() {
  const t = useTranslations("common")

  return (
    <a
      href={whatsappUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("whatsappFloatingAria")}
      className="fixed right-5 bottom-5 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_-6px_rgba(0,0,0,0.35)] transition-transform hover:scale-105 lg:hidden"
    >
      <MessageCircle className="size-7" strokeWidth={2} />
    </a>
  )
}
