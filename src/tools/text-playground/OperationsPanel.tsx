import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
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
  Component: React.ComponentType<{ onApply: (transform: (s: string) => string) => void }>
}

const SECTIONS: Section[] = [
  { id: 'case',        label: 'Case',          defaultOpen: true,  Component: CaseOps },
  { id: 'whitespace',  label: 'Whitespace',    defaultOpen: true,  Component: WhitespaceOps },
  { id: 'find-replace',label: 'Find & Replace',defaultOpen: true,  Component: FindReplaceOps },
  { id: 'lines',       label: 'Lines',         defaultOpen: false, Component: LineOps },
  { id: 'encoding',    label: 'Encoding',      defaultOpen: false, Component: EncodingOps },
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
        className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium cursor-pointer text-left transition-colors"
        style={{ color: open ? 'var(--text-primary)' : 'var(--text-muted)' }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)' }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
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

  const toggle = (id: string) =>
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }))

  return (
    <div
      className="flex flex-col shrink-0 overflow-y-auto"
      style={{
        width: '240px',
        borderLeft: '1px solid var(--border)',
        background: 'var(--bg-surface)',
      }}
    >
      <div
        className="px-3 py-2 shrink-0"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <h3
          className="text-[10px] font-semibold uppercase tracking-widest"
          style={{ color: 'var(--text-muted)' }}
        >
          Operations
        </h3>
      </div>
      {SECTIONS.map(({ id, label, Component }) => (
        <SectionToggle
          key={id}
          label={label}
          open={openSections[id] ?? false}
          onToggle={() => toggle(id)}
        >
          <Component onApply={onApply} />
        </SectionToggle>
      ))}
    </div>
  )
}
