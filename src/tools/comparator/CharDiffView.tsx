import { diffChars } from 'diff'
import { useMemo } from 'react'

interface CharDiffViewProps {
  original: string
  modified: string
  inline: boolean
}

const PRE = 'flex-1 min-h-0 overflow-auto p-4 font-mono text-[13px] leading-relaxed whitespace-pre-wrap break-all'

export function CharDiffView({ original, modified, inline }: CharDiffViewProps) {
  const changes = useMemo(() => diffChars(original, modified), [original, modified])

  if (inline) {
    return (
      <div className="flex-1 min-h-0 overflow-auto" style={{ background: 'var(--bg-base)' }}>
        <pre className={PRE} style={{ background: 'var(--bg-base)' }}>
          {changes.map((change, i) => {
            if (change.added)
              return (
                <span
                  key={i}
                  style={{ background: 'rgba(16,185,129,0.18)', color: 'var(--success)', textDecoration: 'underline' }}
                >
                  {change.value}
                </span>
              )
            if (change.removed)
              return (
                <span
                  key={i}
                  style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--error)', textDecoration: 'line-through' }}
                >
                  {change.value}
                </span>
              )
            return (
              <span key={i} style={{ color: 'var(--text-primary)' }}>
                {change.value}
              </span>
            )
          })}
        </pre>
      </div>
    )
  }

  // Side-by-side: left shows original with removed chars highlighted, right shows modified with added chars highlighted
  return (
    <div className="flex flex-1 min-h-0" style={{ background: 'var(--bg-base)' }}>
      <pre className={PRE} style={{ background: 'var(--bg-base)', borderRight: '1px solid var(--border)' }}>
        {changes
          .filter((c) => !c.added)
          .map((change, i) =>
            change.removed ? (
              <span key={i} style={{ background: 'rgba(239,68,68,0.2)', color: 'var(--error)' }}>
                {change.value}
              </span>
            ) : (
              <span key={i} style={{ color: 'var(--text-primary)' }}>
                {change.value}
              </span>
            ),
          )}
      </pre>
      <pre className={PRE} style={{ background: 'var(--bg-base)' }}>
        {changes
          .filter((c) => !c.removed)
          .map((change, i) =>
            change.added ? (
              <span key={i} style={{ background: 'rgba(16,185,129,0.2)', color: 'var(--success)' }}>
                {change.value}
              </span>
            ) : (
              <span key={i} style={{ color: 'var(--text-primary)' }}>
                {change.value}
              </span>
            ),
          )}
      </pre>
    </div>
  )
}
