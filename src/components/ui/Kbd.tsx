export function Kbd({ children }: { children: string }) {
  return (
    <kbd
      className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium min-w-[22px]"
      style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        color: 'var(--text-secondary)',
        boxShadow: '0 1px 0 var(--border)',
      }}
    >
      {children}
    </kbd>
  )
}
