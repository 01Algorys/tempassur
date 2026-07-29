"use client"

import { useRef, useState, type DragEvent } from "react"
import { File as FileIcon, UploadCloud, X } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { MAX_FILE_SIZE_BYTES } from "@/lib/validations/subscription-schema"

import { formatFileSize } from "./format-file-size"

interface MultiFileUploadFieldProps {
  id: string
  label: string
  value?: File[]
  onChange: (files: File[]) => void
  accept?: string
}

// Same file (by name+size+lastModified) can't be added twice — picking or
// dropping it again from a fresh file dialog would otherwise duplicate it.
function isSameFile(a: File, b: File) {
  return a.name === b.name && a.size === b.size && a.lastModified === b.lastModified
}

export function MultiFileUploadField({
  id,
  label,
  value = [],
  onChange,
  accept = "image/*,.pdf",
}: MultiFileUploadFieldProps) {
  const t = useTranslations("wizard.documents")
  const inputRef = useRef<HTMLInputElement>(null)
  const [tooLarge, setTooLarge] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  function addFiles(files: FileList | File[] | null | undefined) {
    if (!files || files.length === 0) return
    const incoming = Array.from(files)
    const accepted = incoming.filter((file) => file.size <= MAX_FILE_SIZE_BYTES)
    const rejected = incoming.length - accepted.length

    setTooLarge(rejected > 0)

    const merged = [...value]
    for (const file of accepted) {
      if (!merged.some((existing) => isSameFile(existing, file))) merged.push(file)
    }
    onChange(merged)
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setDragActive(false)
    addFiles(event.dataTransfer.files)
  }

  function removeFile(index: number) {
    onChange(value.filter((_, i) => i !== index))
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>

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
        <p className="text-sm font-medium text-foreground">{t("chooseFiles")}</p>
        <p className="text-xs text-muted-foreground">{t("dragHint")}</p>
      </div>

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        multiple
        className="hidden"
        onChange={(event) => {
          addFiles(event.target.files)
          if (inputRef.current) inputRef.current.value = ""
        }}
      />

      {value.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {value.map((file, index) => (
            <li
              key={`${file.name}-${file.size}-${file.lastModified}`}
              className="flex items-center gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5"
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileIcon className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={t("removeFile", { label: file.name })}
                onClick={() => removeFile(index)}
              >
                <X className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      ) : null}

      {tooLarge ? (
        <p className="text-xs text-destructive">{t("fileTooLarge")}</p>
      ) : (
        <p className="text-xs text-muted-foreground">{t("maxSize")}</p>
      )}
    </div>
  )
}
