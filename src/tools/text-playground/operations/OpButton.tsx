import { cn } from '../../../lib/cn'
import { matchesFilter } from '../text-playground.utils'

interface OpButtonProps {
  label: string
  transform: (s: string) => string
  onApply: (transform: (s: string) => string) => void
  filter: string
}

export function OpButton({ label, transform, onApply, filter }: OpButtonProps) {
  if (!matchesFilter(label, filter)) return null

  return (
    <button
      onClick={() => onApply(transform)}
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-all duration-150 cursor-pointer select-none text-xs px-2.5 py-1 h-7',
        'bg-white/5 text-(--text-primary) hover:bg-white/10 border border-white/8 hover:border-white/14',
        'focus-visible:ring-2 focus-visible:ring-(--border-focus) focus-visible:outline-none',
      )}
    >
      {label}
    </button>
  )
}
