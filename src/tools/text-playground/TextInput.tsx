import { useMemo } from 'react'
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
        style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)' }}
      >
        Input
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste or type text here…"
        spellCheck={false}
        className="flex-1 w-full resize-none font-mono p-4 focus:outline-none"
        style={{
          background: 'var(--bg-base)',
          color: 'var(--text-primary)',
          fontSize: '14px',
          lineHeight: '1.65',
        }}
      />
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
