import { useState, useMemo } from 'react'
import { ChevronRight, ChevronDown, Copy, Check } from 'lucide-react'
import { useClipboard } from '../../hooks/useClipboard'
import { buildJsonPath } from './json-studio.utils'

interface JsonObject { [key: string]: JsonValue }
type JsonValue = string | number | boolean | null | JsonValue[] | JsonObject

function CopyPathButton({ path }: { path: string }) {
  const { copied, copy } = useClipboard(1500)

  return (
    <button
      onClick={(e) => { e.stopPropagation(); copy(path) }}
      className="opacity-0 group-hover:opacity-100 ml-auto shrink-0 flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] transition-opacity cursor-pointer"
      style={{
        color: copied ? 'var(--success)' : 'var(--text-muted)',
        background: 'var(--bg-elevated)',
      }}
      title={`Copy path: ${path}`}
    >
      {copied ? <Check size={10} /> : <Copy size={10} />}
      {copied ? 'copied' : path}
    </button>
  )
}

function Primitive({ value }: { value: string | number | boolean | null }) {
  if (value === null)
    return <span style={{ color: 'var(--text-muted)' }}>null</span>
  if (typeof value === 'boolean')
    return <span style={{ color: 'var(--warning)' }}>{String(value)}</span>
  if (typeof value === 'number')
    return <span style={{ color: '#06b6d4' }}>{value}</span>
  return <span style={{ color: 'var(--success)' }}>"{String(value)}"</span>
}

function TreeNode({ label, value, depth, path }: { label?: string; value: JsonValue; depth: number; path: string }) {
  const isObject = value !== null && typeof value === 'object'
  const isArray = Array.isArray(value)
  const [open, setOpen] = useState(depth < 2)

  const entries = useMemo<[string, JsonValue][]>(() => {
    if (isArray) return (value as JsonValue[]).map((v, i) => [String(i), v])
    if (isObject) return Object.entries(value as Record<string, JsonValue>)
    return []
  }, [value, isArray, isObject])

  if (!isObject) {
    return (
      <div className="group flex items-center gap-1.5 py-[1px] rounded hover:bg-white/4" style={{ paddingLeft: depth * 16 + 18 }}>
        {label !== undefined && (
          <>
            <span className="shrink-0" style={{ color: '#818cf8' }}>{label}</span>
            <span style={{ color: 'var(--text-muted)' }}>:</span>
          </>
        )}
        <Primitive value={value as string | number | boolean | null} />
        {path && <CopyPathButton path={path} />}
      </div>
    )
  }

  const [open_, close_] = isArray ? ['[', ']'] : ['{', '}']
  const count = entries.length
  const countLabel = `${count} ${isArray ? (count === 1 ? 'item' : 'items') : (count === 1 ? 'key' : 'keys')}`

  return (
    <div>
      <div
        className="group flex items-center gap-1 py-[1px] rounded hover:bg-white/4 cursor-pointer select-none"
        style={{ paddingLeft: depth * 16 }}
        onClick={() => setOpen((o) => !o)}
      >
        <span
          className="w-[18px] flex items-center justify-center shrink-0"
          style={{ color: 'var(--text-muted)' }}
        >
          {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        </span>
        {label !== undefined && (
          <>
            <span style={{ color: '#818cf8' }}>{label}</span>
            <span style={{ color: 'var(--text-muted)' }}>:</span>
          </>
        )}
        <span style={{ color: 'var(--text-primary)' }}>{open_}</span>
        {!open && (
          <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
            {countLabel}{close_}
          </span>
        )}
        {path && <CopyPathButton path={path} />}
      </div>

      {open && (
        <>
          {entries.map(([k, v]) => {
            const childPath = buildJsonPath(path, k, isArray)
            return (
              <TreeNode
                key={k}
                label={isArray ? `[${k}]` : `"${k}"`}
                value={v}
                depth={depth + 1}
                path={childPath}
              />
            )
          })}
          <div className="py-[1px]" style={{ paddingLeft: depth * 16 + 18 }}>
            <span style={{ color: 'var(--text-primary)' }}>{close_}</span>
          </div>
        </>
      )}
    </div>
  )
}

export function JsonTreeView({ value }: { value: string }) {
  const parsed = useMemo(() => {
    try {
      return { data: JSON.parse(value) as JsonValue, ok: true }
    } catch {
      return { data: null, ok: false }
    }
  }, [value])

  if (!parsed.ok) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Invalid JSON</p>
      </div>
    )
  }

  return (
    <div
      className="flex-1 min-h-0 overflow-auto p-3 font-mono text-[12.5px] leading-relaxed"
      style={{ background: 'var(--bg-base)' }}
    >
      <TreeNode value={parsed.data!} depth={0} path="" />
    </div>
  )
}
