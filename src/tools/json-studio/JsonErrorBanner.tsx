import { AlertTriangle, Wrench } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { type JsonError } from './json-studio.utils'

interface JsonErrorBannerProps {
  error: JsonError
  onFix: () => void
}

export function JsonErrorBanner({ error, onFix }: JsonErrorBannerProps) {
  return (
    <div className="flex items-start gap-2 px-3 py-2 bg-[var(--error)]/10 border border-[var(--error)]/30 rounded text-sm">
      <AlertTriangle size={14} className="text-[var(--error)] mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <span className="text-[var(--error)] font-medium">JSON Error</span>
        {(error.line || error.col) && (
          <span className="text-[var(--text-muted)] ml-2 text-xs">
            {error.line && `Line ${error.line}`}
            {error.col && `, Col ${error.col}`}
          </span>
        )}
        <p className="text-[var(--text-secondary)] text-xs mt-0.5 break-all">{error.message}</p>
      </div>
      <Button variant="error" size="sm" onClick={onFix} title="Attempt to auto-repair JSON (Alt+X)">
        <Wrench size={11} />
        Try Fix
      </Button>
    </div>
  )
}
