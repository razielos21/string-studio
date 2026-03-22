import { useLayoutEffect, useRef } from 'react'
import { decodeState, clearHash } from '../lib/shareUrl'

export function useHashState<T>(onLoad: (state: T) => void): void {
  const onLoadRef = useRef(onLoad)
  onLoadRef.current = onLoad
  useLayoutEffect(() => {
    const hash = window.location.hash.slice(1)
    if (!hash) return
    const state = decodeState<T>(hash)
    if (state !== null) onLoadRef.current(state)
    clearHash()
  }, [])
}
