const ORDINAL_SUFFIX: Record<number, string> = {
  1: "ro",
  2: "do",
  3: "ro",
}

const MONTH_ABBR: Record<number, string> = {
  1: "Ene",
  2: "Feb",
  3: "Mar",
  4: "Abr",
  5: "May",
  6: "Jun",
  7: "Jul",
  8: "Agos",
  9: "Sep",
  10: "Oct",
  11: "Nov",
  12: "Dic",
}

function ordinal(day: number): string {
  const suffix = ORDINAL_SUFFIX[day] ?? "to"
  return `${day}${suffix}`
}

/**
 * Formatea una fecha como "1ro Sep 2025".
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  const day = d.getDate()
  const month = MONTH_ABBR[d.getMonth() + 1]
  const year = d.getFullYear()
  return `${ordinal(day)} ${month} ${year}`
}
