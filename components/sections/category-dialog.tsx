"use client"

import { useTranslations } from "next-intl"

import { useRouter } from "@/i18n/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { VEHICLE_TYPES } from "@/lib/constants"

interface CategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CategoryDialog({ open, onOpenChange }: CategoryDialogProps) {
  const t = useTranslations("home.hero")
  const tVehicles = useTranslations("vehicleTypes")
  const router = useRouter()

  function handleSelect(slug: string) {
    onOpenChange(false)
    router.push(`/souscription?categorie=${slug}`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("categoryDialogTitle")}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {VEHICLE_TYPES.map((v) => {
            const Icon = v.icon
            return (
              <button
                key={v.slug}
                type="button"
                onClick={() => handleSelect(v.slug)}
                className="flex items-center gap-3 rounded-xl border border-border p-3 text-left transition-colors hover:border-primary/40 hover:bg-surface"
              >
                <Icon className="size-5 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-navy">{tVehicles(`${v.slug}.label`)}</p>
                  <p className="text-xs text-muted-foreground">{tVehicles(`${v.slug}.description`)}</p>
                </div>
              </button>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
