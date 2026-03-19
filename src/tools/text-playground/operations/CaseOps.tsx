import { OpButton } from './OpButton'
import {
  toUpperCase,
  toLowerCase,
  toTitleCase,
  toSentenceCase,
  toCamelCase,
  toSnakeCase,
  toKebabCase,
} from '../text-playground.utils'

interface CaseOpsProps {
  onApply: (transform: (s: string) => string) => void
  filter: string
}

const OPS = [
  { label: 'UPPER',      transform: toUpperCase },
  { label: 'lower',      transform: toLowerCase },
  { label: 'Title',      transform: toTitleCase },
  { label: 'Sentence',   transform: toSentenceCase },
  { label: 'camelCase',  transform: toCamelCase },
  { label: 'snake_case', transform: toSnakeCase },
  { label: 'kebab-case', transform: toKebabCase },
]

export function CaseOps({ onApply, filter }: CaseOpsProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {OPS.map(({ label, transform }) => (
        <OpButton key={label} label={label} transform={transform} onApply={onApply} filter={filter} />
      ))}
    </div>
  )
}
