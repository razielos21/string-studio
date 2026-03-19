import { DiffEditor } from '@monaco-editor/react'
import { type Language } from './comparator.utils'

interface DiffViewProps {
  // original = Text A (left), modified = Text B (right) — Monaco naming convention
  original: string
  modified: string
  language: Language
  inline: boolean
  ignoreWhitespace: boolean
}

export function DiffView({ original, modified, language, inline, ignoreWhitespace }: DiffViewProps) {
  return (
    <div className="flex-1 min-h-0">
      <DiffEditor
        height="100%"
        language={language}
        theme="vs-dark"
        original={original}
        modified={modified}
        options={{
          renderSideBySide: !inline,
          minimap: { enabled: false },
          fontSize: 13,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          wordWrap: 'off',
          ignoreTrimWhitespace: ignoreWhitespace,
          scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
          fixedOverflowWidgets: true,
          find: { addExtraSpaceOnTop: false },
          originalEditable: false,
          readOnly: true,
        }}
      />
    </div>
  )
}
