/** Strip everything that should not matter when matching a student's typed answer. */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[−–—]/g, '-')
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, ' ')
    .replace(/[^a-z0-9.+\-'" ]/g, '')
    .trim()
}

/** Parse a numeric answer out of free text, tolerating units and unicode minus. */
export function parseNumber(raw: string): number | null {
  const cleaned = raw
    .replace(/[−–—]/g, '-')
    .replace(/[°]/g, '')
    .replace(/[a-zA-ZΩµ]/g, '')
    .replace(/\s+/g, '')
    .replace(',', '.')
  if (cleaned === '' || cleaned === '-' || cleaned === '+') return null
  const n = Number(cleaned)
  return Number.isFinite(n) ? n : null
}

export function pct(got: number, max: number): number {
  if (max <= 0) return 0
  return Math.round((got / max) * 100)
}

/** Vivid class for an accuracy percentage. */
export function accuracyTone(p: number): 'ok' | 'warn' | 'bad' {
  if (p >= 75) return 'ok'
  if (p >= 45) return 'warn'
  return 'bad'
}
