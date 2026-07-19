import type { LucideIcon } from "lucide-react"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function KpiCard({
  label,
  value,
  icon: Icon,
  trend,
  tone = "default",
}: {
  label: string
  value: string
  icon: LucideIcon
  trend?: { value: number; label?: string }
  tone?: "default" | "positive" | "warning" | "negative"
}) {
  const toneClasses: Record<string, string> = {
    default: "bg-primary/10 text-primary",
    positive: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    negative: "bg-red-500/10 text-red-600 dark:text-red-400",
  }

  return (
    <Card className="p-0">
      <CardContent className="flex items-start justify-between gap-3 p-4">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-muted-foreground">{label}</p>
          <p className="mt-1.5 font-heading text-2xl font-semibold tracking-tight text-foreground">{value}</p>
          {trend ? (
            <p
              className={cn(
                "mt-1 flex items-center gap-1 text-xs font-medium",
                trend.value >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
              )}
            >
              {trend.value >= 0 ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
              {Math.abs(trend.value)}% {trend.label ?? ""}
            </p>
          ) : null}
        </div>
        <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", toneClasses[tone])}>
          <Icon className="size-4.5" />
        </div>
      </CardContent>
    </Card>
  )
}
