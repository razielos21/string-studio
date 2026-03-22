import { Monitor } from 'lucide-react'

interface HtmlPreviewProps {
  html: string
  previewKey: number
}

export function HtmlPreview({ html, previewKey }: HtmlPreviewProps) {
  if (!html.trim()) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)' }}
        >
          <Monitor size={22} style={{ color: 'rgba(6,182,212,0.5)' }} />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>No HTML yet</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Type or paste HTML to see a live preview</p>
        </div>
      </div>
    )
  }

  return (
    <iframe
      key={previewKey}
      srcDoc={html}
      sandbox="allow-scripts allow-forms allow-modals"
      title="HTML Preview"
      className="flex-1 w-full border-0 bg-white"
      style={{ display: 'block' }}
    />
  )
}
