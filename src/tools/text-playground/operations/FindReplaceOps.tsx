import { useState } from 'react'
import { Button } from '../../../components/ui/Button'
import { escapeRegex } from '../text-playground.utils'

interface FindReplaceOpsProps {
  onApply: (transform: (s: string) => string) => void
}

function isValidRegex(pattern: string): boolean {
  try {
    new RegExp(pattern)
    return true
  } catch {
    return false
  }
}

export function FindReplaceOps({ onApply }: FindReplaceOpsProps) {
  const [find, setFind] = useState('')
  const [replace, setReplace] = useState('')
  const [useRegex, setUseRegex] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'error' | 'none' | 'ok'; msg: string } | null>(null)

  const inputClass =
    'flex-1 bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border)] rounded text-xs px-2 py-1 h-7 focus:outline-none focus:border-[var(--border-focus)] placeholder:text-[var(--text-muted)]'

  const invalidRegex = useRegex && find !== '' && !isValidRegex(find)

  function handleApply() {
    if (invalidRegex) return
    setFeedback(null)
    onApply((s) => {
      try {
        const regex = new RegExp(useRegex ? find : escapeRegex(find), 'g')
        const matches = s.match(regex)
        const count = matches ? matches.length : 0
        const result = s.replace(regex, replace)
        setFeedback(count === 0
          ? { type: 'none', msg: 'No matches found' }
          : { type: 'ok', msg: `${count} replacement${count !== 1 ? 's' : ''} made` }
        )
        return result
      } catch {
        return s
      }
    })
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Find row */}
      <div className="flex items-center gap-1.5">
        <input
          value={find}
          onChange={(e) => { setFind(e.target.value); setFeedback(null) }}
          placeholder="Find…"
          aria-label="Find text"
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

      {/* Regex error */}
      {invalidRegex && (
        <p className="text-[11px]" style={{ color: 'var(--error)' }}>Invalid regular expression</p>
      )}

      {/* Replace row */}
      <input
        value={replace}
        onChange={(e) => setReplace(e.target.value)}
        placeholder="Replace with…"
        aria-label="Replace with"
        className={inputClass}
        style={{ width: '100%' }}
      />

      {/* Apply */}
      <Button
        size="sm"
        variant="accent"
        disabled={!find || invalidRegex}
        onClick={handleApply}
        style={{ width: '100%', justifyContent: 'center' }}
      >
        Apply
      </Button>

      {/* Feedback */}
      {feedback && (
        <p
          role="status"
          aria-live="polite"
          className="text-[11px] text-center"
          style={{ color: feedback.type === 'ok' ? 'var(--success)' : 'var(--text-muted)' }}
        >
          {feedback.msg}
        </p>
      )}
    </div>
  )
}
