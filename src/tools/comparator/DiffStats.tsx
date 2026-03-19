import { diffLines } from 'diff'
import { useMemo } from 'react'
import { Plus, Minus, Equal } from 'lucide-react'

interface DiffStatsProps {
  original: string
  modified: string
  ignoreCase?: boolean
}

export function DiffStats({ original, modified, ignoreCase = false }: DiffStatsProps) {
  const stats = useMemo(() => {
    if (!original && !modified) return null
    const changes = diffLines(original, modified)
    let added = 0, removed = 0, unchanged = 0
    for (const c of changes) {
      const n = c.count ?? 0
      if (c.added) added += n
      else if (c.removed) removed += n
      else unchanged += n
    }
    return { added, removed, unchanged }
  }, [original, modified])

  if (!stats) return null
  const isIdentical = stats.added === 0 && stats.removed === 0

  return (
    <div
      className="flex items-center gap-5 px-3 py-1.5 text-xs shrink-0"
      style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)' }}
      aria-label="Diff statistics"
    >
      {isIdentical ? (
        <span className="flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
          <Equal size={11} aria-hidden />
          <span>Files are identical</span>
        </span>
      ) : (
        <>
          <span
            className="flex items-center gap-1.5 font-medium"
            style={{ color: 'var(--success)' }}
            title={`${stats.added} lines added`}
          >
            <Plus size={11} aria-hidden />
            <span aria-label={`${stats.added} lines added`}>+{stats.added} added</span>
          </span>
          <span
            className="flex items-center gap-1.5 font-medium"
            style={{ color: 'var(--error)' }}
            title={`${stats.removed} lines removed`}
          >
            <Minus size={11} aria-hidden />
            <span aria-label={`${stats.removed} lines removed`}>−{stats.removed} removed</span>
          </span>
          <span
            className="flex items-center gap-1.5"
            style={{ color: 'var(--text-muted)' }}
            title={`${stats.unchanged} lines unchanged`}
          >
            <Equal size={11} aria-hidden />
            <span aria-label={`${stats.unchanged} lines unchanged`}>{stats.unchanged} unchanged</span>
          </span>
          {ignoreCase && (
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-full ml-1"
              style={{
                background: 'var(--accent-subtle-bg)',
                color: 'var(--accent-hover)',
                border: '1px solid var(--accent-subtle-border)',
              }}
            >
              case-insensitive
            </span>
          )}
        </>
      )}
    </div>
  )
}
