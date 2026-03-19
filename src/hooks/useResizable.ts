import { useCallback, useEffect, useRef, useState } from 'react'

export function useResizable(initialPercent = 50, min = 20, max = 80) {
  const [percent, setPercent] = useState(initialPercent)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const cleanupRef = useRef<(() => void) | null>(null)

  // Clean up listeners and body styles if the component unmounts mid-drag
  useEffect(() => {
    return () => {
      cleanupRef.current?.()
    }
  }, [])

  const startDrag = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      dragging.current = true
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'

      const onMouseMove = (ev: MouseEvent) => {
        if (!dragging.current || !containerRef.current) return
        const rect = containerRef.current.getBoundingClientRect()
        const pct = ((ev.clientX - rect.left) / rect.width) * 100
        setPercent(Math.min(Math.max(pct, min), max))
      }

      const cleanup = () => {
        dragging.current = false
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', cleanup)
        cleanupRef.current = null
      }

      cleanupRef.current = cleanup
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', cleanup)
    },
    [min, max],
  )

  return { percent, containerRef, startDrag }
}
