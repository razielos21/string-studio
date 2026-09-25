export function base64urlDecode(str: string): string {
  const b64 = str.replace(/-/g, '+').replace(/_/g, '/')
  const padded = b64.padEnd(b64.length + (4 - (b64.length % 4)) % 4, '=')
  const bytes = Uint8Array.from(atob(padded), c => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

export type DecodedJwt =
  | { ok: true; header: Record<string, unknown>; payload: Record<string, unknown>; signature: string }
  | { ok: false; error: string }

export function decodeJwt(token: string): DecodedJwt | null {
  if (!token) return null
  const parts = token.split('.')
  if (parts.length !== 3) {
    return { ok: false, error: `Expected 3 dot-separated parts, got ${parts.length}` }
  }
  try {
    const header = JSON.parse(base64urlDecode(parts[0])) as Record<string, unknown>
    const payload = JSON.parse(base64urlDecode(parts[1])) as Record<string, unknown>
    return { ok: true, header, payload, signature: parts[2] }
  } catch {
    return { ok: false, error: 'Failed to decode — invalid base64url encoding or malformed JSON' }
  }
}

export function formatRelative(totalSecs: number): string {
  const abs = Math.abs(Math.round(totalSecs))
  if (abs < 60) return `${abs}s`
  if (abs < 3600) return `${Math.floor(abs / 60)}m`
  if (abs < 86400) return `${Math.floor(abs / 3600)}h`
  return `${Math.floor(abs / 86400)}d`
}

export type ExpStatus = 'valid' | 'expiring' | 'expired'

/** Tokens expiring within this many seconds are flagged as "expiring". */
export const EXPIRING_SOON_SECS = 300

export function nowSecs(): number {
  return Math.floor(Date.now() / 1000)
}

/** Status for a token with `secondsLeft = exp - now` (negative once expired). */
export function getExpStatus(secondsLeft: number): ExpStatus {
  if (secondsLeft < 0) return 'expired'
  if (secondsLeft < EXPIRING_SOON_SECS) return 'expiring'
  return 'valid'
}
