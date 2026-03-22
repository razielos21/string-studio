import { Share2, Check } from 'lucide-react'
import { useClipboard } from '../../hooks/useClipboard'
import { Button } from './Button'
import { buildShareUrl } from '../../lib/shareUrl'

interface ShareButtonProps {
  getData: () => unknown
  size?: 'sm' | 'md'
}

export function ShareButton({ getData, size = 'md' }: ShareButtonProps) {
  const { copied, copy } = useClipboard()

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={() => copy(buildShareUrl(getData()))}
      title="Copy shareable link"
    >
      {copied ? <Check size={13} /> : <Share2 size={13} />}
      {copied ? 'Copied!' : 'Share'}
    </Button>
  )
}
