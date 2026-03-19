import { useState, useCallback, useEffect, useMemo } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { useKeyboardShortcut } from '../../hooks/useKeyboardShortcut'
import { InputPanel } from './InputPanel'
import { DiffView } from './DiffView'
import { DiffStats } from './DiffStats'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/Button'
import { detectLanguage, LANGUAGE_OPTIONS, type Language } from './comparator.utils'
import { Columns2, AlignLeft, Trash2 } from 'lucide-react'

export function Comparator() {
  const [left, setLeft] = useLocalStorage('ss:comparator:left', '')
  const [right, setRight] = useLocalStorage('ss:comparator:right', '')
  const [language, setLanguage] = useState<Language>('plaintext')
  const [autoDetect, setAutoDetect] = useState(true)
  const [inline, setInline] = useState(false)
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false)
  const [ignoreCase, setIgnoreCase] = useState(false)
  const [mode, setMode] = useState<'input' | 'diff'>('input')

  useEffect(() => {
    if (autoDetect) setLanguage(detectLanguage(left || right))
  }, [left, right, autoDetect])

  const handleToggleMode = useCallback(() => setMode((m) => m === 'input' ? 'diff' : 'input'), [])
  const handleClear = useCallback(() => { setLeft(''); setRight(''); setMode('input') }, [setLeft, setRight])

  const handleLanguageChange = useCallback((lang: Language) => {
    setLanguage(lang)
    setAutoDetect(false)
  }, [])

  useKeyboardShortcut('Enter', handleToggleMode, { alt: true })
  useKeyboardShortcut('i', () => setInline((v) => !v), { alt: true })

  // Normalize once for ignoreCase so DiffStats and DiffView share the same values
  const [diffLeft, diffRight] = useMemo(
    () => ignoreCase ? [left.toLowerCase(), right.toLowerCase()] : [left, right],
    [left, right, ignoreCase],
  )

  return (
    <div className="flex flex-col h-full overflow-hidden animate-fade-up" style={{ background: 'var(--bg-base)' }}>
      {/* Toolbar */}
      <div
        className="flex items-center gap-2.5 px-4 py-3 flex-wrap shrink-0"
        style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)' }}
      >
        <Select
          label="Language"
          value={autoDetect ? 'auto' : language}
          options={[
            { value: 'auto', label: 'Auto-detect' },
            ...LANGUAGE_OPTIONS,
          ]}
          onChange={(e) => {
            e.target.value === 'auto' ? setAutoDetect(true) : handleLanguageChange(e.target.value as Language)
          }}
        />
        {autoDetect && (
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{
              background: 'var(--accent-subtle-bg)',
              color: 'var(--accent-hover)',
              border: '1px solid var(--accent-subtle-border)',
            }}
          >
            Detected: {LANGUAGE_OPTIONS.find(o => o.value === language)?.label ?? language}
          </span>
        )}

        <div className="w-px h-4 mx-0.5" style={{ background: 'var(--border)' }} />

        <Button
          size="md"
          variant={inline ? 'accent' : 'default'}
          onClick={() => setInline(!inline)}
          title={inline ? 'Switch to side-by-side (Alt+I)' : 'Switch to inline diff (Alt+I)'}
        >
          {inline ? <AlignLeft size={12} /> : <Columns2 size={12} />}
          {inline ? 'Inline' : 'Side-by-side'}
        </Button>

        <label className="flex items-center gap-1.5 cursor-pointer select-none" style={{ color: 'var(--text-secondary)' }}>
          <input
            type="checkbox"
            checked={ignoreWhitespace}
            onChange={(e) => setIgnoreWhitespace(e.target.checked)}
            className="accent-[var(--accent)] rounded"
            aria-label="Ignore whitespace differences"
          />
          <span className="text-xs">Ignore whitespace</span>
        </label>

        <label className="flex items-center gap-1.5 cursor-pointer select-none" style={{ color: 'var(--text-secondary)' }}>
          <input
            type="checkbox"
            checked={ignoreCase}
            onChange={(e) => setIgnoreCase(e.target.checked)}
            className="accent-[var(--accent)] rounded"
            aria-label="Ignore case differences"
          />
          <span className="text-xs">Ignore case</span>
        </label>

        <div className="flex-1" />

        <Button variant="ghost" size="md" onClick={handleClear} disabled={!left && !right} title="Clear both inputs">
          <Trash2 size={12} />
          Clear
        </Button>

        {mode === 'input' ? (
          <Button variant="accent" size="md" onClick={handleToggleMode} title="Compare (Alt+Enter)">
            Compare
          </Button>
        ) : (
          <Button variant="default" size="md" onClick={handleToggleMode} title="Edit inputs (Alt+Enter)">
            Edit inputs
          </Button>
        )}
      </div>

      {mode === 'diff' && <DiffStats original={diffLeft} modified={diffRight} ignoreCase={ignoreCase} />}

      {mode === 'input' ? (
        <div className="flex flex-1 min-h-0">
          <InputPanel label="Text A — Original" value={left} onChange={setLeft} language={language} />
          <div className="w-px shrink-0" style={{ background: 'var(--border)' }} />
          <InputPanel label="Text B — Modified" value={right} onChange={setRight} language={language} />
        </div>
      ) : (
        <DiffView
          original={diffLeft}
          modified={diffRight}
          language={language}
          inline={inline}
          ignoreWhitespace={ignoreWhitespace}
        />
      )}
    </div>
  )
}
