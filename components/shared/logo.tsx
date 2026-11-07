import Image from "next/image"
import { useTranslations } from "next-intl"

import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  light?: boolean
}

export function Logo({ className, light = false }: LogoProps) {
  const t = useTranslations("common")

  return (
    <Link href="/" className={cn("flex items-center", className)} aria-label={t("logoAria")}>
      <Image
        src={light ? "/tempassur-logo-white.png" : "/tempassur-logo.png"}
        alt={t("logoAria")}
        width={1160}
        height={312}
        priority
        className="h-11 w-auto xl:h-9 2xl:h-11"
      />
    </Link>
  )
}
