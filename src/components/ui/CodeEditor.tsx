import Editor from '@monaco-editor/react'

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language: string
  formatOnPaste?: boolean
}

export function CodeEditor({ value, onChange, language, formatOnPaste = false }: CodeEditorProps) {
  return (
    <div className="flex-1 min-h-0">
      <Editor
        height="100%"
        language={language}
        theme="vs-dark"
        value={value}
        onChange={(v) => onChange(v ?? '')}
        options={{
          minimap: { enabled: false },
          fontSize: 13,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          tabSize: 2,
          formatOnPaste,
          renderLineHighlight: 'line',
          scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
          fixedOverflowWidgets: true,
          find: { addExtraSpaceOnTop: false },
        }}
      />
    </div>
  )
}
