// Valeur d'un <input type="date"> (AAAA-MM-JJ) à partir d'une date renvoyée par le CRM.
// Une date « pure » (naissance, début…) est stockée à minuit UTC : on garde ce jour-là.
// Un horodatage (souscription à 00:18 heure de Paris = 23:18 UTC la veille) est lu en
// heure locale, comme sur les fiches — sinon chaque enregistrement reculerait d'un jour.
export function dateInputValue(value: string | null | undefined): string {
  if (!value) return ""
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ""
  const utcMidnight = d.getUTCHours() === 0 && d.getUTCMinutes() === 0 && d.getUTCSeconds() === 0 && d.getUTCMilliseconds() === 0
  if (utcMidnight) return d.toISOString().slice(0, 10)
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}
