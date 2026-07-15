"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Menu, Phone } from "lucide-react"

import { Logo } from "@/components/shared/logo"
import { TelLink } from "@/components/shared/tel-link"
import { WhatsappButton } from "@/components/shared/whatsapp-button"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useScrolled } from "@/hooks/use-scrolled"
import { NAV_LINKS } from "@/lib/constants"
import { siteConfig } from "@/lib/site"
import { cn } from "@/lib/utils"

import { LanguageSwitcher } from "./language-switcher"

const navItemClass =
  "rounded-full px-4 py-2 text-xs font-semibold tracking-wide text-foreground/70 uppercase transition-colors hover:bg-secondary hover:text-navy"

export function Header() {
  const scrolled = useScrolled(32)
  const [open, setOpen] = useState(false)

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b bg-white transition-shadow duration-300",
        scrolled ? "border-border shadow-[0_1px_0_rgba(15,23,42,0.04)]" : "border-transparent"
      )}
    >
      <div className="mx-auto flex h-18 w-full max-w-[120rem] items-center justify-between container-px py-3">
        <Logo />

        <NavigationMenu viewport={false} className="hidden max-w-none flex-1 justify-center lg:flex" aria-label="Primary">
          <NavigationMenuList>
            {NAV_LINKS.map((link) =>
              link.children ? (
                <NavigationMenuItem key={link.label}>
                  <NavigationMenuTrigger className={cn(navItemClass, "bg-transparent")}>
                    {link.label}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-64 gap-0.5 p-2">
                      {link.children.map((child) => (
                        <li key={child.href}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={child.href}
                              className="rounded-lg px-3 py-2.5 text-xs font-semibold tracking-wide text-foreground/80 uppercase hover:bg-secondary hover:text-navy"
                            >
                              {child.label}
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ) : (
                <NavigationMenuItem key={link.href}>
                  <NavigationMenuLink asChild className={navItemClass}>
                    <Link href={link.href}>{link.label}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )
            )}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="hidden items-center gap-2 lg:flex">
          <TelLink
            phone={siteConfig.phone}
            className="rounded-full px-3 py-2 text-xs font-semibold tracking-wide text-foreground/70 uppercase transition-colors hover:bg-secondary hover:text-navy"
          >
            <Phone className="mr-1.5 inline size-3.5" strokeWidth={2.2} />
            {siteConfig.phone}
          </TelLink>
          <WhatsappButton className="h-9 rounded-full px-4 text-xs">Souscrire par WhatsApp</WhatsappButton>
          <Button asChild size="sm" className="h-9 rounded-full px-4 text-xs">
            <Link href="/souscription">Souscrire en ligne</Link>
          </Button>
          <LanguageSwitcher />
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitcher />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[360px]">
              <SheetHeader>
                <SheetTitle>
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-4 flex flex-col gap-1 px-4" aria-label="Mobile">
                {NAV_LINKS.map((link) =>
                  link.children ? (
                    <Accordion key={link.label} type="single" collapsible>
                      <AccordionItem value={link.label} className="border-none">
                        <AccordionTrigger className="rounded-lg px-3 py-3 text-base font-medium text-foreground hover:bg-secondary hover:no-underline">
                          {link.label}
                        </AccordionTrigger>
                        <AccordionContent className="pb-1 pl-3">
                          <div className="flex flex-col gap-0.5">
                            {link.children.map((child) => (
                              <SheetClose asChild key={child.href}>
                                <Link
                                  href={child.href}
                                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 hover:bg-secondary"
                                >
                                  {child.label}
                                </Link>
                              </SheetClose>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ) : (
                    <SheetClose asChild key={link.href}>
                      <Link
                        href={link.href}
                        className="rounded-lg px-3 py-3 text-base font-medium text-foreground hover:bg-secondary"
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  )
                )}
              </nav>
              <div className="mt-4 flex flex-col gap-2 border-t border-border px-4 pt-4">
                <TelLink
                  phone={siteConfig.phone}
                  className="flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-foreground"
                >
                  <Phone className="size-4" strokeWidth={2.2} />
                  {siteConfig.phone}
                </TelLink>
                <WhatsappButton className="justify-center py-2.5" />
                <Button asChild className="rounded-lg">
                  <Link href="/souscription">Souscrire en ligne</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  )
}
