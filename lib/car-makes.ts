// Curated list of vehicle makes commonly registered in France/Europe, used as
// a fallback for the "marque" field (wizard.vehicle) datalist suggestions
// whenever the NHTSA vPIC API (fetchCarMakes below) is unreachable or slow.
// The field stays free text regardless — this only affects autocomplete.
export const CAR_MAKES: string[] = [
  "Abarth",
  "Alfa Romeo",
  "Alpine",
  "Aston Martin",
  "Audi",
  "Bentley",
  "BMW",
  "BYD",
  "Cadillac",
  "Chevrolet",
  "Chrysler",
  "Citroën",
  "Cupra",
  "Dacia",
  "Daewoo",
  "Daf",
  "Daihatsu",
  "Dodge",
  "DS Automobiles",
  "Ferrari",
  "Fiat",
  "Fisker",
  "Ford",
  "Genesis",
  "GMC",
  "Honda",
  "Hummer",
  "Hyundai",
  "Infiniti",
  "Isuzu",
  "Iveco",
  "Jaguar",
  "Jeep",
  "Kia",
  "Lada",
  "Lamborghini",
  "Lancia",
  "Land Rover",
  "Lexus",
  "Lotus",
  "Man",
  "Maserati",
  "Maybach",
  "Mazda",
  "McLaren",
  "Mercedes-Benz",
  "MG",
  "Mini",
  "Mitsubishi",
  "Nissan",
  "Opel",
  "Peugeot",
  "Piaggio",
  "Polestar",
  "Porsche",
  "Renault",
  "Rolls-Royce",
  "Rover",
  "Saab",
  "Scania",
  "Seat",
  "Skoda",
  "Smart",
  "SsangYong",
  "Subaru",
  "Suzuki",
  "Tesla",
  "Toyota",
  "Volkswagen",
  "Volvo",
]

const VPIC_ENDPOINT = "https://vpic.nhtsa.dot.gov/api/vehicles/GetAllMakes?format=json"
const CACHE_KEY = "tempassur-car-makes-cache-v1"
const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000

interface VpicMake {
  Make_Name: string
}

interface VpicResponse {
  Results: VpicMake[]
}

interface CarMakesCache {
  makes: string[]
  fetchedAt: number
}

function titleCase(value: string): string {
  return value.replace(/\w\S*/g, (word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
}

function readCache(): string[] | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as CarMakesCache
    if (Date.now() - parsed.fetchedAt > CACHE_TTL_MS) return null
    return parsed.makes
  } catch {
    return null
  }
}

function writeCache(makes: string[]) {
  if (typeof window === "undefined") return
  try {
    const entry: CarMakesCache = { makes, fetchedAt: Date.now() }
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(entry))
  } catch {
    // localStorage unavailable/full — caching is a nice-to-have, safe to skip.
  }
}

// Fetches the full make list from NHTSA's free vPIC API (~10k entries, no key
// required), caching it for CACHE_TTL_MS since it changes rarely. Falls back
// to the static CAR_MAKES list above if the request fails or is empty —
// callers never need their own try/catch.
export async function fetchCarMakes(): Promise<string[]> {
  const cached = readCache()
  if (cached) return cached

  try {
    const res = await fetch(VPIC_ENDPOINT)
    if (!res.ok) throw new Error(`vPIC responded ${res.status}`)
    const data = (await res.json()) as VpicResponse
    const names = Array.from(new Set(data.Results.map((r) => titleCase(r.Make_Name.trim())).filter(Boolean))).sort(
      (a, b) => a.localeCompare(b)
    )
    if (names.length === 0) throw new Error("vPIC returned no makes")
    writeCache(names)
    return names
  } catch {
    return CAR_MAKES
  }
}
