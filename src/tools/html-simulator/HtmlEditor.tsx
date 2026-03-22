import Editor from '@monaco-editor/react'

interface HtmlEditorProps {
  value: string
  onChange: (value: string) => void
}

export function HtmlEditor({ value, onChange }: HtmlEditorProps) {
  return (
    <div className="flex-1 min-h-0">
      <Editor
        height="100%"
        language="html"
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
          formatOnPaste: false,
          renderLineHighlight: 'line',
          scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
          fixedOverflowWidgets: true,
          find: { addExtraSpaceOnTop: false },
        }}
      />
    </div>
  )
}
