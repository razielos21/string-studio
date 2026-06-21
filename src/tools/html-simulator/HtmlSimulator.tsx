import { useState, useEffect, useRef, useCallback } from 'react'
import { useAsyncAction } from '../../hooks/useAsyncAction'
import { FileDown, Monitor, Trash2, Zap } from 'lucide-react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { useResizable } from '../../hooks/useResizable'
import { ResizeHandle } from '../../components/ui/ResizeHandle'
import { Button } from '../../components/ui/Button'
import { CopyButton } from '../../components/ui/CopyButton'
import { CodeEditor } from '../../components/ui/CodeEditor'
import { SandboxPreview } from '../../components/ui/SandboxPreview'
import { exportHtmlPdf } from '../../lib/exportHtmlPdf'
import { PANE_LABEL } from '../../lib/styles'

const DEFAULT_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: sans-serif; padding: 2rem; }
    h1 { color: #06b6d4; }
  </style>
</head>
<body>
  <h1>Hello, HTML Simulator!</h1>
  <p>Edit this HTML and see a live preview.</p>
</body>
</html>`

export function HtmlSimulator() {
  const [input, setInput] = useLocalStorage('ss:html:input', DEFAULT_HTML)
  const [previewKey, setPreviewKey] = useState(0)
  const [livePreview, setLivePreview] = useState(true)
  const [liveHtml, setLiveHtml] = useState(input)
  const { percent, containerRef, startDrag } = useResizable(50)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { isPending: isPdfLoading, run: handleExportPdf } = useAsyncAction(
    useCallback(() => exportHtmlPdf(liveHtml), [liveHtml])
  )

  useEffect(() => {
    if (!livePreview) return
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => setLiveHtml(input), 300)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [input, livePreview])

  const handleRun = () => {
    setLiveHtml(input)
    setPreviewKey((k) => k + 1)
  }

  const handleToggleLive = () => {
    const next = !livePreview
    setLivePreview(next)
    if (next) setLiveHtml(input)
  }

  const handleClear = () => {
    setInput(DEFAULT_HTML)
    setLiveHtml(DEFAULT_HTML)
    setPreviewKey((k) => k + 1)
  }

  return (
    <div className="flex flex-col h-full overflow-hidden animate-fade-up" style={{ background: 'var(--bg-base)' }}>
      {/* Toolbar */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-[var(--border)] bg-[var(--bg-surface)] flex-wrap">
        <Button
          variant="ghost"
          size="md"
          onClick={handleToggleLive}
          title={livePreview ? 'Live preview on — click to disable' : 'Live preview off — click to enable'}
          style={
            livePreview
              ? ({ color: '#06b6d4', background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.25)' } as React.CSSProperties)
              : undefined
          }
        >
          <Zap size={14} />
          Live
        </Button>

        {!livePreview && (
          <Button
            onClick={handleRun}
            size="md"
            style={{ background: 'rgba(6,182,212,0.15)', color: '#06b6d4', border: '1px solid rgba(6,182,212,0.3)' } as React.CSSProperties}
          >
            Preview
          </Button>
        )}

        <div className="flex-1" />

        <Button
          variant="ghost"
          size="md"
          onClick={handleExportPdf}
          disabled={isPdfLoading}
          title="Export to PDF"
          style={{ color: '#06b6d4' } as React.CSSProperties}
        >
          <FileDown size={14} />
          {isPdfLoading ? 'Generating…' : 'Export PDF'}
        </Button>
        <CopyButton text={input} size="md" />
        <Button variant="ghost" size="md" onClick={handleClear} title="Reset to default">
          <Trash2 size={14} />
          Clear
        </Button>
      </div>

      {/* Panes */}
      <div ref={containerRef} className="flex flex-1 min-h-0">
        <div className="flex flex-col min-h-0 min-w-0" style={{ width: `${percent}%` }}>
          <div
            className={PANE_LABEL}
            style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)', borderLeft: '2px solid rgba(6,182,212,0.35)' }}
          >
            HTML
          </div>
          <CodeEditor value={input} onChange={setInput} language="html" formatOnPaste={false} />
        </div>

        <ResizeHandle onMouseDown={startDrag} />

        <div className="flex flex-col min-h-0 min-w-0" style={{ width: `${100 - percent}%` }}>
          <div
            className={PANE_LABEL}
            style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)', borderLeft: '2px solid rgba(6,182,212,0.35)' }}
          >
            Preview
          </div>
          <SandboxPreview
            doc={liveHtml}
            previewKey={previewKey}
            emptyIcon={Monitor}
            emptyTitle="No HTML yet"
            emptySubtitle="Type or paste HTML to see a live preview"
            rgb="6,182,212"
            sandbox="allow-scripts allow-forms allow-modals allow-popups"
          />
        </div>
      </div>
    </div>
  )
}
