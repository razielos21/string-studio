export type ComposeLang = 'en' | 'he'

export const LANGUAGE_OPTIONS: { value: ComposeLang; label: string; dir: 'ltr' | 'rtl' }[] = [
  { value: 'en', label: 'English', dir: 'ltr' },
  { value: 'he', label: 'Hebrew', dir: 'rtl' },
]

export function dirForLang(lang: string): 'ltr' | 'rtl' {
  return LANGUAGE_OPTIONS.find((o) => o.value === lang)?.dir ?? 'ltr'
}

export type ComposeFont =
  | 'sans'
  | 'serif'
  | 'mono'
  | 'inter'
  | 'poppins'
  | 'arial'
  | 'times'
  | 'georgia'
  | 'verdana'
  | 'courier'
  | 'david'
  | 'miriam'
  | 'arial-hebrew'

export const FONT_OPTIONS: { value: ComposeFont; label: string; family: string }[] = [
  { value: 'sans', label: 'Sans-serif', family: 'sans-serif' },
  { value: 'serif', label: 'Serif', family: 'serif' },
  { value: 'mono', label: 'Monospace', family: "ui-monospace, 'SFMono-Regular', Menlo, monospace" },
  { value: 'inter', label: 'Inter', family: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },
  { value: 'poppins', label: 'Poppins', family: "'Poppins', sans-serif" },
  { value: 'arial', label: 'Arial', family: 'Arial, Helvetica, sans-serif' },
  { value: 'times', label: 'Times New Roman', family: '"Times New Roman", Times, serif' },
  { value: 'georgia', label: 'Georgia', family: 'Georgia, serif' },
  { value: 'verdana', label: 'Verdana', family: 'Verdana, Geneva, sans-serif' },
  { value: 'courier', label: 'Courier New', family: '"Courier New", Courier, monospace' },
  { value: 'david', label: 'David (Hebrew)', family: '"David", "Times New Roman", serif' },
  { value: 'miriam', label: 'Miriam (Hebrew)', family: '"Miriam", Arial, sans-serif' },
  { value: 'arial-hebrew', label: 'Arial Hebrew', family: '"Arial Hebrew", Arial, sans-serif' },
]

export function familyForFont(font: ComposeFont): string {
  return FONT_OPTIONS.find((o) => o.value === font)?.family ?? 'sans-serif'
}

const DEFAULT_TEXT_COLOR = '#f1f0ff'
export const DEFAULT_HIGHLIGHT_COLOR = '#fef08a'

export function rgbToHex(rgb: string, fallback: string = DEFAULT_TEXT_COLOR): string {
  const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  if (!match) return rgb.startsWith('#') ? rgb : fallback
  const [, r, g, b] = match
  return '#' + [r, g, b].map((n) => Number(n).toString(16).padStart(2, '0')).join('')
}

export const FORMAT_BLOCK_OPTIONS: { value: string; label: string; tag: string }[] = [
  { value: 'p', label: 'Paragraph', tag: 'p' },
  { value: 'h1', label: 'Heading 1', tag: 'h1' },
  { value: 'h2', label: 'Heading 2', tag: 'h2' },
  { value: 'h3', label: 'Heading 3', tag: 'h3' },
  { value: 'blockquote', label: 'Quote', tag: 'blockquote' },
]

// Pre-derived {value,label} shape for <Select> — computed once at module load
// rather than remapped on every ComposeToolbar render.
export const FORMAT_BLOCK_SELECT_OPTIONS = FORMAT_BLOCK_OPTIONS.map((o) => ({ value: o.value, label: o.label }))
export const LANGUAGE_SELECT_OPTIONS = LANGUAGE_OPTIONS.map((o) => ({ value: o.value, label: o.label }))
export const FONT_SELECT_OPTIONS = FONT_OPTIONS.map((o) => ({ value: o.value, label: o.label }))

const UNSAFE_TAGS = ['script', 'iframe', 'object', 'embed']

export function sanitizeHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html')

  UNSAFE_TAGS.forEach((tag) => {
    doc.querySelectorAll(tag).forEach((el) => el.remove())
  })

  doc.querySelectorAll('*').forEach((el) => {
    Array.from(el.attributes).forEach((attr) => {
      const name = attr.name.toLowerCase()
      const value = attr.value.trim().toLowerCase()
      if (name.startsWith('on') || ((name === 'href' || name === 'src') && value.startsWith('javascript:'))) {
        el.removeAttribute(attr.name)
      }
    })
  })

  return doc.body.innerHTML
}

export function buildHtmlDocument(bodyHtml: string, lang: string, dir: 'ltr' | 'rtl', font: ComposeFont = 'sans'): string {
  return `<!DOCTYPE html>
<html lang="${lang}" dir="${dir}">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: ${familyForFont(font)}; padding: 2rem; }
    h1, h2, h3 { color: #06b6d4; }
    blockquote { border-${dir === 'rtl' ? 'right' : 'left'}: 3px solid rgba(6,182,212,0.4); margin: 0; padding-${dir === 'rtl' ? 'right' : 'left'}: 1rem; color: #6b7280; }
    ul, ol { padding-${dir === 'rtl' ? 'right' : 'left'}: 1.5rem; }
    img { max-width: 100%; height: auto; }
    hr { border: none; border-top: 1px solid rgba(0,0,0,0.15); margin: 1.5rem 0; }
    code { font-family: ui-monospace, monospace; background: rgba(0,0,0,0.06); padding: 0.1em 0.35em; border-radius: 3px; }
  </style>
</head>
<body>
  ${bodyHtml}
</body>
</html>`
}
