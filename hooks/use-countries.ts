"use client"

import { useEffect, useMemo, useState } from "react"
import { useLocale } from "next-intl"

import { COUNTRIES, sortCountries, type Country } from "@/lib/countries"

// Shared across every dropdown on the page so /api/countries is hit only once.
let countriesPromise: Promise<Country[]> | null = null

function loadCountries(): Promise<Country[]> {
  if (!countriesPromise) {
    countriesPromise = fetch("/api/countries")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((data: { codes: string[] }) => data.codes.map((code) => ({ code })))
      .catch((error) => {
        countriesPromise = null
        throw error
      })
  }
  return countriesPromise
}

// All countries, sorted for the current locale. Starts from the curated COUNTRIES
// list so the dropdowns are usable immediately and stay usable if the API fails.
export function useCountries(): Country[] {
  const locale = useLocale()
  const [countries, setCountries] = useState<Country[]>(COUNTRIES)

  useEffect(() => {
    let cancelled = false
    loadCountries()
      .then((list) => {
        if (!cancelled) setCountries(list)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  return useMemo(() => sortCountries(countries, locale), [countries, locale])
}
