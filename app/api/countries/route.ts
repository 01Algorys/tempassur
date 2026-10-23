import { NextResponse } from "next/server"

import { COUNTRIES } from "@/lib/countries"

// Full ISO 3166-1 list (250 entries) from the world-countries dataset, served by the
// jsDelivr CDN API — free, no API key, pinned version. Only the alpha-2 codes are kept:
// labels are resolved client-side via Intl.DisplayNames (lib/countries.ts).
const SOURCE_URL = "https://cdn.jsdelivr.net/npm/world-countries@5.1.0/dist/countries.json"
const ONE_DAY = 60 * 60 * 24

export const revalidate = 86400

export async function GET() {
  try {
    const response = await fetch(SOURCE_URL, { next: { revalidate: ONE_DAY } })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const data = (await response.json()) as { cca2?: string }[]
    const codes = data.map((c) => c.cca2).filter((code): code is string => typeof code === "string" && code.length === 2)
    if (codes.length === 0) throw new Error("empty country list")

    return NextResponse.json({ codes }, { headers: { "Cache-Control": `public, max-age=${ONE_DAY}` } })
  } catch (error) {
    console.error("[countries] falling back to the curated list", error)
    return NextResponse.json({ codes: COUNTRIES.map((c) => c.code) })
  }
}
