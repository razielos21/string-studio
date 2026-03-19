import { OpButton } from './OpButton'
import {
  trimEnds,
  collapseSpaces,
  removeBlankLines,
  normalizeLineEndings,
} from '../text-playground.utils'

interface WhitespaceOpsProps {
  onApply: (transform: (s: string) => string) => void
  filter: string
}

const OPS = [
  { label: 'Trim ends',         transform: trimEnds },
  { label: 'Collapse spaces',   transform: collapseSpaces },
  { label: 'Remove blank lines',transform: removeBlankLines },
  { label: 'Normalize endings', transform: normalizeLineEndings },
]

export function WhitespaceOps({ onApply, filter }: WhitespaceOpsProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {OPS.map(({ label, transform }) => (
        <OpButton key={label} label={label} transform={transform} onApply={onApply} filter={filter} />
      ))}
    </div>
  )
}
