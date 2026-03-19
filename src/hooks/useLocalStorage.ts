import { useState, useEffect, useRef } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item !== null ? (JSON.parse(item) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  const isInitialized = useRef(false)

  useEffect(() => {
    // Skip the initial mount — value was already read from localStorage
    if (!isInitialized.current) {
      isInitialized.current = true
      return
    }
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue))
    } catch (e) {
      const isQuota =
        e instanceof DOMException &&
        (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED')
      window.dispatchEvent(
        new CustomEvent('ss:storage-error', {
          detail: isQuota
            ? 'Storage quota exceeded — your changes may not be saved.'
            : 'Could not save to localStorage.',
        }),
      )
    }
  }, [key, storedValue])

  return [storedValue, setStoredValue] as const
}
