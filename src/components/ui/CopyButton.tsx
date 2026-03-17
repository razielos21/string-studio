import { Check, Copy } from 'lucide-react'
import { useClipboard } from '../../hooks/useClipboard'
import { Button } from './Button'
import { cn } from '../../lib/cn'

interface CopyButtonProps {
  text: string
  className?: string
  size?: 'sm' | 'md'
}

export function CopyButton({ text, className, size = 'sm' }: CopyButtonProps) {
  const { copied, copy } = useClipboard()

  return (
    <Button
      variant="default"
      size={size}
      onClick={() => copy(text)}
      className={cn(className)}
      title="Copy to clipboard"
    >
      {copied ? (
        <>
          <Check size={12} className="text-[var(--success)]" />
          Copied
        </>
      ) : (
        <>
          <Copy size={12} />
          Copy
        </>
      )}
    </Button>
  )
}
