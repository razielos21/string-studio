import { OpButton } from './OpButton'
import {
  sortLinesAZ,
  sortLinesZA,
  removeDuplicateLines,
  reverseLines,
  addLineNumbers,
} from '../text-playground.utils'

interface LineOpsProps {
  onApply: (transform: (s: string) => string) => void
  filter: string
}

const OPS = [
  { label: 'Sort A→Z',      transform: sortLinesAZ },
  { label: 'Sort Z→A',      transform: sortLinesZA },
  { label: 'Remove dupes',  transform: removeDuplicateLines },
  { label: 'Reverse',       transform: reverseLines },
  { label: 'Add line #s',   transform: addLineNumbers },
]

export function LineOps({ onApply, filter }: LineOpsProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {OPS.map(({ label, transform }) => (
        <OpButton key={label} label={label} transform={transform} onApply={onApply} filter={filter} />
      ))}
    </div>
  )
}
