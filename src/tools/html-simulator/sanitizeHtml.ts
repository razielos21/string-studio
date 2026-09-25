// Browser-only (uses DOMParser) — kept out of compose.utils.ts so that module stays importable from Node (MCP server).

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
