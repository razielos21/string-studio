import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

/** Two independent draggable boundaries splitting one container into three panes. */
export function useTriResizable(initialLeft = 33, initialRight = 66, minWidth = 15) {
  const [leftPercent, setLeftPercent] = useState(initialLeft)
  const [rightPercent, setRightPercent] = useState(initialRight)
  const leftRef = useRef(leftPercent)
  const rightRef = useRef(rightPercent)
  leftRef.current = leftPercent
  rightRef.current = rightPercent

  const containerRef = useRef<HTMLDivElement>(null)
  const cleanupRef = useRef<(() => void) | null>(null)

  useEffect(() => () => cleanupRef.current?.(), [])

  const startDrag = useCallback(
    (which: 'left' | 'right') => (e: React.MouseEvent) => {
      e.preventDefault()
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'

      const onMouseMove = (ev: MouseEvent) => {
        if (!containerRef.current) return
        const rect = containerRef.current.getBoundingClientRect()
        const pct = ((ev.clientX - rect.left) / rect.width) * 100
        if (which === 'left') {
          const maxLeft = rightRef.current - minWidth
          setLeftPercent(Math.min(Math.max(pct, minWidth), maxLeft))
        } else {
          const minRight = leftRef.current + minWidth
          setRightPercent(Math.max(Math.min(pct, 100 - minWidth), minRight))
        }
      }

      const cleanup = () => {
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
    [minWidth],
  )

  const startDragLeft = useMemo(() => startDrag('left'), [startDrag])
  const startDragRight = useMemo(() => startDrag('right'), [startDrag])

  return { leftPercent, rightPercent, containerRef, startDragLeft, startDragRight }
}
