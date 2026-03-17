import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation, NavLink } from 'react-router-dom'
import { Sidebar } from './components/layout/Sidebar'
import { Home } from './pages/Home'
import { Comparator } from './tools/comparator/Comparator'
import { JsonStudio } from './tools/json-studio/JsonStudio'
import { TextPlayground } from './tools/text-playground/TextPlayground'
import { Braces, GitCompare, Type, ChevronRight } from 'lucide-react'

const TOOL_META: Record<string, { label: string; Icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>; color: string }> = {
  '/json':       { label: 'JSON Studio',    Icon: Braces,     color: 'var(--json-accent)' },
  '/comparator': { label: 'Comparator',     Icon: GitCompare, color: 'var(--diff-accent)' },
  '/text':       { label: 'Text Playground',Icon: Type,       color: 'var(--text-accent)' },
}

function ToolHeader({ pathname }: { pathname: string }) {
  const meta = TOOL_META[pathname]
  if (!meta) return null
  const { label, Icon, color } = meta

  return (
    <header
      className="flex items-center gap-2 px-4 h-12 shrink-0"
      style={{
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {/* Breadcrumb */}
      <NavLink
        to="/"
        className="text-sm transition-colors hover:text-[var(--text-primary)]"
        style={{ color: 'var(--text-muted)' }}
      >
        String Studio
      </NavLink>
      <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} aria-hidden />

      {/* Tool identity */}
      <div className="flex items-center gap-2">
        <Icon size={16} style={{ color }} aria-hidden />
        <span
          className="text-sm font-semibold"
          style={{ color: 'var(--text-primary)' }}
        >
          {label}
        </span>
      </div>

      {/* Right — subtle color bar */}
      <div className="flex-1" />
      <div
        className="h-1 w-10 rounded-full opacity-60"
        style={{ background: color }}
        aria-hidden
      />
    </header>
  )
}

const PAGE_TITLES: Record<string, string> = {
  '/':           'String Studio',
  '/json':       'JSON Studio - String Studio',
  '/comparator': 'Comparator - String Studio',
  '/text':       'Text Playground - String Studio',
}

function Layout() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  useEffect(() => {
    document.title = PAGE_TITLES[pathname] ?? 'String Studio'
  }, [pathname])

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: 'var(--bg-base)' }}
    >
      <Sidebar />

      <main className="flex flex-col flex-1 min-w-0 min-h-0 overflow-hidden">
        {!isHome && <ToolHeader pathname={pathname} />}

        <div className="flex-1 min-h-0 overflow-hidden">
          <Routes>
            <Route path="/"          element={<Home />} />
            <Route path="/json"      element={<JsonStudio />} />
            <Route path="/comparator"element={<Comparator />} />
            <Route path="/text"      element={<TextPlayground />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}
