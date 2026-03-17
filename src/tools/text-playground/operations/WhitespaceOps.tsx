import { Button } from '../../../components/ui/Button'
import {
  trimEnds,
  collapseSpaces,
  removeBlankLines,
  normalizeLineEndings,
} from '../text-playground.utils'

interface WhitespaceOpsProps {
  onApply: (transform: (s: string) => string) => void
}

export function WhitespaceOps({ onApply }: WhitespaceOpsProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <Button size="sm" onClick={() => onApply(trimEnds)}>Trim ends</Button>
      <Button size="sm" onClick={() => onApply(collapseSpaces)}>Collapse spaces</Button>
      <Button size="sm" onClick={() => onApply(removeBlankLines)}>Remove blank lines</Button>
      <Button size="sm" onClick={() => onApply(normalizeLineEndings)}>Normalize endings</Button>
    </div>
  )
}
