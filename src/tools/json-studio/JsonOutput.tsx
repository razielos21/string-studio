import Editor from '@monaco-editor/react'

interface JsonOutputProps {
  value: string
}

export function JsonOutput({ value }: JsonOutputProps) {
  return (
    <div className="flex-1 min-h-0">
      <Editor
        height="100%"
        language="json"
        theme="vs-dark"
        value={value}
        options={{
          readOnly: true,
          minimap: { enabled: false },
          fontSize: 13,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          wordWrap: 'off',
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
