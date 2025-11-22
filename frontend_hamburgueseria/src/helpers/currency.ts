const formatter = new Intl.NumberFormat('es-BO', {
  style: 'currency',
  currency: 'BOB',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatBs(value: number | string | null | undefined): string {
  const n = Number(value)
  if (!isFinite(n)) return 'Bs 0.00'
  // Intl for es-BO returns "Bs 12,34" or may use "BOB" depending on env; normalize to "Bs"
  const out = formatter.format(n)
  return out.replace('BOB', 'Bs')
}
