import { useMemo } from 'react'
import { ShieldCheck, ShieldAlert, ShieldOff } from 'lucide-react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { CopyButton } from '../../components/ui/CopyButton'

const JWT_ACCENT = '#a855f7'

// ── Decode utils ───────────────────────────────────────────────────────────

function base64urlDecode(str: string): string {
  const b64 = str.replace(/-/g, '+').replace(/_/g, '/')
  const padded = b64.padEnd(b64.length + (4 - (b64.length % 4)) % 4, '=')
  const bytes = Uint8Array.from(atob(padded), c => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

type DecodedJwt =
  | { ok: true; header: Record<string, unknown>; payload: Record<string, unknown>; signature: string }
  | { ok: false; error: string }

function decodeJwt(token: string): DecodedJwt | null {
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

function formatRelative(totalSecs: number): string {
  const abs = Math.abs(Math.round(totalSecs))
  if (abs < 60) return `${abs}s`
  if (abs < 3600) return `${Math.floor(abs / 60)}m`
  if (abs < 86400) return `${Math.floor(abs / 3600)}h`
  return `${Math.floor(abs / 86400)}d`
}

// ── JSON syntax highlighter ────────────────────────────────────────────────

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function highlightJson(obj: unknown): string {
  const escaped = escapeHtml(JSON.stringify(obj, null, 2))
  return escaped.replace(
    /("(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"\s*:?|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?|true|false|null)/g,
    (match) => {
      let color = '#06b6d4'
      if (match.startsWith('"')) {
        color = match.trimEnd().endsWith(':') ? '#818cf8' : '#10b981'
      } else if (match === 'true' || match === 'false') {
        color = '#f59e0b'
      } else if (match === 'null') {
        color = '#5c5a7a'
      }
      return `<span style="color:${color}">${match}</span>`
    },
  )
}

// ── PanelHeader ────────────────────────────────────────────────────────────

function PanelHeader({ title, copyText }: { title: string; copyText: string }) {
  return (
    <div
      className="flex items-center justify-between px-3 py-2 shrink-0"
      style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)' }}
    >
      <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: JWT_ACCENT }}>
        {title}
      </span>
      <CopyButton text={copyText} />
    </div>
  )
}

// ── ExpRow ─────────────────────────────────────────────────────────────────

function ExpRow({ exp }: { exp: number }) {
  const now = Math.floor(Date.now() / 1000)
  const diff = exp - now
  const date = new Date(exp * 1000).toLocaleString()

  let color: string
  let bg: string
  let Icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>
  let label: string

  if (diff < 0) {
    color = 'var(--error)'; bg = 'rgba(239,68,68,0.08)'; Icon = ShieldOff
    label = `Expired ${formatRelative(diff)} ago`
  } else if (diff < 300) {
    color = 'var(--warning)'; bg = 'rgba(245,158,11,0.08)'; Icon = ShieldAlert
    label = `Expires in ${formatRelative(diff)}`
  } else {
    color = 'var(--success)'; bg = 'rgba(16,185,129,0.08)'; Icon = ShieldCheck
    label = `Expires in ${formatRelative(diff)}`
  }

  return (
    <div
      className="flex items-center gap-2 px-3 py-2 text-[11px] shrink-0"
      style={{ borderBottom: '1px solid var(--border)', background: bg }}
    >
      <Icon size={12} style={{ color, flexShrink: 0 }} />
      <span style={{ color }} className="font-semibold">{label}</span>
      <span style={{ color: 'var(--border)' }}>·</span>
      <span style={{ color: 'var(--text-muted)' }}>{date}</span>
    </div>
  )
}

// ── JsonPanel ──────────────────────────────────────────────────────────────

function JsonPanel({
  title,
  data,
  children,
}: {
  title: string
  data: Record<string, unknown>
  children?: React.ReactNode
}) {
  return (
    <div
      className="flex flex-col rounded-xl overflow-hidden"
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
    >
      <PanelHeader title={title} copyText={JSON.stringify(data, null, 2)} />
      {children}
      <pre
        className="p-4 font-mono text-[12px] leading-relaxed m-0 whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: highlightJson(data) }}
      />
    </div>
  )
}

