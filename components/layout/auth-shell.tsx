import Link from "next/link"
import { ShieldCheck } from "lucide-react"

import { Logo } from "@/components/shared/logo"

interface AuthShellProps {
  title: string
  description: string
  footerText: string
  footerLinkLabel: string
  footerLinkHref: string
  children: React.ReactNode
}

export function AuthShell({
  title,
  description,
  footerText,
  footerLinkLabel,
  footerLinkHref,
  children,
}: AuthShellProps) {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-surface pt-28 pb-16">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-[0.04]" />
      <div className="pointer-events-none absolute -top-32 right-0 size-[28rem] rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto grid w-full max-w-5xl grid-cols-1 items-center gap-12 container-px lg:grid-cols-2">
        <div className="hidden flex-col gap-6 lg:flex">
          <Logo />
          <h1 className="text-balance text-4xl font-bold tracking-tight text-navy">{title}</h1>
          <p className="max-w-sm text-balance text-lg leading-relaxed text-muted-foreground">
            {description}
          </p>
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-white p-4">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="size-5" />
            </span>
            <p className="text-sm text-muted-foreground">
              Your data is encrypted end-to-end and never shared without consent.
            </p>
          </div>
        </div>

        <div className="mx-auto w-full max-w-md rounded-3xl border border-border bg-white p-8 shadow-xl shadow-slate-900/5 sm:p-10">
          <div className="mb-8 flex flex-col gap-2 lg:hidden">
            <Logo />
          </div>
          <div className="mb-8 flex flex-col gap-1.5 lg:hidden">
            <h1 className="text-2xl font-bold text-navy">{title}</h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>

          {children}

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {footerText}{" "}
            <Link href={footerLinkHref} className="font-semibold text-primary hover:underline">
              {footerLinkLabel}
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
