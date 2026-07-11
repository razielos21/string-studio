import type { CSSProperties } from 'react'

export const PANE_LABEL = 'px-3 py-1.5 text-[11px] font-medium tracking-wide uppercase'

/** Tinted color/background (+ optional border) used to mark a toggle/button as active, per tool accent color. */
export function activeAccentStyle(hex: string, rgb: string, withBorder = true): CSSProperties {
  return withBorder
    ? { color: hex, background: `rgba(${rgb},0.1)`, border: `1px solid rgba(${rgb},0.25)` }
    : { color: hex, background: `rgba(${rgb},0.1)` }
}
