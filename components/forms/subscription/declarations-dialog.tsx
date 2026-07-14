"use client"

import { useState } from "react"

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

const QUESTIONS = [
  "A-t-il déclaré, au cours des 36 derniers mois, plus de 2 sinistres matériels responsables ou partiellement responsables ET/OU 1 sinistre corporel responsable ou non responsable ?",
  "A-t-il été résilié pour sinistre par un précédent assureur au cours des 5 dernières années ?",
  "A-t-il fait l'objet d'une condamnation pénale pour infraction au code de la route, alcoolémie ou usage de stupéfiants ?",
  "Fait-il partie des malussés à la recherche d'un nouvel assureur, ou est-il en attente d'une décision du Bureau Central de Tarification (BCT) ?",
]

interface DeclarationsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isSubmitting?: boolean
}

export function DeclarationsDialog({ open, onOpenChange, onConfirm, isSubmitting }: DeclarationsDialogProps) {
  const [checked, setChecked] = useState(false)

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
          <DialogTitle>Déclarations du conducteur</DialogTitle>
          <DialogDescription>
            Pour valider votre souscription, vous devez pouvoir répondre NON aux quatre questions
            suivantes concernant le conducteur :
          </DialogDescription>
        </DialogHeader>

        <ol className="flex flex-col gap-3 text-sm leading-relaxed text-foreground/80">
          {QUESTIONS.map((question, index) => (
            <li key={question} className="flex gap-2">
              <span className="font-semibold text-navy">{index + 1}.</span>
              {question}
            </li>
          ))}
        </ol>

        <label className="flex items-start gap-3 rounded-xl border border-border p-3 text-sm">
          <Checkbox checked={checked} onCheckedChange={(v) => setChecked(v === true)} className="mt-0.5" />
          <span>
            Je certifie répondre NON à l&apos;ensemble de ces questions. Je comprends qu&apos;une fausse
            déclaration peut entraîner la nullité du contrat (art. L.113-8 du Code des assurances).
          </span>
        </label>

        <p className="text-xs text-muted-foreground">
          Vous êtes concerné par l&apos;une de ces situations ?{" "}
          <WhatsappButton
            message="Bonjour, je souhaite échanger au sujet de ma situation avant de souscrire une assurance temporaire."
            className="inline-flex h-auto bg-transparent px-0 py-0 font-semibold text-primary hover:bg-transparent hover:underline"
          >
            Contactez-nous
          </WhatsappButton>
          , une solution personnalisée est peut-être possible.
        </p>

        <DialogFooter>
          <Button type="button" variant="outline" className="rounded-full" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button
            type="button"
            variant="cta"
            className="rounded-full"
            disabled={!checked || isSubmitting}
            onClick={onConfirm}
          >
            {isSubmitting ? "Envoi..." : "Je certifie et je continue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
