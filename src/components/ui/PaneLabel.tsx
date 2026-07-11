import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { PANE_LABEL } from '../../lib/styles'

interface PaneLabelProps {
  rgb: string
  className?: string
  children: ReactNode
}

export function PaneLabel({ rgb, className, children }: PaneLabelProps) {
  return (
    <div
      className={cn(PANE_LABEL, className)}
      style={{
        color: 'var(--text-muted)',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-surface)',
        borderLeft: `2px solid rgba(${rgb},0.35)`,
      }}
    >
      {children}
    </div>
  )
}
