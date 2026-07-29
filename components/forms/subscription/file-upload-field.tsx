"use client"

import { useRef, useState, type DragEvent } from "react"
import { File as FileIcon, UploadCloud, X } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { MAX_FILE_SIZE_BYTES } from "@/lib/validations/subscription-schema"

import { formatFileSize } from "./format-file-size"

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
  const [dragActive, setDragActive] = useState(false)

  function handleFile(file: File | undefined) {
    if (file && file.size > MAX_FILE_SIZE_BYTES) {
      setTooLarge(true)
      onChange(undefined)
      if (inputRef.current) inputRef.current.value = ""
      return
    }
    setTooLarge(false)
    onChange(file)
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setDragActive(false)
    handleFile(event.dataTransfer.files?.[0])
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>

      {value ? (
        <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FileIcon className="size-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">{value.name}</p>
            <p className="text-xs text-muted-foreground">{formatFileSize(value.size)}</p>
          </div>
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
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") inputRef.current?.click()
          }}
          onDragOver={(event) => {
            event.preventDefault()
            setDragActive(true)
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed px-4 py-5 text-center transition-colors",
            dragActive ? "border-primary bg-primary/5" : "border-input hover:border-primary/50 hover:bg-muted/30",
          )}
        >
          <UploadCloud className="size-5 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">{t("chooseFile")}</p>
          <p className="text-xs text-muted-foreground">{t("dragHint")}</p>
        </div>
      )}

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(event) => handleFile(event.target.files?.[0])}
      />

      {tooLarge ? (
        <p className="text-xs text-destructive">{t("fileTooLarge")}</p>
      ) : (
        <p className="text-xs text-muted-foreground">{t("maxSize")}</p>
      )}
    </div>
  )
}
