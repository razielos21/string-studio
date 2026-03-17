import { useMemo } from 'react'
import { CopyButton } from '../../components/ui/CopyButton'
import { getStats } from './text-playground.utils'

interface TextOutputProps {
  value: string | null
}

export function TextOutput({ value }: TextOutputProps) {
  const stats = useMemo(() => getStats(value ?? ''), [value])

  return (
    <div className="flex flex-col h-full min-h-0">
      <div
        className="flex items-center justify-between px-3 py-1.5 shrink-0"
        style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)' }}
      >
        <span
          className="text-[11px] font-medium tracking-wide uppercase"
          style={{ color: 'var(--text-muted)' }}
        >
          Output
        </span>
        {value !== null && <CopyButton text={value} />}
      </div>

      {value !== null ? (
        <pre
          className="flex-1 w-full overflow-auto font-mono p-4 m-0 whitespace-pre-wrap break-words"
          style={{
            background: 'var(--bg-base)',
            color: 'var(--text-primary)',
            fontSize: '14px',
            lineHeight: '1.65',
          }}
        >
          {value}
        </pre>
      ) : (
        <div
          className="flex-1 flex items-center justify-center text-sm"
          style={{ color: 'var(--text-muted)' }}
        >
          Apply an operation to see output
        </div>
      )}

      {value !== null && (
        <div
          className="flex items-center gap-4 px-3 py-1.5 text-xs shrink-0"
          style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-surface)', color: 'var(--text-muted)' }}
        >
          <span>{stats.chars.toLocaleString()} chars</span>
          <span>{stats.words.toLocaleString()} words</span>
          <span>{stats.lines.toLocaleString()} lines</span>
        </div>
      )}
    </div>
  )
}
