"use client"

import { useRef } from "react"
import { Paperclip, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface FileUploadFieldProps {
  id: string
  label: string
  value?: File
  onChange: (file: File | undefined) => void
  accept?: string
}

export function FileUploadField({ id, label, value, onChange, accept = "image/*,.pdf" }: FileUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-center gap-2 rounded-lg border border-input px-2.5 py-1.5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-lg"
          onClick={() => inputRef.current?.click()}
        >
          <Paperclip data-icon="inline-start" className="size-3.5" />
          Choisir un fichier
        </Button>
        <span className="flex-1 truncate text-sm text-muted-foreground">
          {value ? value.name : "Aucun fichier sélectionné"}
        </span>
        {value ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Retirer le fichier ${label}`}
            onClick={() => {
              onChange(undefined)
              if (inputRef.current) inputRef.current.value = ""
            }}
          >
            <X className="size-4" />
          </Button>
        ) : null}
      </div>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(event) => onChange(event.target.files?.[0])}
      />
    </div>
  )
}
