import { Button } from '../../../components/ui/Button'
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
}

export function CaseOps({ onApply }: CaseOpsProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <Button size="sm" onClick={() => onApply(toUpperCase)}>UPPER</Button>
      <Button size="sm" onClick={() => onApply(toLowerCase)}>lower</Button>
      <Button size="sm" onClick={() => onApply(toTitleCase)}>Title</Button>
      <Button size="sm" onClick={() => onApply(toSentenceCase)}>Sentence</Button>
      <Button size="sm" onClick={() => onApply(toCamelCase)}>camelCase</Button>
      <Button size="sm" onClick={() => onApply(toSnakeCase)}>snake_case</Button>
      <Button size="sm" onClick={() => onApply(toKebabCase)}>kebab-case</Button>
    </div>
  )
}
