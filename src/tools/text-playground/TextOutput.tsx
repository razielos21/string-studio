import { useMemo } from 'react'
import { Type } from 'lucide-react'
import Editor from '@monaco-editor/react'
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
        style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)', borderLeft: '2px solid rgba(245,158,11,0.35)' }}
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
        <div className="flex-1 min-h-0">
          <Editor
            height="100%"
            language="plaintext"
            theme="vs-dark"
            value={value}
            options={{
              readOnly: true,
              domReadOnly: true,
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
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}
          >
            <Type size={22} style={{ color: 'rgba(245,158,11,0.5)' }} />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>No output yet</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Apply an operation from the panel</p>
          </div>
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
