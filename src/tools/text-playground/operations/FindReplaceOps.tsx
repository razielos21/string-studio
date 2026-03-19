import { useMemo, useState } from 'react'
import { Button } from '../../../components/ui/Button'
import { escapeRegex, isValidRegex, matchesFilter } from '../text-playground.utils'

interface FindReplaceOpsProps {
  onApply: (transform: (s: string) => string) => void
  filter: string
}

export function FindReplaceOps({ onApply, filter }: FindReplaceOpsProps) {
  const [find, setFind] = useState('')
  const [replace, setReplace] = useState('')
  const [useRegex, setUseRegex] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'error' | 'none' | 'ok'; msg: string } | null>(null)

  const invalidRegex = useMemo(
    () => useRegex && find !== '' && !isValidRegex(find),
    [useRegex, find],
  )

  if (!matchesFilter('Find & Replace', filter)) return null

  const inputClass =
    'flex-1 bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border)] rounded text-xs px-2 py-1 h-7 focus:outline-none focus:border-[var(--border-focus)] placeholder:text-[var(--text-muted)]'

  function handleApply() {
    if (invalidRegex) return
    setFeedback(null)
    onApply((s) => {
      try {
        const pattern = useRegex ? find : escapeRegex(find)
        const regex = new RegExp(pattern, 'g')
        const matches = s.match(regex)
        const count = matches ? matches.length : 0
        const result = s.replace(regex, replace)
        setFeedback(
          count === 0
            ? { type: 'none', msg: 'No matches found' }
            : { type: 'ok', msg: `${count} replacement${count !== 1 ? 's' : ''} made` },
        )
        return result
      } catch (e) {
        setFeedback({ type: 'error', msg: e instanceof Error ? e.message : 'Regex error' })
        return s
      }
    })
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Find row */}
      <div className="flex items-center gap-1.5">
        <label htmlFor="fr-find" className="sr-only">Find text</label>
        <input
          id="fr-find"
          value={find}
          onChange={(e) => { setFind(e.target.value); setFeedback(null) }}
          placeholder="Find…"
          className={inputClass}
          style={invalidRegex ? { borderColor: 'var(--error)' } : undefined}
        />
        <label className="flex items-center gap-1 text-xs cursor-pointer whitespace-nowrap select-none" style={{ color: 'var(--text-secondary)' }}>
          <input
            type="checkbox"
            checked={useRegex}
            onChange={(e) => { setUseRegex(e.target.checked); setFeedback(null) }}
            aria-label="Use regular expression"
            className="accent-[var(--accent)]"
          />
          Regex
        </label>
      </div>

      {invalidRegex && (
        <p className="text-[11px]" style={{ color: 'var(--error)' }}>Invalid regular expression</p>
      )}

      {/* Replace row */}
      <label htmlFor="fr-replace" className="sr-only">Replace with</label>
      <input
        id="fr-replace"
        value={replace}
        onChange={(e) => setReplace(e.target.value)}
        placeholder="Replace with…"
        className={inputClass}
        style={{ width: '100%' }}
      />

      <Button
        size="sm"
        variant="accent"
        disabled={!find || invalidRegex}
        onClick={handleApply}
        style={{ width: '100%', justifyContent: 'center' }}
      >
        Apply
      </Button>

      {feedback && (
        <p
          role="status"
          aria-live="polite"
          className="text-[11px] text-center"
          style={{
            color:
              feedback.type === 'ok'
                ? 'var(--success)'
                : feedback.type === 'error'
                ? 'var(--error)'
                : 'var(--text-muted)',
          }}
        >
          {feedback.msg}
        </p>
      )}
    </div>
  )
}
