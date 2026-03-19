import { useMemo } from 'react'
import { OpButton } from './OpButton'
import { useToast } from '../../../context/ToastContext'
import {
  base64Encode,
  base64Decode,
  urlEncode,
  urlDecode,
  htmlEscape,
  htmlUnescape,
} from '../text-playground.utils'

interface EncodingOpsProps {
  onApply: (transform: (s: string) => string) => void
  filter: string
}

type ShowToast = (msg: string, type?: 'error') => void

function wrapSafe(fn: (s: string) => string, label: string, showToast: ShowToast) {
  return (s: string) => {
    try {
      return fn(s)
    } catch (e) {
      showToast(`${label}: ${e instanceof Error ? e.message : 'Unknown error'}`, 'error')
      return s
    }
  }
}

const BASE_OPS: { label: string; transform: (s: string) => string; safe?: true }[] = [
  { label: 'Base64 Encode', transform: base64Encode },
  { label: 'Base64 Decode', transform: base64Decode, safe: true },
  { label: 'URL Encode',    transform: urlEncode },
  { label: 'URL Decode',    transform: urlDecode,    safe: true },
  { label: 'HTML Escape',   transform: htmlEscape },
  { label: 'HTML Unescape', transform: htmlUnescape },
]

export function EncodingOps({ onApply, filter }: EncodingOpsProps) {
  const { showToast } = useToast()

  const ops = useMemo(
    () => BASE_OPS.map((op) => ({
      ...op,
      transform: op.safe ? wrapSafe(op.transform, op.label, showToast) : op.transform,
    })),
    [showToast],
  )

  return (
    <div className="flex flex-wrap gap-1.5">
      {ops.map(({ label, transform }) => (
        <OpButton
          key={label}
          label={label}
          transform={transform}
          onApply={onApply}
          filter={filter}
        />
      ))}
    </div>
  )
}
