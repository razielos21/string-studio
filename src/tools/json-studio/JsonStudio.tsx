import { useState, useCallback } from 'react'
import { Braces } from 'lucide-react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { JsonEditor } from './JsonEditor'
import { JsonOutput } from './JsonOutput'
import { JsonToolbar } from './JsonToolbar'
import { JsonErrorBanner } from './JsonErrorBanner'
import { formatJson, fixJson, minifyJson, validateJson } from './json-studio.utils'

const PANE_LABEL = 'px-3 py-1.5 text-[11px] font-medium tracking-wide uppercase'

export function JsonStudio() {
  const [input, setInput] = useLocalStorage('ss:json:input', '')
  const [output, setOutput] = useState('')
  const [indent, setIndent] = useState<2 | 4>(2)
  const [error, setError] = useState<{ message: string; line?: number; col?: number } | null>(null)

  const handleInputChange = useCallback(
    (value: string) => {
      setInput(value)
      if (value.trim()) setError(validateJson(value))
      else setError(null)
    },
    [setInput],
  )

  const applyTransform = useCallback(
    (r: { output: string; error?: string | null }) => {
      if (r.error) {
        setError({ message: r.error })
      } else {
        setOutput(r.output)
        setError(null)
      }
    },
    [],
  )

  const handleFormat = useCallback(() => applyTransform(formatJson(input, indent)), [input, indent, applyTransform])
  const handleFix    = useCallback(() => applyTransform(fixJson(input, indent)),    [input, indent, applyTransform])
  const handleMinify = useCallback(() => applyTransform(minifyJson(input)),         [input, applyTransform])

  const handleClear = useCallback(() => {
    setInput('')
    setOutput('')
    setError(null)
  }, [setInput])

  return (
    <div className="flex flex-col h-full overflow-hidden animate-fade-up" style={{ background: 'var(--bg-base)' }}>
      <JsonToolbar
        onFormat={handleFormat}
        onFix={handleFix}
        onMinify={handleMinify}
        onClear={handleClear}
        output={output}
        indent={indent}
        onIndentChange={setIndent}
      />

      {error && (
        <div className="px-3 pt-2.5 shrink-0">
          <JsonErrorBanner error={error} />
        </div>
      )}

      <div className="flex flex-1 min-h-0">
        {/* Input pane */}
        <div className="flex flex-col flex-1 min-h-0 min-w-0" style={{ borderRight: '1px solid var(--border)' }}>
          <div className={PANE_LABEL} style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)', borderLeft: '2px solid rgba(16,185,129,0.35)' }}>
            Input
          </div>
          <JsonEditor value={input} onChange={handleInputChange} />
        </div>

        {/* Output pane */}
        <div className="flex flex-col flex-1 min-h-0 min-w-0">
          <div className={PANE_LABEL} style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)', borderLeft: '2px solid rgba(16,185,129,0.35)' }}>
            Output
          </div>
          {output ? (
            <JsonOutput value={output} />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}
              >
                <Braces size={22} style={{ color: 'rgba(16,185,129,0.5)' }} />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>No output yet</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Format, Fix, or Minify to see result</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
