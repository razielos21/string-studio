import { useMemo } from 'react'
import Editor from '@monaco-editor/react'
import { type Language } from './comparator.utils'
import { getStats } from '../text-playground/text-playground.utils'

interface InputPanelProps {
  label: string
  value: string
  onChange: (value: string) => void
  language: Language
}

export function InputPanel({ label, value, onChange, language }: InputPanelProps) {
  const stats = useMemo(() => getStats(value), [value])

  return (
    <div className="flex flex-col flex-1 min-h-0 min-w-0">
      <div
        className="px-3 py-1.5 text-[11px] font-medium tracking-wide uppercase shrink-0"
        style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)' }}
      >
        {label}
      </div>

      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          language={language}
          theme="vs-dark"
          value={value}
          onChange={(v) => onChange(v ?? '')}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            wordWrap: 'off',
            scrollbar: { verticalScrollbarSize: 6, horizontalScrollbarSize: 6 },
            renderLineHighlight: 'line',
          }}
        />
      </div>

      <div
        className="flex items-center gap-4 px-3 py-1.5 text-xs shrink-0"
        style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-surface)', color: 'var(--text-muted)' }}
      >
        <span>{stats.chars.toLocaleString()} chars</span>
        <span>{stats.lines.toLocaleString()} lines</span>
      </div>
    </div>
  )
}
