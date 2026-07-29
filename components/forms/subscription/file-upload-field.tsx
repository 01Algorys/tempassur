"use client"

import { useRef, useState } from "react"
import { Paperclip, X } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { MAX_FILE_SIZE_BYTES } from "@/lib/validations/subscription-schema"

interface FileUploadFieldProps {
  id: string
  label: string
  value?: File
  onChange: (file: File | undefined) => void
  accept?: string
}

export function FileUploadField({ id, label, value, onChange, accept = "image/*,.pdf" }: FileUploadFieldProps) {
  const t = useTranslations("wizard.documents")
  const inputRef = useRef<HTMLInputElement>(null)
  const [tooLarge, setTooLarge] = useState(false)

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
          {t("chooseFile")}
        </Button>
        <span className="flex-1 truncate text-sm text-muted-foreground">
          {value ? value.name : t("noFile")}
        </span>
        {value ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={t("removeFile", { label })}
            onClick={() => {
              onChange(undefined)
              setTooLarge(false)
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
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file && file.size > MAX_FILE_SIZE_BYTES) {
            setTooLarge(true)
            onChange(undefined)
            if (inputRef.current) inputRef.current.value = ""
            return
          }
          setTooLarge(false)
          onChange(file)
        }}
      />
      {tooLarge ? (
        <p className="text-xs text-destructive">{t("fileTooLarge")}</p>
      ) : (
        <p className="text-xs text-muted-foreground">{t("maxSize")}</p>
      )}
    </div>
  )
}
