import { type ReactNode } from 'react'
import { Button } from '../../components/ui/Button'
import { activeAccentStyle } from '../../lib/styles'

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
      style={active ? activeAccentStyle('#06b6d4', '6,182,212') : undefined}
    >
      {children}
    </Button>
  )
}
