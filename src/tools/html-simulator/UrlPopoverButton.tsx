import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Button } from '../../components/ui/Button'
import { ToolbarButton } from './ToolbarButton'

interface UrlPopoverButtonProps {
  icon: ReactNode
  title: string
  placeholder: string
  disabled?: boolean
  onConfirm: (url: string) => void
}

export function UrlPopoverButton({ icon, title, placeholder, disabled, onConfirm }: UrlPopoverButtonProps) {
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus())
  }, [open])

  const confirm = () => {
    const trimmed = url.trim()
    if (trimmed) onConfirm(trimmed)
    setOpen(false)
    setUrl('')
  }

  return (
    <div className="relative">
      <ToolbarButton active={open} disabled={disabled && !open} onClick={() => setOpen((v) => !v)} title={title}>
        {icon}
      </ToolbarButton>
      {open && (
        <div
          className="absolute top-full left-0 mt-1 z-10 flex items-center gap-1.5 p-2 rounded-md"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
        >
          <input
            ref={inputRef}
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                confirm()
              }
              if (e.key === 'Escape') setOpen(false)
            }}
            placeholder={placeholder}
            className="text-xs px-2 py-1 rounded h-7 w-48 outline-none"
            style={{ background: 'var(--bg-base)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
          />
          <Button size="sm" variant="accent" onClick={confirm}>
            Insert
          </Button>
        </div>
      )}
    </div>
  )
}
