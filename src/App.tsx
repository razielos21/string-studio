import { useCallback, useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation, NavLink, useNavigate } from 'react-router-dom'
import { Sidebar } from './components/layout/Sidebar'
import { Home } from './pages/Home'
import { Comparator } from './tools/comparator/Comparator'
import { JsonStudio } from './tools/json-studio/JsonStudio'
import { TextPlayground } from './tools/text-playground/TextPlayground'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ToastProvider, useToast } from './context/ToastContext'
import { ToastContainer } from './components/ui/Toast'
import { KeyboardShortcutsModal } from './components/ui/KeyboardShortcutsModal'
import { useKeyboardShortcut } from './hooks/useKeyboardShortcut'
import { Braces, GitCompare, Type, ChevronRight } from 'lucide-react'

const TOOL_META: Record<string, { label: string; Icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>; color: string; hex: string }> = {
  '/json':       { label: 'JSON Studio',    Icon: Braces,     color: 'var(--json-accent)', hex: '#10b981' },
  '/comparator': { label: 'Comparator',     Icon: GitCompare, color: 'var(--diff-accent)', hex: '#6366f1' },
  '/text':       { label: 'Text Playground',Icon: Type,       color: 'var(--text-accent)', hex: '#f59e0b' },
}

function ToolHeader({ pathname }: { pathname: string }) {
  const meta = TOOL_META[pathname]
  if (!meta) return null
  const { label, Icon, color, hex } = meta

  return (
    <header
      className="flex items-center gap-2 px-4 h-12 shrink-0"
      style={{
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border)',
        boxShadow: `0 1px 0 0 ${hex}22`,
      }}
    >
      <NavLink
        to="/"
        className="text-sm transition-colors hover:text-(--text-primary)"
        style={{ color: 'var(--text-muted)' }}
      >
        String Studio
      </NavLink>
      <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} aria-hidden />

      <div className="flex items-center gap-2">
        <div
          className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
          style={{ background: `${hex}18`, border: `1px solid ${hex}35` }}
        >
          <Icon size={13} style={{ color }} aria-hidden />
        </div>
        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          {label}
        </span>
      </div>
    </header>
  )
}

const PAGE_TITLES: Record<string, string> = {
  '/':           'String Studio',
  '/json':       'JSON Studio - String Studio',
  '/comparator': 'Comparator - String Studio',
  '/text':       'Text Playground - String Studio',
}

function StorageErrorListener() {
  const { showToast } = useToast()

  useEffect(() => {
    const handler = (e: Event) => {
      showToast((e as CustomEvent<string>).detail, 'warning')
    }
    window.addEventListener('ss:storage-error', handler)
    return () => window.removeEventListener('ss:storage-error', handler)
  }, [showToast])

  return null
}

function GlobalShortcuts({ onOpenShortcuts }: { onOpenShortcuts: () => void }) {
  const navigate = useNavigate()

  useKeyboardShortcut('?', onOpenShortcuts)
  useKeyboardShortcut('1', () => navigate('/json'),       { alt: true })
  useKeyboardShortcut('2', () => navigate('/comparator'), { alt: true })
  useKeyboardShortcut('3', () => navigate('/text'),       { alt: true })

  return null
}

function Layout() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const [shortcutsOpen, setShortcutsOpen] = useState(false)

  useEffect(() => {
    document.title = PAGE_TITLES[pathname] ?? 'String Studio'
  }, [pathname])

  // Toggle Monaco find widget: second Ctrl+F closes it
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        const closeBtn = document.querySelector('.find-widget.visible .codicon-widget-close') as HTMLElement | null
        if (closeBtn) {
          e.preventDefault()
          e.stopPropagation()
          closeBtn.click()
        }
      }
    }
    window.addEventListener('keydown', handler, true)
    return () => window.removeEventListener('keydown', handler, true)
  }, [])

  const openShortcuts = useCallback(() => setShortcutsOpen(true), [])
  const closeShortcuts = useCallback(() => setShortcutsOpen(false), [])

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      <StorageErrorListener />
      <GlobalShortcuts onOpenShortcuts={openShortcuts} />

      <Sidebar />

      <main className="flex flex-col flex-1 min-w-0 min-h-0 overflow-hidden">
        {!isHome && <ToolHeader pathname={pathname} />}

        <div className="flex-1 min-h-0 overflow-hidden">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/json"
              element={
                <ErrorBoundary toolName="JSON Studio">
                  <JsonStudio />
                </ErrorBoundary>
              }
            />
            <Route
              path="/comparator"
              element={
                <ErrorBoundary toolName="Comparator">
                  <Comparator />
                </ErrorBoundary>
              }
            />
            <Route
              path="/text"
              element={
                <ErrorBoundary toolName="Text Playground">
                  <TextPlayground />
                </ErrorBoundary>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>

      <KeyboardShortcutsModal open={shortcutsOpen} onClose={closeShortcuts} />
      <ToastContainer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Layout />
      </ToastProvider>
    </BrowserRouter>
  )
}
