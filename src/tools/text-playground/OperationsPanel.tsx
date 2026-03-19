import { useState } from 'react'
import { ChevronDown, ChevronRight, Search } from 'lucide-react'
import { CaseOps } from './operations/CaseOps'
import { WhitespaceOps } from './operations/WhitespaceOps'
import { FindReplaceOps } from './operations/FindReplaceOps'
import { LineOps } from './operations/LineOps'
import { EncodingOps } from './operations/EncodingOps'

interface OperationsPanelProps {
  onApply: (transform: (s: string) => string) => void
}

interface Section {
  id: string
  label: string
  defaultOpen: boolean
  Component: React.ComponentType<{
    onApply: (transform: (s: string) => string) => void
    filter: string
  }>
}

const SECTIONS: Section[] = [
  { id: 'case',         label: 'Case',          defaultOpen: true,  Component: CaseOps },
  { id: 'whitespace',   label: 'Whitespace',    defaultOpen: true,  Component: WhitespaceOps },
  { id: 'find-replace', label: 'Find & Replace', defaultOpen: true,  Component: FindReplaceOps },
  { id: 'lines',        label: 'Lines',         defaultOpen: false, Component: LineOps },
  { id: 'encoding',     label: 'Encoding',      defaultOpen: false, Component: EncodingOps },
]

function SectionToggle({
  label, open, onToggle, children,
}: {
  label: string; open: boolean; onToggle: () => void; children: React.ReactNode
}) {
  return (
    <div style={{ borderBottom: '1px solid var(--border-muted)' }}>
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium cursor-pointer text-left transition-colors hover:bg-white/[0.04]"
        style={{ color: open ? 'var(--text-primary)' : 'var(--text-muted)' }}
      >
        {open
          ? <ChevronDown size={11} style={{ color: 'var(--accent)' }} />
          : <ChevronRight size={11} style={{ color: 'var(--text-muted)' }} />
        }
        {label}
      </button>
      {open && <div className="px-3 pb-3">{children}</div>}
    </div>
  )
}

export function OperationsPanel({ onApply }: OperationsPanelProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    () => Object.fromEntries(SECTIONS.map((s) => [s.id, s.defaultOpen])),
  )
  const [filter, setFilter] = useState('')

  const toggle = (id: string) =>
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }))

  const hasFilter = filter.trim().length > 0

  return (
    <div
      className="flex flex-col shrink-0 overflow-hidden"
      style={{
        width: '240px',
        borderLeft: '1px solid var(--border)',
        background: 'var(--bg-surface)',
      }}
    >
      {/* Header */}
      <div
        className="px-3 py-2 shrink-0"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <h3
          className="text-[10px] font-semibold uppercase tracking-widest mb-2"
          style={{ color: 'var(--text-muted)' }}
        >
          Operations
        </h3>
        {/* Search */}
        <div className="relative">
          <Search
            size={11}
            className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: 'var(--text-muted)' }}
          />
          <input
            type="search"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter operations…"
            aria-label="Filter operations"
            className="w-full pl-6 pr-2 py-1 rounded text-xs focus:outline-none"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
            }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {SECTIONS.map(({ id, label, Component }) => (
          <SectionToggle
            key={id}
            label={label}
            open={hasFilter || (openSections[id] ?? false)}
            onToggle={() => toggle(id)}
          >
            <Component onApply={onApply} filter={filter} />
          </SectionToggle>
        ))}
      </div>
    </div>
  )
}
