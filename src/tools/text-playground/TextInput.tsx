import { useMemo } from 'react'
import Editor from '@monaco-editor/react'
import { getStats } from './text-playground.utils'

interface TextInputProps {
  value: string
  onChange: (value: string) => void
}

export function TextInput({ value, onChange }: TextInputProps) {
  const stats = useMemo(() => getStats(value), [value])

  return (
    <div className="flex flex-col h-full min-h-0">
      <div
        className="px-3 py-1.5 text-[11px] font-medium tracking-wide uppercase shrink-0"
        style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)', borderLeft: '2px solid rgba(245,158,11,0.35)' }}
      >
        Input
      </div>

      <div className="relative flex-1 min-h-0">
        <Editor
          height="100%"
          language="plaintext"
          theme="vs-dark"
          value={value}
          onChange={(v) => onChange(v ?? '')}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineHeight: 1.65,
            lineNumbers: 'off',
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            renderLineHighlight: 'none',
            overviewRulerBorder: false,
            overviewRulerLanes: 0,
            hideCursorInOverviewRuler: true,
            scrollbar: { verticalScrollbarSize: 6, horizontalScrollbarSize: 6 },
            fixedOverflowWidgets: true,
            find: { addExtraSpaceOnTop: false },
            padding: { top: 16, bottom: 16 },
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          }}
        />
        {/* Placeholder shown when editor is empty */}
        {!value && (
          <div
            className="absolute top-0 left-0 px-[62px] py-4 pointer-events-none font-mono text-sm select-none"
            style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.65' }}
          >
            Paste or type text here…
          </div>
        )}
      </div>

      <div
        className="flex items-center gap-4 px-3 py-1.5 text-xs shrink-0"
        style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-surface)', color: 'var(--text-muted)' }}
      >
        <span>{stats.chars.toLocaleString()} chars</span>
        <span>{stats.words.toLocaleString()} words</span>
        <span>{stats.lines.toLocaleString()} lines</span>
      </div>
    </div>
  )
}
