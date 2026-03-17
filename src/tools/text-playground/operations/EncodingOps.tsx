import { Button } from '../../../components/ui/Button'
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
}

export function EncodingOps({ onApply }: EncodingOpsProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <Button size="sm" onClick={() => onApply(base64Encode)}>Base64 Encode</Button>
      <Button size="sm" onClick={() => onApply(base64Decode)}>Base64 Decode</Button>
      <Button size="sm" onClick={() => onApply(urlEncode)}>URL Encode</Button>
      <Button size="sm" onClick={() => onApply(urlDecode)}>URL Decode</Button>
      <Button size="sm" onClick={() => onApply(htmlEscape)}>HTML Escape</Button>
      <Button size="sm" onClick={() => onApply(htmlUnescape)}>HTML Unescape</Button>
    </div>
  )
}
