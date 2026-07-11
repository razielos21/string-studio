import { type ReactNode } from 'react'
import { Button } from '../../components/ui/Button'

interface ToolbarButtonProps {
  active?: boolean
  disabled?: boolean
  onClick: () => void
  title: string
  children: ReactNode
}

export function ToolbarButton({ active, disabled, onClick, title, children }: ToolbarButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      aria-pressed={active}
      disabled={disabled}
      title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      style={
        active
          ? ({ color: '#06b6d4', background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.25)' } as React.CSSProperties)
          : undefined
      }
    >
      {children}
    </Button>
  )
}