// ── SignaturePanel ─────────────────────────────────────────────────────────

function SignaturePanel({ signature }: { signature: string }) {
  return (
    <div
      className="flex flex-col rounded-xl overflow-hidden"
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
    >
      <PanelHeader title="Signature" copyText={signature} />
      <div className="p-4 flex flex-col gap-3">
        <p className="font-mono text-[12px] break-all leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {signature}
        </p>
        <p
          className="text-[11px] leading-relaxed px-3 py-2 rounded-lg"
          style={{
            color: 'var(--text-muted)',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-muted)',
          }}
        >
          Signatures can only be verified with the secret key. This tool decodes only — no validation is performed.
        </p>
      </div>
    </div>
  )
}

// ── JwtDecoder ─────────────────────────────────────────────────────────────

const SAMPLE =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

export function JwtDecoder() {
  const [token, setToken] = useLocalStorage('ss:jwt:token', '')
  const decoded = useMemo(() => decodeJwt(token.trim()), [token])
  const hasError = decoded !== null && !decoded.ok

  return (
    <div className="flex flex-col h-full overflow-hidden animate-fade-up" style={{ background: 'var(--bg-base)' }}>
      {/* Token input */}
      <div
        className="shrink-0 p-4 flex items-start gap-3"
        style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)' }}
      >
        <textarea
          value={token}
          onChange={e => setToken(e.target.value)}
          placeholder="Paste a JWT token here…  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.signature"
          className="flex-1 font-mono text-[13px] resize-none outline-none rounded-lg px-3 py-2.5"
          style={{
            background: 'var(--bg-elevated)',
            color: 'var(--text-primary)',
            border: `1px solid ${hasError ? 'var(--error)' : 'var(--border)'}`,
            height: '70px',
            lineHeight: 1.6,
          }}
          spellCheck={false}
          autoComplete="off"
        />
        <div className="flex flex-col gap-2 shrink-0">
          <button
            onClick={() => setToken(SAMPLE)}
            className="px-3 py-2 rounded-lg text-xs font-medium cursor-pointer"
            style={{ background: `${JWT_ACCENT}18`, color: JWT_ACCENT, border: `1px solid ${JWT_ACCENT}35` }}
          >
            Sample
          </button>
          {token && (
            <button
              onClick={() => setToken('')}
              className="px-3 py-2 rounded-lg text-xs font-medium cursor-pointer"
              style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Error banner */}
      {hasError && (
        <div
          className="shrink-0 px-4 py-2 text-xs"
          style={{
            color: 'var(--error)',
            background: 'rgba(239,68,68,0.08)',
            borderBottom: '1px solid rgba(239,68,68,0.2)',
          }}
        >
          {!decoded.ok && decoded.error}
        </div>
      )}

      {/* Decoded panels */}
      {decoded?.ok && (
        <div className="flex-1 min-h-0 overflow-auto p-4">
          <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1.5fr 1fr' }}>
            <JsonPanel title="Header" data={decoded.header} />
            <JsonPanel title="Payload" data={decoded.payload}>
              {typeof decoded.payload.exp === 'number' && (
                <ExpRow exp={decoded.payload.exp} />
              )}
            </JsonPanel>
            <SignaturePanel signature={decoded.signature} />
          </div>
        </div>
      )}

      {/* Empty state */}
      {!token.trim() && (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 pb-16">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: `${JWT_ACCENT}18`, border: `1px solid ${JWT_ACCENT}35` }}
          >
            <ShieldCheck size={26} style={{ color: JWT_ACCENT }} />
          </div>
          <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            Paste a JWT to decode it
          </p>
          <p className="text-[12px] font-mono" style={{ color: 'var(--text-muted)' }}>
            eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMifQ.sig
          </p>
          <button
            onClick={() => setToken(SAMPLE)}
            className="mt-2 px-4 py-2 rounded-lg text-xs font-medium cursor-pointer"
            style={{ background: `${JWT_ACCENT}18`, color: JWT_ACCENT, border: `1px solid ${JWT_ACCENT}35` }}
          >
            Load sample token
          </button>
        </div>
      )}
    </div>
  )
}
