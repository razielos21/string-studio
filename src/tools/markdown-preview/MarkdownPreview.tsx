import { useState, useEffect, useRef, useCallback } from 'react'
import { useAsyncAction } from '../../hooks/useAsyncAction'
import { Download, FileDown, FileText, Trash2, Zap } from 'lucide-react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { useResizable } from '../../hooks/useResizable'
import { ResizeHandle } from '../../components/ui/ResizeHandle'
import { Button } from '../../components/ui/Button'
import { CopyButton } from '../../components/ui/CopyButton'
import { CodeEditor } from '../../components/ui/CodeEditor'
import { SandboxPreview } from '../../components/ui/SandboxPreview'
import { PaneLabel } from '../../components/ui/PaneLabel'
import { buildMarkdownDoc } from './markdown-preview.utils'
import { downloadMarkdownPdf } from './markdownToPdf'
import { downloadFile } from '../../lib/downloadFile'
import { activeAccentStyle } from '../../lib/styles'

const DEFAULT_MD = `# Welcome to Markdown Preview

Write **Markdown** on the left and see a live preview on the right.

## Features

- **Bold**, *italic*, \`inline code\`
- [Links](https://example.com)
- Lists and tables
- Code blocks with syntax highlighting

## Example Table

| Feature | Supported |
|---------|-----------|
| GFM     | ✅         |
| Tables  | ✅         |
| Code    | ✅         |

\`\`\`javascript
const greet = (name) => \`Hello, \${name}!\`
console.log(greet('World'))
\`\`\`

> **Tip:** Use the Export PDF button to save your document.
`

export function MarkdownPreview() {
  const [input, setInput] = useLocalStorage('ss:md:input', DEFAULT_MD)
  const [livePreview, setLivePreview] = useState(true)
  const [doc, setDoc] = useState(() => buildMarkdownDoc(input))
  const { percent, containerRef, startDrag } = useResizable(50)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isFirstRender = useRef(true)
  const { isPending: isPdfLoading, run: handleExportPdf } = useAsyncAction(
    useCallback(() => downloadMarkdownPdf(input), [input])
  )

  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return }
    if (!livePreview) return
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => setDoc(buildMarkdownDoc(input)), 300)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [input, livePreview])

  const handleRun = () => setDoc(buildMarkdownDoc(input))

  const handleToggleLive = () => {
    const next = !livePreview
    setLivePreview(next)
    if (next) setDoc(buildMarkdownDoc(input))
  }

  const handleClear = () => {
    setInput(DEFAULT_MD)
    setDoc(buildMarkdownDoc(DEFAULT_MD))
  }

  const handleDownload = () => downloadFile(input, 'document.md', 'text/markdown')

  return (
    <div className="flex flex-col h-full overflow-hidden animate-fade-up" style={{ background: 'var(--bg-base)' }}>
      {/* Toolbar */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-[var(--border)] bg-[var(--bg-surface)] flex-wrap">
        <Button
          variant="ghost"
          size="md"
          onClick={handleToggleLive}
          title={livePreview ? 'Live preview on — click to disable' : 'Live preview off — click to enable'}
          style={livePreview ? activeAccentStyle('#f43f5e', '244,63,94') : undefined}
        >
          <Zap size={14} />
          Live
        </Button>

        {!livePreview && (
          <Button
            onClick={handleRun}
            size="md"
            style={{ background: 'rgba(244,63,94,0.15)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.3)' } as React.CSSProperties}
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
          style={{ color: '#f43f5e' } as React.CSSProperties}
        >
          <FileDown size={14} />
          {isPdfLoading ? 'Generating…' : 'Export PDF'}
        </Button>

        <Button
          variant="ghost"
          size="md"
          onClick={handleDownload}
          title="Download Markdown file"
          style={{ color: '#f43f5e' } as React.CSSProperties}
        >
          <Download size={14} />
          Download MD
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
          <PaneLabel rgb="244,63,94">Markdown</PaneLabel>
          <CodeEditor value={input} onChange={setInput} language="markdown" />
        </div>

        <ResizeHandle onMouseDown={startDrag} />

        <div className="flex flex-col min-h-0 min-w-0" style={{ width: `${100 - percent}%` }}>
          <PaneLabel rgb="244,63,94">Preview</PaneLabel>
          <SandboxPreview
            doc={doc}
            emptyIcon={FileText}
            emptyTitle="No Markdown yet"
            emptySubtitle="Type or paste Markdown to see a live preview"
            rgb="244,63,94"
            sandbox="allow-scripts allow-popups"
          />
        </div>
      </div>
    </div>
  )
}
