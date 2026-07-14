"use client"

import type { ComponentProps, ReactNode } from "react"
import { MessageCircle } from "lucide-react"

import { trackEvent } from "@/lib/analytics"
import { cn } from "@/lib/utils"
import { whatsappUrl } from "@/lib/site"

interface WhatsappButtonProps extends Omit<ComponentProps<"a">, "href" | "children"> {
  message?: string
  children?: ReactNode
}

export function WhatsappButton({
  message,
  className,
  children = "Souscrire par WhatsApp",
  onClick,
  ...props
}: WhatsappButtonProps) {
  return (
    <a
      href={whatsappUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event) => {
        trackEvent("whatsapp_click")
        onClick?.(event)
      }}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-2 text-sm font-semibold whitespace-nowrap text-white transition-colors hover:bg-[#1ebe57]",
        className
      )}
      {...props}
    >
      <MessageCircle className="size-4 shrink-0" strokeWidth={2} />
      {children}
    </a>
  )
}
