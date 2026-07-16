"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { WhatsappButton } from "@/components/shared/whatsapp-button"

interface DeclarationsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isSubmitting?: boolean
}

export function DeclarationsDialog({ open, onOpenChange, onConfirm, isSubmitting }: DeclarationsDialogProps) {
  const t = useTranslations("wizard.declarations")
  const [checked, setChecked] = useState(false)
  const questions = t.raw("questions") as string[]

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next)
        if (!next) setChecked(false)
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <ol className="flex flex-col gap-3 text-sm leading-relaxed text-foreground/80">
          {questions.map((question, index) => (
            <li key={question} className="flex gap-2">
              <span className="font-semibold text-navy">{index + 1}.</span>
              {question}
            </li>
          ))}
        </ol>

        <label className="flex items-start gap-3 rounded-xl border border-border p-3 text-sm">
          <Checkbox checked={checked} onCheckedChange={(v) => setChecked(v === true)} className="mt-0.5" />
          <span>{t("certify")}</span>
        </label>

        <p className="text-xs text-muted-foreground">
          {t("contactPrompt")}{" "}
          <WhatsappButton
            message={t("contactMessage")}
            className="inline-flex h-auto bg-transparent px-0 py-0 font-semibold text-primary hover:bg-transparent hover:underline"
          >
            {t("contactCta")}
          </WhatsappButton>
          {t("contactSuffix")}
        </p>

        <DialogFooter>
          <Button type="button" variant="outline" className="rounded-full" onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
          <Button
            type="button"
            variant="cta"
            className="rounded-full"
            disabled={!checked || isSubmitting}
            onClick={onConfirm}
          >
            {isSubmitting ? t("sending") : t("confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
