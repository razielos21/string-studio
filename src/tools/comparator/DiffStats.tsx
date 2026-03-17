import { diffLines } from 'diff'
import { useMemo } from 'react'
import { Plus, Minus, Equal } from 'lucide-react'

interface DiffStatsProps {
  original: string
  modified: string
}

export function DiffStats({ original, modified }: DiffStatsProps) {
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
    >
      {isIdentical ? (
        <span className="flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
          <Equal size={11} /> Files are identical
        </span>
      ) : (
        <>
          <span className="flex items-center gap-1.5 font-medium" style={{ color: 'var(--success)' }}>
            <Plus size={11} /> {stats.added} added
          </span>
          <span className="flex items-center gap-1.5 font-medium" style={{ color: 'var(--error)' }}>
            <Minus size={11} /> {stats.removed} removed
          </span>
          <span className="flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
            <Equal size={11} /> {stats.unchanged} unchanged
          </span>
        </>
      )}
    </div>
  )
}
