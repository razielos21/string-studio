import { useState, useCallback } from 'react'

export function useAsyncAction(fn: () => Promise<void>) {
  const [isPending, setIsPending] = useState(false)
  const run = useCallback(() => {
    void (async () => {
      setIsPending(true)
      try { await fn() }
      catch (e) { console.error('Action failed:', e) }
      finally { setIsPending(false) }
    })()
  }, [fn])
  return { isPending, run }
}
