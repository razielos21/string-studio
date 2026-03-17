// ─── Case transforms ──────────────────────────────────────────────────────────

export function toUpperCase(s: string) {
  return s.toUpperCase()
}

export function toLowerCase(s: string) {
  return s.toLowerCase()
}

export function toTitleCase(s: string) {
  return s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
}

export function toSentenceCase(s: string) {
  return s
    .split(/([.!?]\s+)/)
    .map((chunk, i) => (i % 2 === 0 ? chunk.charAt(0).toUpperCase() + chunk.slice(1).toLowerCase() : chunk))
    .join('')
}

export function toCamelCase(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase())
}

export function toSnakeCase(s: string) {
  return s
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s\-]+/g, '_')
    .toLowerCase()
}

export function toKebabCase(s: string) {
  return s
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}

// ─── Whitespace transforms ────────────────────────────────────────────────────

export function trimEnds(s: string) {
  return s.trim()
}

export function collapseSpaces(s: string) {
  return s.replace(/[ \t]+/g, ' ').replace(/^ /gm, '').replace(/ $/gm, '')
}

export function removeBlankLines(s: string) {
  return s.replace(/^\s*[\r\n]/gm, '').replace(/\n+/g, '\n')
}

export function normalizeLineEndings(s: string) {
  return s.replace(/\r\n|\r/g, '\n')
}

// ─── Find & Replace ───────────────────────────────────────────────────────────

export function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function findReplace(s: string, find: string, replace: string, useRegex: boolean): string {
  if (!find) return s
  try {
    const pattern = useRegex ? find : escapeRegex(find)
    return s.replace(new RegExp(pattern, 'g'), replace)
  } catch {
    return s
  }
}

// ─── Line transforms ──────────────────────────────────────────────────────────

export function sortLinesAZ(s: string) {
  return s.split('\n').sort((a, b) => a.localeCompare(b)).join('\n')
}

export function sortLinesZA(s: string) {
  return s.split('\n').sort((a, b) => b.localeCompare(a)).join('\n')
}

export function removeDuplicateLines(s: string) {
  const seen = new Set<string>()
  return s
    .split('\n')
    .filter((line) => {
      if (seen.has(line)) return false
      seen.add(line)
      return true
    })
    .join('\n')
}

export function reverseLines(s: string) {
  return s.split('\n').reverse().join('\n')
}

export function addLineNumbers(s: string) {
  return s.split('\n').map((line, i) => `${i + 1}. ${line}`).join('\n')
}

// ─── Encoding ────────────────────────────────────────────────────────────────

export function base64Encode(s: string) {
  try {
    return btoa(unescape(encodeURIComponent(s)))
  } catch {
    return btoa(s)
  }
}

export function base64Decode(s: string) {
  try {
    return decodeURIComponent(escape(atob(s.trim())))
  } catch {
    return atob(s.trim())
  }
}

export function urlEncode(s: string) {
  return encodeURIComponent(s)
}

export function urlDecode(s: string) {
  try {
    return decodeURIComponent(s)
  } catch {
    return s
  }
}

export function htmlEscape(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function htmlUnescape(s: string) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

// ─── Stats ───────────────────────────────────────────────────────────────────

export function getStats(s: string) {
  const chars = s.length
  const lines = s === '' ? 0 : s.split('\n').length
  const words = s.trim() === '' ? 0 : s.trim().split(/\s+/).length
  return { chars, lines, words }
}
