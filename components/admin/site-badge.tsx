import { cn } from "@/lib/utils"
import { SITE_BADGE_CLASSES, siteLabel } from "@/lib/admin/sites"

/** Pastille du site web d'origine (TempAssur, AssurTempo…). */
export function SiteBadge({ site, className }: { site: string | null | undefined; className?: string }) {
  if (!site) return <span className={cn("text-muted-foreground", className)}>—</span>
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        SITE_BADGE_CLASSES[site] ?? "bg-muted text-foreground",
        className
      )}
    >
      {siteLabel(site)}
    </span>
  )
}
