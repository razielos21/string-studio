import { diffChars, diffWords } from 'diff'
import { useMemo } from 'react'

interface CharDiffViewProps {
  original: string
  modified: string
  inline: boolean
  granularity: 'word' | 'char'
}

const PRE = 'flex-1 min-h-0 overflow-auto p-4 font-mono text-[13px] leading-relaxed whitespace-pre-wrap break-words'

const S = {
  added:     { background: 'rgba(16,185,129,0.18)', color: 'var(--success)', textDecoration: 'underline' },
  removed:   { background: 'rgba(239,68,68,0.15)',  color: 'var(--error)',   textDecoration: 'line-through' },
  plain:     { color: 'var(--text-primary)' },
  addedSbs:  { background: 'rgba(16,185,129,0.2)',  color: 'var(--success)', borderBottom: '1px solid rgba(16,185,129,0.5)', borderRadius: '2px' },
  removedSbs:{ background: 'rgba(239,68,68,0.2)',   color: 'var(--error)',   borderBottom: '1px solid rgba(239,68,68,0.5)',  borderRadius: '2px' },
} as const

export function CharDiffView({ original, modified, inline, granularity }: CharDiffViewProps) {
  const changes = useMemo(
    () => granularity === 'char' ? diffChars(original, modified) : diffWords(original, modified),
    [original, modified, granularity],
  )

  if (inline) {
    return (
      <div className="flex-1 min-h-0 overflow-auto" style={{ background: 'var(--bg-base)' }}>
        <pre className={PRE} style={{ background: 'var(--bg-base)' }}>
          {changes.map((change, i) => (
            <span key={i} style={change.added ? S.added : change.removed ? S.removed : S.plain}>
              {change.value}
            </span>
          ))}
        </pre>
      </div>
    )
  }

  return (
    <div className="flex flex-1 min-h-0" style={{ background: 'var(--bg-base)' }}>
      <pre className={PRE} style={{ background: 'var(--bg-base)', borderRight: '1px solid var(--border)' }}>
        {changes.map((change, i) =>
          change.added ? null : (
            <span key={i} style={change.removed ? S.removedSbs : S.plain}>
              {change.value}
            </span>
          ),
        )}
      </pre>
      <pre className={PRE} style={{ background: 'var(--bg-base)' }}>
        {changes.map((change, i) =>
          change.removed ? null : (
            <span key={i} style={change.added ? S.addedSbs : S.plain}>
              {change.value}
            </span>
          ),
        )}
      </pre>
    </div>
  )
}
