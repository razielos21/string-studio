import { useMemo } from 'react'
import { Plus, Minus, Equal } from 'lucide-react'
import { computeDiffStats } from './comparator.utils'

interface DiffStatsProps {
  original: string
  modified: string
  ignoreCase?: boolean
}

export function DiffStats({ original, modified, ignoreCase = false }: DiffStatsProps) {
  const stats = useMemo(() => computeDiffStats(original, modified), [original, modified])

  if (!stats) return null

  return (
    <div
      className="flex items-center gap-5 px-3 py-1.5 text-xs shrink-0"
      style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)' }}
      aria-label="Diff statistics"
    >
      {stats.identical ? (
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
