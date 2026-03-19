import { useCallback, useState } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { TextInput } from './TextInput'
import { TextOutput } from './TextOutput'
import { OperationsPanel } from './OperationsPanel'
import { Button } from '../../components/ui/Button'
import { RotateCcw, Trash2 } from 'lucide-react'

export function TextPlayground() {
  const [input, setInput] = useLocalStorage('ss:text:input', '')
  const [output, setOutput] = useState<string | null>(null)

  const handleApply = useCallback(
    (transform: (s: string) => string) => {
      const source = output !== null ? output : input
      setOutput(transform(source))
    },
    [input, output],
  )

  const handleReset = useCallback(() => setOutput(null), [])
  const handleClear = useCallback(() => { setInput(''); setOutput(null) }, [setInput])

  return (
    <div className="flex h-full overflow-hidden animate-fade-up" style={{ background: 'var(--bg-base)' }}>
      {/* Main area */}
      <div className="flex flex-col flex-1 min-h-0 min-w-0">
        {/* Info bar */}
        <div
          className="flex items-center gap-2 px-4 py-3 shrink-0"
          style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)' }}
        >
          <span className="text-sm flex-1" style={{ color: 'var(--text-muted)' }}>
            Operations chain on the output — click <strong style={{ color: 'var(--text-secondary)' }}>Reset</strong> to start fresh from input.
          </span>
          <Button variant="ghost" size="sm" onClick={handleReset} disabled={output === null}>
            <RotateCcw size={11} />
            Reset
          </Button>
          <Button variant="ghost" size="sm" onClick={handleClear} disabled={!input && output === null} title="Clear all">
            <Trash2 size={11} />
            Clear
          </Button>
        </div>

        {/* Editors */}
        <div className="flex flex-1 min-h-0">
          <div className="flex-1 min-h-0 min-w-0" style={{ borderRight: '1px solid var(--border)' }}>
            <TextInput value={input} onChange={setInput} />
          </div>
          <div className="flex-1 min-h-0 min-w-0">
            <TextOutput value={output} />
          </div>
        </div>
      </div>

      <OperationsPanel onApply={handleApply} />
    </div>
  )
}
