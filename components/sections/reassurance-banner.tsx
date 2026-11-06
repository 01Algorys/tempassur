import { BadgeCheck, CreditCard, MailCheck, Phone, ShieldCheck } from "lucide-react"
import { useTranslations } from "next-intl"

import { Reveal } from "@/components/shared/reveal"
import { TelLink } from "@/components/shared/tel-link"
import { siteConfig } from "@/lib/site"

const ICONS = [MailCheck, CreditCard, BadgeCheck, ShieldCheck, Phone]

export function ReassuranceBanner() {
  const t = useTranslations("home.reassurance")
  const items = t.raw("items") as string[]

  return (
    <section className="border-b border-border bg-white py-5">
      <div className="mx-auto max-w-7xl container-px">
        <Reveal>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {items.map((item, index) => {
              const Icon = ICONS[index]
              const isPhoneItem = index === items.length - 1
              return (
                <div key={item} className="flex items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-navy">
                    <Icon className="size-4" strokeWidth={1.8} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground/80">{item}</p>
                    {isPhoneItem ? (
                      <TelLink
                        phone={siteConfig.phone}
                        dir="ltr"
                        className="inline-block whitespace-nowrap text-sm font-semibold text-navy hover:underline"
                      >
                        {siteConfig.phone}
                      </TelLink>
                    ) : null}
                  </div>
                </div>
              )
            })}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
