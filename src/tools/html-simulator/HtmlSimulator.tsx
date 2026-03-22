import { useState, useCallback, useEffect, useRef } from 'react'
import { Play, Zap, Trash2 } from 'lucide-react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { useResizable } from '../../hooks/useResizable'
import { ResizeHandle } from '../../components/ui/ResizeHandle'
import { Button } from '../../components/ui/Button'
import { CopyButton } from '../../components/ui/CopyButton'
import { ShareButton } from '../../components/ui/ShareButton'
import { HtmlEditor } from './HtmlEditor'
import { HtmlPreview } from './HtmlPreview'
import { useHashState } from '../../hooks/useHashState'

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

const PANE_LABEL = 'px-3 py-1.5 text-[11px] font-medium tracking-wide uppercase'

export function HtmlSimulator() {
  const [input, setInput] = useLocalStorage('ss:html:input', DEFAULT_HTML)
  const [previewKey, setPreviewKey] = useState(0)
  const [livePreview, setLivePreview] = useState(true)
  const [liveHtml, setLiveHtml] = useState(input)
  const { percent, containerRef, startDrag } = useResizable(50)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useHashState<{ i: string }>((state) => {
    if (state.i !== undefined) { setInput(state.i); setLiveHtml(state.i) }
  })

  useEffect(() => {
    if (!livePreview) return
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setLiveHtml(input)
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [input, livePreview])

  const handleRun = useCallback(() => {
    setLiveHtml(input)
    setPreviewKey((k) => k + 1)
  }, [input])

  const handleToggleLive = useCallback(() => {
    setLivePreview((v) => {
      if (!v) {
        // Switching live on: sync immediately
        setLiveHtml(input)
      }
      return !v
    })
  }, [input])

  const handleClear = useCallback(() => {
    setInput(DEFAULT_HTML)
    setLiveHtml(DEFAULT_HTML)
    setPreviewKey((k) => k + 1)
  }, [setInput])

  const getShareData = useCallback(() => ({ i: input }), [input])

  return (
    <div className="flex flex-col h-full overflow-hidden animate-fade-up" style={{ background: 'var(--bg-base)' }}>
      {/* Toolbar */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-[var(--border)] bg-[var(--bg-surface)] flex-wrap">
        <Button
          onClick={handleRun}
          size="md"
          style={
            {
              background: 'rgba(6,182,212,0.15)',
              color: '#06b6d4',
              border: '1px solid rgba(6,182,212,0.3)',
            } as React.CSSProperties
          }
        >
          <Play size={14} />
          Run
        </Button>

        <Button
          variant="ghost"
          size="md"
          onClick={handleToggleLive}
          title={livePreview ? 'Live preview on — click to disable' : 'Live preview off — click to enable'}
          style={
            livePreview
              ? ({
                  color: '#06b6d4',
                  background: 'rgba(6,182,212,0.1)',
                  border: '1px solid rgba(6,182,212,0.25)',
                } as React.CSSProperties)
              : undefined
          }
        >
          <Zap size={14} />
          Live
        </Button>

        <div className="flex-1" />

        <CopyButton text={input} size="md" />
        <ShareButton getData={getShareData} size="md" />
        <Button variant="ghost" size="md" onClick={handleClear} title="Reset to default">
          <Trash2 size={14} />
          Clear
        </Button>
      </div>

      {/* Panes */}
      <div ref={containerRef} className="flex flex-1 min-h-0">
        {/* Editor pane */}
        <div className="flex flex-col min-h-0 min-w-0" style={{ width: `${percent}%` }}>
          <div
            className={PANE_LABEL}
            style={{
              color: 'var(--text-muted)',
              borderBottom: '1px solid var(--border)',
              background: 'var(--bg-surface)',
              borderLeft: '2px solid rgba(6,182,212,0.35)',
            }}
          >
            HTML
          </div>
          <HtmlEditor value={input} onChange={setInput} />
        </div>

        <ResizeHandle onMouseDown={startDrag} />

        {/* Preview pane */}
        <div className="flex flex-col min-h-0 min-w-0" style={{ width: `${100 - percent}%` }}>
          <div
            className={PANE_LABEL}
            style={{
              color: 'var(--text-muted)',
              borderBottom: '1px solid var(--border)',
              background: 'var(--bg-surface)',
              borderLeft: '2px solid rgba(6,182,212,0.35)',
            }}
          >
            Preview
          </div>
          <HtmlPreview html={liveHtml} previewKey={previewKey} />
        </div>
      </div>
    </div>
  )
}
