import { useNavigate } from 'react-router-dom'
import { GitCompare, Braces, Type, ArrowRight, Zap, Lock, HardDrive } from 'lucide-react'

const tools = [
  {
    id: 'json',
    path: '/json',
    Icon: Braces,
    name: 'JSON Studio',
    tagline: 'Format · Fix · Minify',
    description: 'Pretty-print, auto-repair malformed JSON, or crush it to one line. Catches parse errors with exact line and column numbers.',
    accent: '#10b981',
    glow: 'rgba(16,185,129,0.15)',
    border: 'rgba(16,185,129,0.18)',
    borderHover: 'rgba(16,185,129,0.5)',
    tags: ['jsonrepair', 'Monaco editor', 'live validation'],
  },
  {
    id: 'comparator',
    path: '/comparator',
    Icon: GitCompare,
    name: 'Comparator',
    tagline: 'Diff any two texts',
    description: 'Side-by-side or inline diff powered by Monaco. Auto-detects language, shows +/− stats, and ignores whitespace on demand.',
    accent: '#6366f1',
    glow: 'rgba(99,102,241,0.15)',
    border: 'rgba(99,102,241,0.18)',
    borderHover: 'rgba(99,102,241,0.5)',
    tags: ['Monaco DiffEditor', 'auto-detect lang', 'diff stats'],
  },
  {
    id: 'text',
    path: '/text',
    Icon: Type,
    name: 'Text Playground',
    tagline: 'Transform any string',
    description: 'Chain case transforms, whitespace ops, find/replace with regex, line sorting, deduplication, and Base64/URL/HTML encoding.',
    accent: '#f59e0b',
    glow: 'rgba(245,158,11,0.15)',
    border: 'rgba(245,158,11,0.18)',
    borderHover: 'rgba(245,158,11,0.5)',
    tags: ['22 operations', 'regex support', 'chained transforms'],
  },
]

const perks = [
  { Icon: Zap,       label: 'Instant',    desc: 'Runs entirely in your browser.' },
  { Icon: Lock,      label: 'Private',    desc: 'Data never leaves your machine.' },
  { Icon: HardDrive, label: 'Persistent', desc: 'Survives refresh via localStorage.' },
]

export function Home() {
  const navigate = useNavigate()

  return (
    <div
      className="h-full flex flex-col overflow-y-auto overflow-x-hidden"
      style={{ background: 'var(--bg-base)', position: 'relative' }}
    >
      {/* Radial glow */}
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
          background: 'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(99,102,241,0.14) 0%, transparent 70%)',
        }}
      />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section
        className="relative z-10 flex flex-col items-center justify-center text-center px-8 animate-fade-up"
        style={{ flex: '0 0 auto', paddingTop: '8vh', paddingBottom: '5vh' }}
      >
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-8"
          style={{
            background: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.25)',
            color: '#818cf8',
          }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#6366f1' }} />
            <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: '#6366f1' }} />
          </span>
          Developer text tools - all in one place
        </div>

        {/* Headline */}
        <h1
          className="font-heading font-bold tracking-tight leading-none mb-6"
          style={{
            fontSize: 'clamp(3.5rem, 8vw, 6rem)',
            background: 'linear-gradient(160deg, #ffffff 0%, #ffffff 45%, rgba(255,255,255,0.45) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          String<br />Studio
        </h1>

        {/* Sub */}
        <p
          className="max-w-md leading-relaxed mb-10"
          style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)', color: 'var(--text-secondary)' }}
        >
          Format, diff, and transform text without leaving your flow.
        </p>

        {/* Perks */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 animate-fade-up delay-200">
          {perks.map(({ Icon, label, desc }) => (
            <div key={label} className="flex items-center gap-2">
              <Icon size={14} style={{ color: 'var(--accent)' }} aria-hidden />
              <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{label}</span>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Cards ────────────────────────────────────────── */}
      <section
        className="relative z-10 w-full mx-auto animate-fade-up delay-300"
        style={{ flex: '1 1 auto', padding: '0 clamp(1.5rem, 4vw, 4rem) clamp(2rem, 6vh, 5rem)', maxWidth: '1100px', alignSelf: 'center' }}
      >
        <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {tools.map(({ id, path, Icon, name, tagline, description, accent, glow, border, borderHover, tags }) => (
            <ToolCard
              key={id}
              path={path}
              Icon={Icon}
              name={name}
              tagline={tagline}
              description={description}
              accent={accent}
              glow={glow}
              border={border}
              borderHover={borderHover}
              tags={tags}
              onNavigate={navigate}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

/* ── Tool card ───────────────────────────────────────────────────────────── */
interface ToolCardProps {
  path: string
  Icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>
  name: string
  tagline: string
  description: string
  accent: string
  glow: string
  border: string
  borderHover: string
  tags: string[]
  onNavigate: (path: string) => void
}

function ToolCard({ path, Icon, name, tagline, description, accent, glow, border, borderHover, tags, onNavigate }: ToolCardProps) {
  const applyActive = (el: HTMLButtonElement) => {
    el.style.borderColor = borderHover
    el.style.background = 'rgba(255,255,255,0.045)'
    el.style.boxShadow = `0 0 40px ${glow}`
    el.style.transform = 'translateY(-2px)'
  }
  const applyBase = (el: HTMLButtonElement) => {
    el.style.borderColor = border
    el.style.background = 'rgba(255,255,255,0.025)'
    el.style.boxShadow = 'none'
    el.style.transform = 'translateY(0)'
  }

  return (
    <button
      onClick={() => onNavigate(path)}
      className="group relative flex flex-col gap-5 rounded-2xl text-left cursor-pointer transition-all duration-200 overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2"
      style={{
        padding: 'clamp(1.25rem, 2.5vw, 1.75rem)',
        background: 'rgba(255,255,255,0.025)',
        border: `1px solid ${border}`,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
      onMouseEnter={(e) => applyActive(e.currentTarget)}
      onMouseLeave={(e) => applyBase(e.currentTarget)}
      onFocus={(e) => applyActive(e.currentTarget)}
      onBlur={(e) => applyBase(e.currentTarget)}
      aria-label={`Open ${name}`}
    >
      {/* Corner glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: glow }}
      />

      {/* Icon */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${accent}18`, border: `1px solid ${accent}35` }}
      >
        <Icon size={22} style={{ color: accent }} />
      </div>

      {/* Name + tagline */}
      <div>
        <div className="font-semibold mb-1" style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>{name}</div>
        <div className="font-mono text-xs" style={{ color: accent }}>{tagline}</div>
      </div>

      {/* Description */}
      <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--text-secondary)' }}>
        {description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <span
            key={tag}
            className="text-[11px] px-2.5 py-0.5 rounded-full font-medium"
            style={{ background: `${accent}12`, color: accent, border: `1px solid ${accent}28` }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* CTA */}
      <div
        className="flex items-center gap-1.5 text-sm font-semibold transition-transform duration-200 group-hover:translate-x-1"
        style={{ color: accent }}
      >
        Open tool <ArrowRight size={14} aria-hidden />
      </div>
    </button>
  )
}
