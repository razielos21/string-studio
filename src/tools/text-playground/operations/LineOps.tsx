import { Button } from '../../../components/ui/Button'
import {
  sortLinesAZ,
  sortLinesZA,
  removeDuplicateLines,
  reverseLines,
  addLineNumbers,
} from '../text-playground.utils'

interface LineOpsProps {
  onApply: (transform: (s: string) => string) => void
}

export function LineOps({ onApply }: LineOpsProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <Button size="sm" onClick={() => onApply(sortLinesAZ)}>Sort A→Z</Button>
      <Button size="sm" onClick={() => onApply(sortLinesZA)}>Sort Z→A</Button>
      <Button size="sm" onClick={() => onApply(removeDuplicateLines)}>Remove dupes</Button>
      <Button size="sm" onClick={() => onApply(reverseLines)}>Reverse</Button>
      <Button size="sm" onClick={() => onApply(addLineNumbers)}>Add line #s</Button>
    </div>
  )
}
