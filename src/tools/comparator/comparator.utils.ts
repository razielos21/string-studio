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

  // JSON — must actually parse
  if (
    (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
    (trimmed.startsWith('[') && trimmed.endsWith(']'))
  ) {
    try {
      JSON.parse(trimmed)
      return 'json'
    } catch {
      // fall through
    }
  }

  // Shell — strong signal, check before general code
  if (/^#!\/(usr\/)?bin\/(env\s+)?(bash|sh|zsh)/.test(trimmed)) {
    return 'shell'
  }

  // SQL — strong verbs at the very start of the string
  if (/^\s*(SELECT|INSERT\s+INTO|UPDATE\s+\w|DELETE\s+FROM|CREATE\s+(TABLE|DATABASE|INDEX)|DROP\s+(TABLE|DATABASE)|ALTER\s+TABLE|WITH\s+\w+\s+AS)\b/i.test(trimmed)) {
    return 'sql'
  }

  // HTML — requires actual HTML tags
  if (/<(!DOCTYPE\s+html|html|head|body)\b/i.test(trimmed)) {
    return 'html'
  }

  // XML — explicit declaration or well-formed root tag (not just any '<')
  if (trimmed.startsWith('<?xml') || /^<[a-zA-Z][a-zA-Z0-9:_-]*(\s[^>]*)?>[\s\S]+<\/[a-zA-Z][a-zA-Z0-9:_-]*>$/.test(trimmed)) {
    return 'xml'
  }

  // TypeScript (before JS — TS is a superset)
  if (
    /\binterface\s+\w+\s*\{/.test(trimmed) ||
    /\btype\s+\w+\s*=/.test(trimmed) ||
    /:\s*(string|number|boolean|void|never|unknown|any)\s*[;,)>]/.test(trimmed) ||
    /<\w+(\s*,\s*\w+)*>/.test(trimmed) && /\b(const|let|function|class)\b/.test(trimmed)
  ) {
    return 'typescript'
  }

  // JavaScript
  if (
    /\b(const|let|var)\s+\w+\s*=/.test(trimmed) ||
    /\bfunction\s+\w+\s*\(/.test(trimmed) ||
    /=>\s*[\{(]/.test(trimmed) ||
    /\b(import|export)\s+(default\s+)?\{/.test(trimmed) ||
    /\brequire\s*\(/.test(trimmed)
  ) {
    return 'javascript'
  }

  // Python — requires distinctive keywords at line start
  if (
    /^(def |class |import |from \w+ import |if __name__\s*==)/.test(trimmed) ||
    /^\s*@\w+/.test(trimmed)
  ) {
    return 'python'
  }

  // CSS — selector followed by block with property declarations
  if (/[.#]?[\w-]+\s*\{[^}]*[\w-]+\s*:[^}]+\}/.test(trimmed)) {
    return 'css'
  }

  // YAML — document marker or multiple key: value lines (not matching CSS/JS colons)
  if (
    /^---/.test(trimmed) ||
    (/^[a-zA-Z_][a-zA-Z0-9_]*:\s+\S/.test(trimmed) &&
      (trimmed.match(/^[a-zA-Z_][\w]*:\s/gm) ?? []).length >= 2)
  ) {
    return 'yaml'
  }

  // Markdown — headings or links (requires at least one strong indicator)
  if (
    /^#{1,6}\s+\S/.test(trimmed) ||
    /\[.+\]\(https?:\/\/.+\)/.test(trimmed) ||
    (/^\s*[-*]\s+\S/.test(trimmed) && /\n\s*[-*]\s+/.test(trimmed))
  ) {
    return 'markdown'
  }

  return 'plaintext'
}
