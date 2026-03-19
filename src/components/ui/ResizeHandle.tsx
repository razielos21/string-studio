interface ResizeHandleProps {
  onMouseDown: (e: React.MouseEvent) => void
}

export function ResizeHandle({ onMouseDown }: ResizeHandleProps) {
  return (
    <div
      onMouseDown={onMouseDown}
      className="w-1 shrink-0 relative cursor-col-resize group select-none"
      style={{ background: 'var(--border)' }}
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize panels"
      tabIndex={0}
    >
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: 'var(--accent)' }}
      />
    </div>
  )
}
