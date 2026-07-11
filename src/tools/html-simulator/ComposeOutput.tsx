import Editor from '@monaco-editor/react'

interface ComposeOutputProps {
  value: string
}

export function ComposeOutput({ value }: ComposeOutputProps) {
  return (
    <div className="flex-1 min-h-0">
      <Editor
        height="100%"
        language="html"
        theme="vs-dark"
        value={value}
        options={{
          readOnly: true,
          minimap: { enabled: false },
          fontSize: 13,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          wordWrap: 'on',
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
