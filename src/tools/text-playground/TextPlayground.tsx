import { useCallback, useState } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { useKeyboardShortcut } from '../../hooks/useKeyboardShortcut'
import { TextInput } from './TextInput'
import { TextOutput } from './TextOutput'
import { OperationsPanel } from './OperationsPanel'
import { Button } from '../../components/ui/Button'
import { RotateCcw, Trash2, Undo2 } from 'lucide-react'

const MAX_HISTORY = 50

export function TextPlayground() {
  const [input, setInput] = useLocalStorage('ss:text:input', '')
  const [output, setOutput] = useState<string | null>(null)
  // Undo stack stores previous output states
  const [history, setHistory] = useState<(string | null)[]>([])

  const handleApply = useCallback(
    (transform: (s: string) => string) => {
      const source = output !== null ? output : input
      const next = transform(source)
      if (next === source) return
      setHistory((h) => [...h.slice(-MAX_HISTORY + 1), output])
      setOutput(next)
    },
    [input, output],
  )

  const handleUndo = useCallback(() => {
    setHistory((h) => {
      if (h.length === 0) return h
      const prev = h[h.length - 1]
      setOutput(prev)
      return h.slice(0, -1)
    })
  }, [])

  const handleReset = useCallback(() => {
    setHistory([])
    setOutput(null)
  }, [])

  const handleClear = useCallback(() => {
    setInput('')
    setHistory([])
    setOutput(null)
  }, [setInput])

  useKeyboardShortcut('z', handleUndo, { alt: true })
  useKeyboardShortcut('r', handleReset, { alt: true })

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
          <Button
            variant="ghost"
            size="sm"
            onClick={handleUndo}
            disabled={history.length === 0}
            title="Undo last operation (Alt+Z)"
          >
            <Undo2 size={11} />
            Undo
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            disabled={output === null}
            title="Reset output (Alt+R)"
          >
            <RotateCcw size={11} />
            Reset
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            disabled={!input && output === null}
            title="Clear all"
          >
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
