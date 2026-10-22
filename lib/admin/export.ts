"use client"

import * as XLSX from "xlsx"

function toCell(value: unknown): string {
  if (value === null || value === undefined) return ""
  if (value instanceof Date) return value.toISOString()
  return String(value)
}

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function exportToCsv(filename: string, rows: Record<string, unknown>[]): void {
  if (rows.length === 0) return
  const headers = Object.keys(rows[0])
  const lines = [
    headers.join(","),
    ...rows.map((row) =>
      headers
        .map((h) => {
          const cell = toCell(row[h]).replace(/"/g, '""')
          return /[",\n]/.test(cell) ? `"${cell}"` : cell
        })
        .join(",")
    ),
  ]
  const blob = new Blob([`﻿${lines.join("\n")}`], { type: "text/csv;charset=utf-8;" })
  download(blob, filename.endsWith(".csv") ? filename : `${filename}.csv`)
}

export function exportToExcel(filename: string, rows: Record<string, unknown>[], sheetName = "Export"): void {
  if (rows.length === 0) return
  const worksheet = XLSX.utils.json_to_sheet(rows)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
  XLSX.writeFile(workbook, filename.endsWith(".xlsx") ? filename : `${filename}.xlsx`)
}

// PDF paysage A4 ; au-delà de ~8 colonnes la police réduit pour que le
// tableau tienne en largeur (jspdf-autotable passe à la ligne dans les cellules).
export async function exportToPdf(filename: string, rows: Record<string, unknown>[], title: string): Promise<void> {
  if (rows.length === 0) return
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([import("jspdf"), import("jspdf-autotable")])
  const headers = Object.keys(rows[0])
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: headers.length > 14 ? "a3" : "a4" })
  doc.setFontSize(14)
  doc.text(title, 40, 36)
  doc.setFontSize(9)
  doc.text(`Exporté le ${new Date().toLocaleString("fr-FR")} — ${rows.length} ligne(s)`, 40, 52)
  const fontSize = headers.length > 20 ? 5 : headers.length > 12 ? 6 : headers.length > 8 ? 7 : 8
  autoTable(doc, {
    head: [headers],
    body: rows.map((row) => headers.map((h) => toCell(row[h]))),
    startY: 64,
    styles: { fontSize, cellPadding: 2, overflow: "linebreak" },
    headStyles: { fillColor: [7, 47, 95] },
    margin: { left: 20, right: 20 },
  })
  doc.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`)
}
