export function encodeState(data: unknown): string {
  return btoa(encodeURIComponent(JSON.stringify(data)))
}

export function decodeState<T>(encoded: string): T | null {
  try {
    const stripped = encoded.startsWith('#') ? encoded.slice(1) : encoded
    if (!stripped) return null
    return JSON.parse(decodeURIComponent(atob(stripped))) as T
  } catch {
    return null
  }
}

export function buildShareUrl(data: unknown): string {
  return `${window.location.origin}${window.location.pathname}#${encodeState(data)}`
}

export function clearHash(): void {
  window.history.replaceState(null, '', window.location.pathname + window.location.search)
}
