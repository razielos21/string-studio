const PREFIX = 'z.'

export async function encodeState(data: unknown): Promise<string> {
  const bytes = new TextEncoder().encode(JSON.stringify(data))
  const cs = new CompressionStream('deflate-raw')
  const writer = cs.writable.getWriter()
  await writer.write(bytes)
  await writer.close()
  const buf = await new Response(cs.readable).arrayBuffer()
  const uint8 = new Uint8Array(buf)
  const binary = String.fromCharCode(...uint8)
  const b64url = btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  return PREFIX + b64url
}

export async function decodeState<T>(encoded: string): Promise<T | null> {
  try {
    const stripped = encoded.startsWith('#') ? encoded.slice(1) : encoded
    if (!stripped) return null

    if (stripped.startsWith(PREFIX)) {
      const b64 = stripped.slice(PREFIX.length).replace(/-/g, '+').replace(/_/g, '/')
      const padded = b64 + '=='.slice(0, (4 - (b64.length % 4)) % 4)
      const binary = atob(padded)
      const bytes = Uint8Array.from(binary, c => c.charCodeAt(0))
      const ds = new DecompressionStream('deflate-raw')
      const writer = ds.writable.getWriter()
      await writer.write(bytes)
      await writer.close()
      const buf = await new Response(ds.readable).arrayBuffer()
      return JSON.parse(new TextDecoder().decode(buf)) as T
    }

    // Legacy format fallback
    return JSON.parse(decodeURIComponent(atob(stripped))) as T
  } catch {
    return null
  }
}

export async function buildShareUrl(data: unknown): Promise<string> {
  const encoded = await encodeState(data)
  return `${window.location.origin}${window.location.pathname}#${encoded}`
}

export function clearHash(): void {
  window.history.replaceState(null, '', window.location.pathname + window.location.search)
}
