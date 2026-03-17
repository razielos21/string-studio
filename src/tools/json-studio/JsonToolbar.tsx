import { Wand2, Minimize2, Trash2, Zap } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { CopyButton } from '../../components/ui/CopyButton'
import { Select } from '../../components/ui/Select'

interface JsonToolbarProps {
  onFormat: () => void
  onFix: () => void
  onMinify: () => void
  onClear: () => void
  output: string
  indent: 2 | 4
  onIndentChange: (v: 2 | 4) => void
}

const indentOptions = [
  { value: '2', label: '2 spaces' },
  { value: '4', label: '4 spaces' },
]

export function JsonToolbar({
  onFormat,
  onFix,
  onMinify,
  onClear,
  output,
  indent,
  onIndentChange,
}: JsonToolbarProps) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-3 border-b border-[var(--border)] bg-[var(--bg-surface)] flex-wrap">
      <Button onClick={onFormat} size="md">
        <Wand2 size={14} />
        Format
      </Button>
      <Button onClick={onFix} size="md">
        <Zap size={14} />
        Fix
      </Button>
      <Button onClick={onMinify} size="md">
        <Minimize2 size={14} />
        Minify
      </Button>

      <div className="w-px h-5 bg-[var(--border)] mx-1" />

      <Select
        label="Indent"
        value={String(indent)}
        options={indentOptions}
        onChange={(e) => onIndentChange(Number(e.target.value) as 2 | 4)}
      />

      <div className="flex-1" />

      {output && <CopyButton text={output} size="md" />}
      <Button variant="ghost" size="md" onClick={onClear} title="Clear">
        <Trash2 size={14} />
        Clear
      </Button>
    </div>
  )
}
