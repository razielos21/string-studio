import Editor from '@monaco-editor/react'

interface ReadOnlyCodeEditorProps {
  value: string
  language: string
  wordWrap?: 'on' | 'off'
}

export function ReadOnlyCodeEditor({ value, language, wordWrap = 'off' }: ReadOnlyCodeEditorProps) {
  return (
    <div className="flex-1 min-h-0">
      <Editor
        height="100%"
        language={language}
        theme="vs-dark"
        value={value}
        options={{
          readOnly: true,
          minimap: { enabled: false },
          fontSize: 13,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          wordWrap,
          tabSize: 2,
          renderLineHighlight: 'none',
          scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
          domReadOnly: true,
          fixedOverflowWidgets: true,
          find: { addExtraSpaceOnTop: false },
        }}
      />
    </div>
  )
}
