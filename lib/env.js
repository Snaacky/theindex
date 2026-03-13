export function normalizeEnvValue(value, fallback) {
  let normalized = typeof value === 'string' ? value.trim() : fallback

  if (typeof normalized !== 'string') {
    return undefined
  }

  if (
    (normalized.startsWith('"') && normalized.endsWith('"')) ||
    (normalized.startsWith("'") && normalized.endsWith("'")) ||
    (normalized.startsWith('<') && normalized.endsWith('>'))
  ) {
    normalized = normalized.slice(1, -1).trim()
  }

  if (normalized.endsWith('>') && normalized.includes('://')) {
    normalized = normalized.slice(0, -1).trim()
  }

  return normalized
}
