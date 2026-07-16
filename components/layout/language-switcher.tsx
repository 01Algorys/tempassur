"use client"

import { useTransition } from "react"
import { useSearchParams } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { Globe } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePathname, useRouter } from "@/i18n/navigation"
import { LOCALES, LOCALE_LABELS, LOCALE_SHORT_LABELS, type Locale } from "@/i18n/routing"
import { cn } from "@/lib/utils"

export function LanguageSwitcher({ light = false }: { light?: boolean }) {
  const t = useTranslations("languageSwitcher")
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  function handleSelect(nextLocale: Locale) {
    if (nextLocale === locale) return
    const query = searchParams.toString()
    startTransition(() => {
      router.replace(
        { pathname, query: query ? Object.fromEntries(searchParams.entries()) : undefined },
        { locale: nextLocale }
      )
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(light ? "text-white hover:bg-white/10 hover:text-white" : "", isPending && "opacity-60")}
          aria-label={t("selectLanguage")}
        >
          <Globe data-icon="inline-start" />
          {LOCALE_SHORT_LABELS[locale]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LOCALES.map((code) => (
          <DropdownMenuItem key={code} onSelect={() => handleSelect(code)}>
            {LOCALE_LABELS[code]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
