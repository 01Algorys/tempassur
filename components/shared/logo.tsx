import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"

import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  light?: boolean
}

export function Logo({ className, light = false }: LogoProps) {
  const t = useTranslations("common")

  return (
    <Link href="/" className={cn("group flex items-center gap-2.5", className)} aria-label={t("logoAria")}>
      <span className="relative flex size-9 shrink-0 items-center justify-center">
        <span className="absolute h-[3px] w-7 -rotate-45 rounded-full bg-primary" />
        <span className="absolute h-[3px] w-7 rotate-45 rounded-full bg-orange" />
      </span>
      <span
        className={cn(
          "text-lg leading-none font-extrabold tracking-tight",
          light ? "text-white" : "text-navy"
        )}
      >
        Temp<span className="text-orange">Assur</span>
      </span>
    </Link>
  )
}
