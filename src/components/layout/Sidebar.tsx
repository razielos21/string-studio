import { NavLink, useNavigate } from 'react-router-dom'
import { GitCompare, Braces, Type, Home } from 'lucide-react'
import { cn } from '../../lib/cn'

const tools = [
  { path: '/json',       label: 'JSON Studio',      shortLabel: 'JSON',  Icon: Braces,     color: 'var(--json-accent)' },
  { path: '/comparator', label: 'Comparator',        shortLabel: 'Diff',  Icon: GitCompare, color: 'var(--diff-accent)' },
  { path: '/text',       label: 'Text Playground',   shortLabel: 'Text',  Icon: Type,       color: 'var(--text-accent)' },
]

function NavItem({
  to,
  label,
  shortLabel,
  Icon,
  color,
  end = false,
}: {
  to: string
  label: string
  shortLabel: string
  Icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>
  color?: string
  end?: boolean
}) {
  return (
    <NavLink
      to={to}
      end={end}
      title={label}
      aria-label={label}
      className={({ isActive }) =>
        cn(
          'group relative flex flex-col items-center justify-center gap-1.5 w-full rounded-lg py-3 h-16 cursor-pointer transition-all duration-150',
          isActive
            ? 'bg-white/8 text-[var(--text-primary)]'
            : 'text-[var(--text-muted)] hover:bg-white/5 hover:text-[var(--text-secondary)]',
        )
      }
    >
      {({ isActive }) => (
        <>
          {/* Active left indicator */}
          {isActive && (
            <span
              className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full"
              style={{ background: color ?? 'var(--accent)' }}
            />
          )}
          <Icon
            size={22}
            style={{ color: isActive ? (color ?? 'var(--accent)') : undefined }}
          />
          <span className="text-[11px] font-medium leading-none tracking-wide">{shortLabel}</span>
        </>
      )}
    </NavLink>
  )
}

export function Sidebar() {
  const navigate = useNavigate()

  return (
    <aside className="flex flex-col w-[72px] shrink-0 border-r border-[var(--border)] bg-[var(--bg-surface)]">
      {/* Logo */}
      <button
        onClick={() => navigate('/')}
        title="String Studio — Home"
        aria-label="Go to home"
        className="flex items-center justify-center h-14 border-b border-[var(--border)] cursor-pointer hover:bg-white/5 transition-colors shrink-0"
      >
        <span
          className="font-heading font-bold text-sm tracking-tight"
          style={{ color: 'var(--accent)' }}
        >
          {'{ S }'}
        </span>
      </button>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 p-1.5 flex-1 pt-2" role="navigation" aria-label="Tools">
        <NavItem to="/" label="Home" shortLabel="Home" Icon={Home} end />

        <div className="my-1.5 mx-1 h-px" style={{ background: 'var(--border-muted)' }} />

        {tools.map(({ path, label, shortLabel, Icon, color }) => (
          <NavItem key={path} to={path} label={label} shortLabel={shortLabel} Icon={Icon} color={color} />
        ))}
      </nav>

      {/* Footer */}
      <div className="px-1 py-2 border-t border-[var(--border)] shrink-0">
        <p className="text-[9px] text-[var(--text-muted)] text-center tracking-wider">v1.0</p>
      </div>
    </aside>
  )
}
