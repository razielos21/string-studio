import { useState, useCallback, useEffect } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
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
  const [mode, setMode] = useState<'input' | 'diff'>('input')

  useEffect(() => {
    if (autoDetect) setLanguage(detectLanguage(left || right))
  }, [left, right, autoDetect])

  const handleCompare = useCallback(() => setMode('diff'), [])
  const handleEdit = useCallback(() => setMode('input'), [])
  const handleClear = useCallback(() => { setLeft(''); setRight(''); setMode('input') }, [setLeft, setRight])

  const handleLanguageChange = useCallback((lang: Language) => {
    setLanguage(lang)
    setAutoDetect(false)
  }, [])

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: 'var(--bg-base)' }}>
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
          title={inline ? 'Switch to side-by-side' : 'Switch to inline diff'}
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
          />
          <span className="text-xs">Ignore whitespace</span>
        </label>

        <div className="flex-1" />

        <Button variant="ghost" size="md" onClick={handleClear} disabled={!left && !right} title="Clear both inputs">
          <Trash2 size={12} />
          Clear
        </Button>

        {mode === 'input' ? (
          <Button variant="accent" size="md" onClick={handleCompare}>
            Compare
          </Button>
        ) : (
          <Button variant="default" size="md" onClick={handleEdit}>
            Edit inputs
          </Button>
        )}
      </div>

      {mode === 'diff' && <DiffStats original={left} modified={right} />}

      {mode === 'input' ? (
        <div className="flex flex-1 min-h-0">
          <InputPanel label="Text A — Original" value={left} onChange={setLeft} language={language} />
          <div className="w-px shrink-0" style={{ background: 'var(--border)' }} />
          <InputPanel label="Text B — Modified" value={right} onChange={setRight} language={language} />
        </div>
      ) : (
        <DiffView original={left} modified={right} language={language} inline={inline} ignoreWhitespace={ignoreWhitespace} />
      )}
    </div>
  )
}
