import { type ReactNode, useState } from 'react'
import { cn } from '../../lib/cn'

interface TooltipProps {
  content: string
  children: ReactNode
  className?: string
}

export function Tooltip({ content, children, className }: TooltipProps) {
  const [visible, setVisible] = useState(false)

  return (
    <div
      className={cn('relative inline-flex', className)}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div role="tooltip" className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 text-xs bg-[var(--bg-hover)] text-[var(--text-primary)] rounded border border-[var(--border)] whitespace-nowrap pointer-events-none z-50">
          {content}
        </div>
      )}
    </div>
  )
}
