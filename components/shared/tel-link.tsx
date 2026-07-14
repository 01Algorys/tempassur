"use client"

import type { ComponentProps } from "react"

import { trackEvent } from "@/lib/analytics"

interface TelLinkProps extends Omit<ComponentProps<"a">, "href"> {
  phone: string
}

export function TelLink({ phone, onClick, ...props }: TelLinkProps) {
  return (
    <a
      href={`tel:${phone.replace(/\s/g, "")}`}
      onClick={(event) => {
        trackEvent("tel_click", { phone })
        onClick?.(event)
      }}
      {...props}
    />
  )
}
