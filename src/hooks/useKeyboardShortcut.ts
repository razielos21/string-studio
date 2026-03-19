import { useEffect, useRef } from 'react'

interface Options {
  alt?: boolean
  ctrl?: boolean
  shift?: boolean
  /** Fire even when an input/textarea is focused. Default false. */
  ignoreInputs?: boolean
  enabled?: boolean
}

export function useKeyboardShortcut(
  key: string,
  handler: () => void,
  options: Options = {},
) {
  const { alt = false, ctrl = false, shift = false, ignoreInputs = false, enabled = true } = options

  // Keep a ref to the latest handler so the event listener never goes stale
  // without needing to re-register on every render.
  const handlerRef = useRef(handler)
  handlerRef.current = handler

  useEffect(() => {
    if (!enabled) return

    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (!ignoreInputs && target.matches('input, textarea, [contenteditable]')) return
      if (alt && !e.altKey) return
      if (ctrl && !(e.ctrlKey || e.metaKey)) return
      if (shift && !e.shiftKey) return
      if (e.key.toLowerCase() !== key.toLowerCase()) return

      e.preventDefault()
      handlerRef.current()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [key, alt, ctrl, shift, ignoreInputs, enabled])
  // handler intentionally excluded — kept current via handlerRef
}
