export type Language =
  | 'plaintext'
  | 'json'
  | 'javascript'
  | 'typescript'
  | 'html'
  | 'css'
  | 'markdown'
  | 'python'
  | 'sql'
  | 'yaml'
  | 'xml'
  | 'shell'

export const LANGUAGE_OPTIONS: { value: Language; label: string }[] = [
  { value: 'plaintext', label: 'Plain Text' },
  { value: 'json', label: 'JSON' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'python', label: 'Python' },
  { value: 'sql', label: 'SQL' },
  { value: 'yaml', label: 'YAML' },
  { value: 'xml', label: 'XML' },
  { value: 'shell', label: 'Shell' },
]

export function detectLanguage(text: string): Language {
  const trimmed = text.trim()
  if (!trimmed) return 'plaintext'

  // JSON
  if ((trimmed.startsWith('{') && trimmed.endsWith('}')) ||
      (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
    try {
      JSON.parse(trimmed)
      return 'json'
    } catch {
      // fall through
    }
  }

  // HTML
  if (/<(!DOCTYPE|html|head|body|div|span|p|a|img|script|style)\b/i.test(trimmed)) {
    return 'html'
  }

  // XML
  if (trimmed.startsWith('<?xml') || (trimmed.startsWith('<') && trimmed.endsWith('>'))) {
    return 'xml'
  }

  // SQL
  if (/^\s*(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|WITH)\b/i.test(trimmed)) {
    return 'sql'
  }

  // YAML (key: value pairs, lists with -)
  if (/^---/.test(trimmed) || /^[a-zA-Z_][a-zA-Z0-9_]*:\s/m.test(trimmed)) {
    return 'yaml'
  }

  // Python
  if (/^(def |class |import |from |if __name__)/.test(trimmed) || /^\s*print\(/.test(trimmed)) {
    return 'python'
  }

  // TypeScript (before JS since TS is a superset)
  if (/:\s*(string|number|boolean|any|void|never|unknown)\b/.test(trimmed) ||
      /\binterface\s+\w+/.test(trimmed) ||
      /\btype\s+\w+\s*=/.test(trimmed)) {
    return 'typescript'
  }

  // JavaScript
  if (/\b(const|let|var|function|class|import|export|require|module\.exports)\b/.test(trimmed) ||
      /=>\s*\{/.test(trimmed)) {
    return 'javascript'
  }

  // CSS
  if (/[a-zA-Z-]+\s*:\s*[^;]+;/.test(trimmed) && /\{[\s\S]*\}/.test(trimmed)) {
    return 'css'
  }

  // Markdown
  if (/^#{1,6}\s/.test(trimmed) || /^\s*[-*]\s/.test(trimmed) || /\[.+\]\(.+\)/.test(trimmed)) {
    return 'markdown'
  }

  // Shell
  if (/^#!\/bin\/(bash|sh)/.test(trimmed) || /^\$\s/.test(trimmed)) {
    return 'shell'
  }

  return 'plaintext'
}
