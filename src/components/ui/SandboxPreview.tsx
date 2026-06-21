interface SandboxPreviewProps {
  doc: string
  /** Force iframe remount (useful for re-running scripts on same content). */
  previewKey?: number
  emptyIcon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>
  emptyTitle: string
  emptySubtitle: string
  /** RGB components e.g. '6,182,212' — used for rgba() tints in empty state. */
  rgb: string
  sandbox?: string
}

export function SandboxPreview({
  doc,
  previewKey,
  emptyIcon: Icon,
  emptyTitle,
  emptySubtitle,
  rgb,
  sandbox = 'allow-scripts',
}: SandboxPreviewProps) {
  if (!doc.trim()) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ background: `rgba(${rgb},0.08)`, border: `1px solid rgba(${rgb},0.2)` }}
        >
          <Icon size={22} style={{ color: `rgba(${rgb},0.5)` }} />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>{emptyTitle}</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{emptySubtitle}</p>
        </div>
      </div>
    )
  }

  return (
    <iframe
      key={previewKey}
      srcDoc={doc}
      sandbox={sandbox}
      title="Preview"
      className="flex-1 w-full border-0 bg-white"
      style={{ display: 'block' }}
    />
  )
}
