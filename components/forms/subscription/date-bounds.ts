// Bornes des calendriers du tunnel, alignées sur les règles de validation existantes
// (date d'effet non passée, conducteur de 21 ans minimum, permis depuis 2 ans).
export function startOfToday(): Date {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

export function yearsAgo(years: number): Date {
  const today = startOfToday()
  return new Date(today.getFullYear() - years, today.getMonth(), today.getDate())
}
