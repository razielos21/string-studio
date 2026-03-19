import { X, Keyboard } from 'lucide-react'
import { Kbd } from './Kbd'
import { useKeyboardShortcut } from '../../hooks/useKeyboardShortcut'

interface Shortcut {
  keys: string[]
  description: string
}

interface ShortcutGroup {
  label: string
  shortcuts: Shortcut[]
}

const SHORTCUT_GROUPS: ShortcutGroup[] = [
  {
    label: 'Global',
    shortcuts: [
      { keys: ['?'], description: 'Show this help' },
      { keys: ['Alt', '1'], description: 'Go to JSON Studio' },
      { keys: ['Alt', '2'], description: 'Go to Comparator' },
      { keys: ['Alt', '3'], description: 'Go to Text Playground' },
    ],
  },
  {
    label: 'JSON Studio',
    shortcuts: [
      { keys: ['Alt', 'F'], description: 'Format JSON' },
      { keys: ['Alt', 'X'], description: 'Fix JSON' },
      { keys: ['Alt', 'M'], description: 'Minify JSON' },
    ],
  },
  {
    label: 'Comparator',
    shortcuts: [
      { keys: ['Alt', 'Enter'], description: 'Compare / Edit inputs' },
      { keys: ['Alt', 'I'], description: 'Toggle inline diff' },
    ],
  },
  {
    label: 'Text Playground',
    shortcuts: [
      { keys: ['Alt', 'Z'], description: 'Undo last operation' },
      { keys: ['Alt', 'R'], description: 'Reset output' },
    ],
  },
]

interface Props {
  open: boolean
  onClose: () => void
}

export function KeyboardShortcutsModal({ open, onClose }: Props) {
  useKeyboardShortcut('Escape', onClose, { ignoreInputs: true, enabled: open })

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="rounded-xl w-full max-w-md overflow-hidden"
        style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <div className="flex items-center gap-2.5">
            <Keyboard size={16} style={{ color: 'var(--accent)' }} />
            <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
              Keyboard Shortcuts
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="cursor-pointer hover:opacity-70 transition-opacity"
            style={{ color: 'var(--text-muted)' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Groups */}
        <div className="overflow-y-auto max-h-[60vh] p-5 flex flex-col gap-5">
          {SHORTCUT_GROUPS.map((group) => (
            <div key={group.label}>
              <p
                className="text-[10px] font-semibold uppercase tracking-widest mb-2.5"
                style={{ color: 'var(--text-muted)' }}
              >
                {group.label}
              </p>
              <div className="flex flex-col gap-1.5">
                {group.shortcuts.map((s) => (
                  <div key={s.description} className="flex items-center justify-between gap-4">
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {s.description}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      {s.keys.map((k, i) => (
                        <span key={i} className="flex items-center gap-1">
                          <Kbd>{k}</Kbd>
                          {i < s.keys.length - 1 && (
                            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>+</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
