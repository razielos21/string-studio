import { cn } from '../../lib/cn'
import { type SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[]
  label?: string
}

export function Select({ options, label, className, ...props }: SelectProps) {
  return (
    <div className="flex items-center gap-2">
      {label && (
        <span className="text-xs whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
          {label}
        </span>
      )}
      <select
        className={cn(
          'bg-[var(--bg-elevated)] text-[var(--text-primary)] rounded-md text-xs px-2 py-1 h-7 focus:outline-none focus:ring-1 focus:ring-[var(--border-focus)] cursor-pointer transition-colors',
          className,
        )}
        style={{ border: '1px solid var(--border)' }}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} style={{ background: 'var(--bg-elevated)' }}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
