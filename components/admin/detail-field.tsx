import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export function DetailField({
  label,
  value,
  full,
  icon: Icon,
}: {
  label: string
  value: ReactNode
  full?: boolean
  icon?: LucideIcon
}) {
  return (
    <div className={full ? "col-span-2" : undefined}>
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {Icon ? <Icon className="size-3.5" /> : null}
        {label}
      </p>
      <p className="mt-0.5 whitespace-pre-line text-foreground">{value}</p>
    </div>
  )
}

export function DetailSectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className={cn("col-span-2 mt-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase first:mt-0")}>
      {children}
    </p>
  )
}
