import { useRef, useCallback, useEffect, useState } from 'react'
import { ComposeToolbar, type ActiveFormats } from './ComposeToolbar'
import { FORMAT_BLOCK_OPTIONS, DEFAULT_HIGHLIGHT_COLOR, rgbToHex, sanitizeHtml, type ComposeLang } from './compose.utils'

const DEFAULT_FORMATS: ActiveFormats = {
  bold: false,
  italic: false,
  underline: false,
  strikeThrough: false,
  insertUnorderedList: false,
  insertOrderedList: false,
  justifyLeft: false,
  justifyCenter: false,
  justifyRight: false,
  link: false,
  code: false,
}

interface ComposeEditorProps {
  body: string
  onChangeBody: (html: string) => void
  lang: ComposeLang
  dir: 'ltr' | 'rtl'
  onLangChange: (lang: ComposeLang) => void
}

const HISTORY_LIMIT = 100

export function ComposeEditor({ body, onChangeBody, lang, dir, onLangChange }: ComposeEditorProps) {
  const editableRef = useRef<HTMLDivElement>(null)
  const savedRange = useRef<Range | null>(null)
  const lastEmitted = useRef(body)
  const initialized = useRef(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Own undo/redo stack (innerHTML snapshots), rather than execCommand('undo'/'redo'):
  // link/image/inline-code are inserted via the Range API (not execCommand), so they
  // never land on the browser's native edit-history stack — a stack we control covers
  // every mutation path uniformly, native and manual alike.
  const historyRef = useRef<string[]>([body])
  const historyIndexRef = useRef(0)
  const [activeFormats, setActiveFormats] = useState<ActiveFormats>(DEFAULT_FORMATS)
  const [currentBlock, setCurrentBlock] = useState('p')
  const [color, setColor] = useState('#f1f0ff')
  const [highlightColor, setHighlightColor] = useState(DEFAULT_HIGHLIGHT_COLOR)
  const [hasSelection, setHasSelection] = useState(false)

  const pushHistory = useCallback((html: string) => {
    const history = historyRef.current
    if (history[historyIndexRef.current] === html) return
    const truncated = history.slice(0, historyIndexRef.current + 1)
    truncated.push(html)
    historyRef.current = truncated.length > HISTORY_LIMIT ? truncated.slice(-HISTORY_LIMIT) : truncated
    historyIndexRef.current = historyRef.current.length - 1
  }, [])

  // Init once on mount, then only re-sync the DOM on external resets (e.g. Clear) —
  // never on our own onChangeBody round-trip, or the caret would jump on every keystroke.
  useEffect(() => {
    const el = editableRef.current
    if (!el) return
    if (!initialized.current) {
      el.innerHTML = body
      initialized.current = true
      return
    }
    if (body !== lastEmitted.current) {
      el.innerHTML = body
      lastEmitted.current = body
      pushHistory(body)
    }
  }, [body, pushHistory])

  const updateActiveFormats = useCallback(() => {
    const sel = window.getSelection()
    let link = false
    let code = false
    if (sel && sel.anchorNode && editableRef.current?.contains(sel.anchorNode)) {
      const node = sel.anchorNode
      const el = node.nodeType === Node.ELEMENT_NODE ? (node as Element) : node.parentElement
      link = !!el?.closest('a')
      code = !!el?.closest('code')
    }

    setActiveFormats({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      strikeThrough: document.queryCommandState('strikeThrough'),
      insertUnorderedList: document.queryCommandState('insertUnorderedList'),
      insertOrderedList: document.queryCommandState('insertOrderedList'),
      justifyLeft: document.queryCommandState('justifyLeft'),
      justifyCenter: document.queryCommandState('justifyCenter'),
      justifyRight: document.queryCommandState('justifyRight'),
      link,
      code,
    })
    const blockValue = document.queryCommandValue('formatBlock').toLowerCase()
    const match = FORMAT_BLOCK_OPTIONS.find((o) => o.tag === blockValue)
    setCurrentBlock(match ? match.value : 'p')
    setColor(rgbToHex(document.queryCommandValue('foreColor')))
    setHighlightColor(rgbToHex(document.queryCommandValue('hiliteColor'), DEFAULT_HIGHLIGHT_COLOR))
  }, [])

  const trackSelection = useCallback(() => {
    const sel = window.getSelection()
    if (sel && sel.rangeCount > 0 && editableRef.current?.contains(sel.anchorNode)) {
      const range = sel.getRangeAt(0)
      savedRange.current = range.cloneRange()
      setHasSelection(!range.collapsed)
    }
  }, [])

  useEffect(() => {
    const handler = () => {
      trackSelection()
      if (document.activeElement === editableRef.current) {
        requestAnimationFrame(updateActiveFormats)
      }
    }
    document.addEventListener('selectionchange', handler)
    return () => document.removeEventListener('selectionchange', handler)
  }, [trackSelection, updateActiveFormats])

  const emitChange = useCallback(() => {
    const el = editableRef.current
    if (!el) return
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const clean = sanitizeHtml(el.innerHTML)
      lastEmitted.current = clean
      pushHistory(clean)
      onChangeBody(clean)
    }, 200)
  }, [onChangeBody, pushHistory])

  const applyHistorySnapshot = useCallback(
    (html: string) => {
      const el = editableRef.current
      if (!el) return
      if (debounceRef.current) clearTimeout(debounceRef.current)
      el.innerHTML = html
      lastEmitted.current = html
      onChangeBody(html)
      el.focus()
      updateActiveFormats()
    },
    [onChangeBody, updateActiveFormats],
  )

  const undo = useCallback(() => {
    if (historyIndexRef.current <= 0) return
    historyIndexRef.current -= 1
    applyHistorySnapshot(historyRef.current[historyIndexRef.current])
  }, [applyHistorySnapshot])

  const redo = useCallback(() => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return
    historyIndexRef.current += 1
    applyHistorySnapshot(historyRef.current[historyIndexRef.current])
  }, [applyHistorySnapshot])

  // Re-focuses the editable and restores its last known selection when focus has
  // drifted away (e.g. to a toolbar <select> or the link popup's <input>).
  const restoreSelection = useCallback(() => {
    const el = editableRef.current
    if (!el || document.activeElement === el) return
    el.focus()
    const sel = window.getSelection()
    if (sel && savedRange.current) {
      sel.removeAllRanges()
      sel.addRange(savedRange.current)
    }
  }, [])

  const exec = useCallback(
    (command: string, value?: string) => {
      const el = editableRef.current
      if (!el) return
      restoreSelection()
      if (command === 'hiliteColor') {
        // Chromium silently no-ops hiliteColor unless styleWithCSS is on.
        document.execCommand('styleWithCSS', false, 'true')
        document.execCommand(command, false, value)
        document.execCommand('styleWithCSS', false, 'false')
      } else {
        document.execCommand(command, false, value)
      }
      requestAnimationFrame(updateActiveFormats)
      emitChange()
    },
    [emitChange, restoreSelection, updateActiveFormats],
  )

  // Inserted via the Range API (rather than document.execCommand('createLink', ...))
  // for full control over the anchor and to avoid execCommand's deprecated,
  // browser-inconsistent behavior. Mutates the saved Range directly and only
  // focuses/reselects the editor afterward, since the selection was captured
  // while the editor still had focus (before the link popup stole it).
  const insertLink = useCallback(
    (url: string) => {
      const range = savedRange.current
      if (!range || range.collapsed) return

      const anchor = document.createElement('a')
      anchor.href = url
      anchor.target = '_blank'
      anchor.rel = 'noopener noreferrer'
      try {
        range.surroundContents(anchor)
      } catch {
        const frag = range.extractContents()
        anchor.appendChild(frag)
        range.insertNode(anchor)
      }

      editableRef.current?.focus()
      const sel = window.getSelection()
      if (sel) {
        const newRange = document.createRange()
        newRange.selectNodeContents(anchor)
        sel.removeAllRanges()
        sel.addRange(newRange)
      }

      updateActiveFormats()
      emitChange()
    },
    [emitChange, updateActiveFormats],
  )

  // Inserts at the last known caret/selection (replacing any selected content);
  // falls back to the end of the document if the editor was never focused yet.
  const insertImage = useCallback(
    (url: string) => {
      const el = editableRef.current
      if (!el) return
      let range = savedRange.current
      if (!range) {
        range = document.createRange()
        range.selectNodeContents(el)
        range.collapse(false)
      }

      const img = document.createElement('img')
      img.src = url
      img.alt = ''
      img.style.maxWidth = '100%'
      range.deleteContents()
      range.insertNode(img)

      const newRange = document.createRange()
      newRange.setStartAfter(img)
      newRange.collapse(true)

      el.focus()
      const sel = window.getSelection()
      if (sel) {
        sel.removeAllRanges()
        sel.addRange(newRange)
      }
      savedRange.current = newRange.cloneRange()

      updateActiveFormats()
      emitChange()
    },
    [emitChange, updateActiveFormats],
  )

  // No native execCommand toggles inline <code> spans, so this is handled
  // manually via the Range API: unwraps if the caret/selection is already
  // inside a <code>, otherwise wraps the current selection in one.
  const toggleCode = useCallback(() => {
    const el = editableRef.current
    if (!el) return
    restoreSelection()
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0) return

    const anchorNode = sel.anchorNode
    const container = anchorNode?.nodeType === Node.ELEMENT_NODE ? (anchorNode as Element) : anchorNode?.parentElement
    const existingCode = container?.closest('code')

    if (existingCode && el.contains(existingCode)) {
      const parent = existingCode.parentNode
      if (parent) {
        while (existingCode.firstChild) parent.insertBefore(existingCode.firstChild, existingCode)
        parent.removeChild(existingCode)
      }
    } else {
      const range = sel.getRangeAt(0)
      if (range.collapsed) return
      const codeEl = document.createElement('code')
      try {
        range.surroundContents(codeEl)
      } catch {
        const frag = range.extractContents()
        codeEl.appendChild(frag)
        range.insertNode(codeEl)
      }
    }

    updateActiveFormats()
    emitChange()
  }, [emitChange, restoreSelection, updateActiveFormats])

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLDivElement>) => {
      e.preventDefault()
      const text = e.clipboardData.getData('text/plain')
      document.execCommand('insertText', false, text)
      emitChange()
    },
    [emitChange],
  )

  return (
    <div className="flex flex-col h-full min-h-0">
      <ComposeToolbar
        activeFormats={activeFormats}
        currentBlock={currentBlock}
        color={color}
        highlightColor={highlightColor}
        hasSelection={hasSelection}
        exec={exec}
        onUndo={undo}
        onRedo={redo}
        onToggleCode={toggleCode}
        onInsertLink={insertLink}
        onInsertImage={insertImage}
        lang={lang}
        onLangChange={onLangChange}
      />
      <div
        ref={editableRef}
        contentEditable
        suppressContentEditableWarning
        dir={dir}
        lang={lang}
        data-placeholder="Start typing…"
        className="compose-editable flex-1 min-h-0 overflow-y-auto px-4 py-3 text-sm outline-none"
        style={{ color: 'var(--text-primary)' }}
        onInput={emitChange}
        onPaste={handlePaste}
        onFocus={updateActiveFormats}
      />
    </div>
  )
}
