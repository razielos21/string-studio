import { useState, useCallback } from 'react'
import { Braces } from 'lucide-react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { useKeyboardShortcut } from '../../hooks/useKeyboardShortcut'
import { useResizable } from '../../hooks/useResizable'
import { ResizeHandle } from '../../components/ui/ResizeHandle'
import { Kbd } from '../../components/ui/Kbd'
import { JsonEditor } from './JsonEditor'
import { JsonOutput } from './JsonOutput'
import { JsonToolbar } from './JsonToolbar'
import { JsonErrorBanner } from './JsonErrorBanner'
import { formatJson, fixJson, minifyJson, validateJson } from './json-studio.utils'

const PANE_LABEL = 'px-3 py-1.5 text-[11px] font-medium tracking-wide uppercase'

interface MinifyStats {
  originalBytes: number
  minifiedBytes: number
}

export function JsonStudio() {
  const [input, setInput] = useLocalStorage('ss:json:input', '')
  const [output, setOutput] = useState('')
  const [indent, setIndent] = useState<2 | 4>(2)
  const [error, setError] = useState<{ message: string; line?: number; col?: number } | null>(null)
  const [minifyStats, setMinifyStats] = useState<MinifyStats | null>(null)
  const { percent, containerRef, startDrag } = useResizable(50)

  const handleInputChange = useCallback(
    (value: string) => {
      setInput(value)
      setMinifyStats(null)
      if (value.trim()) setError(validateJson(value))
      else setError(null)
    },
    [setInput],
  )

  const applyTransform = useCallback(
    (r: { output: string; error?: string | null }, isMinify = false) => {
      if (r.error) {
        setError({ message: r.error })
      } else {
        if (isMinify && r.output) {
          const enc = new TextEncoder()
          setMinifyStats({
            originalBytes: enc.encode(input).length,
            minifiedBytes: enc.encode(r.output).length,
          })
        } else {
          setMinifyStats(null)
        }
        setOutput(r.output)
        setError(null)
      }
    },
    [input],
  )

  const handleFormat = useCallback(() => applyTransform(formatJson(input, indent)),        [input, indent, applyTransform])
  const handleFix    = useCallback(() => applyTransform(fixJson(input, indent)),           [input, indent, applyTransform])
  const handleMinify = useCallback(() => applyTransform(minifyJson(input), true),          [input, applyTransform])

  const handleClear = useCallback(() => {
    setInput('')
    setOutput('')
    setError(null)
    setMinifyStats(null)
  }, [setInput])

  useKeyboardShortcut('f', handleFormat, { alt: true })
  useKeyboardShortcut('x', handleFix,    { alt: true })
  useKeyboardShortcut('m', handleMinify, { alt: true })

  const savings = minifyStats
    ? Math.round((1 - minifyStats.minifiedBytes / minifyStats.originalBytes) * 100)
    : null

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

      <div ref={containerRef} className="flex flex-1 min-h-0">
        {/* Input pane */}
        <div
          className="flex flex-col min-h-0 min-w-0"
          style={{ width: `${percent}%` }}
        >
          <div
            className={PANE_LABEL}
            style={{
              color: 'var(--text-muted)',
              borderBottom: '1px solid var(--border)',
              background: 'var(--bg-surface)',
              borderLeft: '2px solid rgba(16,185,129,0.35)',
            }}
          >
            Input
          </div>
          <JsonEditor value={input} onChange={handleInputChange} />
        </div>

        <ResizeHandle onMouseDown={startDrag} />

        {/* Output pane */}
        <div
          className="flex flex-col min-h-0 min-w-0"
          style={{ width: `${100 - percent}%` }}
        >
          <div
            className={`${PANE_LABEL} flex items-center justify-between`}
            style={{
              color: 'var(--text-muted)',
              borderBottom: '1px solid var(--border)',
              background: 'var(--bg-surface)',
              borderLeft: '2px solid rgba(16,185,129,0.35)',
            }}
          >
            <span>Output</span>
            {savings !== null && minifyStats && (
              <span
                className="text-[10px] font-medium px-1.5 py-0.5 rounded-full normal-case tracking-normal"
                style={{
                  background: 'rgba(16,185,129,0.12)',
                  color: 'var(--success)',
                  border: '1px solid rgba(16,185,129,0.25)',
                }}
                title={`${minifyStats.originalBytes} → ${minifyStats.minifiedBytes} bytes`}
              >
                {savings}% smaller · {minifyStats.minifiedBytes.toLocaleString()}B
              </span>
            )}
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
                <p className="text-xs mt-1 flex items-center justify-center gap-1.5 flex-wrap" style={{ color: 'var(--text-muted)' }}>
                  <Kbd>Alt+F</Kbd> Format
                  <Kbd>Alt+X</Kbd> Fix
                  <Kbd>Alt+M</Kbd> Minify
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
