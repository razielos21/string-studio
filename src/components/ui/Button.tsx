import { cn } from '../../lib/cn'
import { type ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'accent'
  size?: 'sm' | 'md'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition-all duration-150 focus-visible:ring-2 focus-visible:ring-(--border-focus) focus-visible:outline-none disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer select-none',
          variant === 'default' &&
            'bg-white/5 text-(--text-primary) hover:bg-white/10 border border-white/8 hover:border-white/14',
          variant === 'ghost' &&
            'text-(--text-secondary) hover:bg-white/6 hover:text-(--text-primary)',
          variant === 'accent' &&
            'bg-(--accent) text-white hover:bg-(--accent-hover) shadow-[0_0_16px_var(--accent-glow)]',
          size === 'sm' && 'text-xs px-2.5 py-1 h-7 gap-1',
          size === 'md' && 'text-sm px-3 py-1.5 h-8',
          className,
        )}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'
