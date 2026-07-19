"use client"

import * as XLSX from "xlsx"

function toCell(value: unknown): string {
  if (value === null || value === undefined) return ""
  if (value instanceof Date) return value.toISOString()
  return String(value)
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
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename.endsWith(".csv") ? filename : `${filename}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export function exportToExcel(filename: string, rows: Record<string, unknown>[], sheetName = "Export"): void {
  if (rows.length === 0) return
  const worksheet = XLSX.utils.json_to_sheet(rows)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
  XLSX.writeFile(workbook, filename.endsWith(".xlsx") ? filename : `${filename}.xlsx`)
}
