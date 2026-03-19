import { X, AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react'
import { useToast } from '../../context/ToastContext'
import type { ToastType } from '../../context/ToastContext'

const ICONS: Record<ToastType, React.ComponentType<{ size?: number; style?: React.CSSProperties }>> = {
  error: AlertCircle,
  warning: AlertTriangle,
  success: CheckCircle,
  info: Info,
}

const COLORS: Record<ToastType, { border: string; icon: string; bg: string }> = {
  error:   { border: 'var(--error)',   icon: 'var(--error)',   bg: 'rgba(239,68,68,0.1)' },
  warning: { border: 'var(--warning)', icon: 'var(--warning)', bg: 'rgba(245,158,11,0.1)' },
  success: { border: 'var(--success)', icon: 'var(--success)', bg: 'rgba(16,185,129,0.1)' },
  info:    { border: 'var(--accent)',  icon: 'var(--accent)',  bg: 'rgba(99,102,241,0.1)' },
}

export function ToastContainer() {
  const { toasts, dismiss } = useToast()

  if (toasts.length === 0) return null

  return (
    <div
      className="fixed bottom-4 right-4 flex flex-col gap-2 z-[9999] pointer-events-none"
      aria-live="assertive"
      aria-label="Notifications"
    >
      {toasts.map((toast) => {
        const Icon = ICONS[toast.type]
        const c = COLORS[toast.type]
        return (
          <div
            key={toast.id}
            role="alert"
            className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg max-w-sm text-sm pointer-events-auto"
            style={{
              background: 'var(--bg-elevated)',
              border: `1px solid ${c.border}`,
              boxShadow: `0 4px 16px rgba(0,0,0,0.4), 0 0 0 1px ${c.border}22`,
              animation: 'fadeUp 0.25s ease both',
            }}
          >
            <Icon size={15} style={{ color: c.icon, flexShrink: 0, marginTop: 1 }} />
            <span style={{ color: 'var(--text-primary)', flex: 1 }}>{toast.message}</span>
            <button
              onClick={() => dismiss(toast.id)}
              aria-label="Dismiss"
              className="shrink-0 hover:opacity-70 transition-opacity cursor-pointer"
              style={{ color: 'var(--text-muted)' }}
            >
              <X size={13} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
