/* eslint-disable @typescript-eslint/no-explicit-any */
import { marked, type Token, type Tokens } from 'marked'
import type { TDocumentDefinitions } from 'pdfmake/interfaces'

// ── Helpers ──────────────────────────────────────────────────────────────────

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
}

// Resolves a text/paragraph token to an inline pdfmake content array.
// Falls back to decoding the raw .text when sub-tokens are absent (tight list items).
function resolveInline(tok: Tokens.Text | Tokens.Paragraph): any[] {
  if (tok.tokens && tok.tokens.length > 0) return inlineToText(tok.tokens as Token[])
  return [decodeHtmlEntities((tok as any).text)]
}

// ── Inline tokens → pdfmake inline content ───────────────────────────────────

// Always returns an array so call sites never need Array.isArray guards.
function inlineToText(tokens: Token[]): any[] {
  const result: any[] = []
  for (const token of tokens) {
    switch (token.type) {
      case 'text': {
        const t = token as Tokens.Text
        if (t.tokens && t.tokens.length > 0) {
          result.push(...inlineToText(t.tokens as Token[]))
        } else {
          result.push(decodeHtmlEntities(t.text))
        }
        break
      }
      case 'strong': {
        result.push({ text: inlineToText((token as Tokens.Strong).tokens), bold: true })
        break
      }
      case 'em': {
        result.push({ text: inlineToText((token as Tokens.Em).tokens), italics: true })
        break
      }
      case 'codespan': {
        result.push({ text: decodeHtmlEntities((token as Tokens.Codespan).text), fontSize: 9.5, color: '#6366f1', background: '#f1f5f9' })
        break
      }
      case 'link': {
        const t = token as Tokens.Link
        result.push({ text: inlineToText(t.tokens), link: t.href, color: '#4f46e5', decoration: 'underline' })
        break
      }
      case 'del': {
        result.push({ text: inlineToText((token as Tokens.Del).tokens), decoration: 'lineThrough' })
        break
      }
      case 'br':
        result.push('\n')
        break
      case 'image': {
        const t = token as Tokens.Image
        result.push({ text: `[image: ${t.text || t.href}]`, color: '#9b99b8', italics: true })
        break
      }
      case 'html':
        result.push((token as Tokens.HTML).text.replace(/<[^>]+>/g, ''))
        break
      case 'escape':
        result.push(decodeHtmlEntities((token as Tokens.Escape).text))
        break
      default:
        if ('text' in token) result.push(decodeHtmlEntities(String((token as any).text)))
    }
  }
  return result
}

// ── Block tokens → pdfmake content ───────────────────────────────────────────

function tokensToContent(tokens: Token[]): any[] {
  const out: any[] = []
  for (const token of tokens) {
    switch (token.type) {
      case 'heading':    out.push(headingToContent(token as Tokens.Heading)); break
      case 'paragraph':  out.push(paragraphToContent(token as Tokens.Paragraph)); break
      case 'code':       out.push(codeBlockToContent(token as Tokens.Code)); break
      case 'blockquote': out.push(blockquoteToContent(token as Tokens.Blockquote)); break
      case 'list':       out.push(listToContent(token as Tokens.List)); break
      case 'table':      out.push(tableToContent(token as Tokens.Table)); break
      case 'hr':         out.push(hrToContent()); break
      case 'text': {
        // Block-level text — occurs in tight list items passed through the fallback path
        out.push({ text: resolveInline(token as Tokens.Text), marginBottom: 2 })
        break
      }
      case 'space':
      case 'html':       break
    }
  }
  return out
}

function headingToContent(token: Tokens.Heading): any {
  const sizes = [24, 20, 16, 14, 12, 11]
  return {
    text: inlineToText(token.tokens),
    fontSize: sizes[token.depth - 1] ?? 11,
    bold: true,
    color: '#0d0d1a',
    marginTop: token.depth <= 2 ? 16 : 10,
    marginBottom: 4,
  }
}

function paragraphToContent(token: Tokens.Paragraph): any {
  return {
    text: resolveInline(token),
    marginBottom: 6,
    lineHeight: 1.4,
    color: '#1a1a2e',
  }
}

function codeBlockToContent(token: Tokens.Code): any {
  return {
    table: {
      widths: ['*'],
      body: [[{
        text: token.text,
        fontSize: 9,
        color: '#cdd6f4',
        fillColor: '#1e1e2e',
        margin: [12, 10, 12, 10],
      }]],
    },
    layout: 'noBorders',
    marginTop: 6,
    marginBottom: 6,
  }
}

function blockquoteToContent(token: Tokens.Blockquote): any {
  return {
    table: {
      widths: [4, '*'],
      body: [[
        { text: '', fillColor: '#6366f1', margin: [0, 0, 0, 0] },
        { stack: tokensToContent(token.tokens), margin: [8, 4, 8, 4], color: '#4b5563' },
      ]],
    },
    layout: 'noBorders',
    marginTop: 6,
    marginBottom: 6,
  }
}

function listToContent(token: Tokens.List): any {
  const items = token.items.map(item => listItemToContent(item))
  if (token.ordered) {
    return { ol: items, start: typeof token.start === 'number' ? token.start : 1, marginBottom: 6 }
  }
  return { ul: items, marginBottom: 6 }
}

function listItemToContent(item: Tokens.ListItem): any {
  const prefix = item.task ? (item.checked ? '☑ ' : '☐ ') : ''
  const blockTokens = item.tokens.filter(t => t.type !== 'space')
  if (blockTokens.length === 1 && (blockTokens[0].type === 'paragraph' || blockTokens[0].type === 'text')) {
    const tok = blockTokens[0] as Tokens.Paragraph | Tokens.Text
    const inline = resolveInline(tok)
    return { text: prefix ? [prefix, ...inline] : inline }
  }
  return { stack: tokensToContent(item.tokens) }
}

function tableToContent(token: Tokens.Table): any {
  const headerRow = token.header.map(cell => ({
    text: inlineToText(cell.tokens),
    bold: true,
    fillColor: '#f8fafc',
    alignment: cell.align ?? 'left',
    margin: [6, 4, 6, 4],
  }))

  const bodyRows = token.rows.map((row, rowIdx) =>
    row.map(cell => ({
      text: inlineToText(cell.tokens),
      alignment: cell.align ?? 'left',
      margin: [6, 3, 6, 3],
      fillColor: rowIdx % 2 === 1 ? '#fafafa' : undefined,
    }))
  )

  return {
    table: {
      headerRows: 1,
      widths: token.header.map(() => '*'),
      body: [headerRow, ...bodyRows],
    },
    layout: {
      hLineWidth: () => 1,
      vLineWidth: () => 1,
      hLineColor: () => '#e2e8f0',
      vLineColor: () => '#e2e8f0',
    },
    marginTop: 8,
    marginBottom: 8,
  }
}

function hrToContent(): any {
  return {
    canvas: [{
      type: 'line',
      x1: 0, y1: 0,
      x2: 451, y2: 0,
      lineWidth: 1,
      lineColor: '#e2e8f0',
    }],
    marginTop: 12,
    marginBottom: 12,
  }
}

// ── PDF build + download ──────────────────────────────────────────────────────

async function buildAndDownload(content: any[]): Promise<void> {
  const [{ default: pdfMakeLib }, pdfFontsModule] = await Promise.all([
    import('pdfmake/build/pdfmake'),
    import('pdfmake/build/vfs_fonts'),
  ])
  const pdfMake = pdfMakeLib as any
  const pdfFonts = pdfFontsModule as any
  // vfs_fonts is a UMD bundle; shape varies by bundler/version — try all known paths
  pdfMake.vfs = pdfFonts.default?.pdfMake?.vfs ?? pdfFonts.pdfMake?.vfs ?? pdfFonts.default ?? pdfFonts

  const docDef: TDocumentDefinitions = {
    content,
    defaultStyle: {
      font: 'Roboto',
      fontSize: 11,
      lineHeight: 1.4,
      color: '#1a1a2e',
    },
    pageMargins: [72, 60, 72, 60],
    pageSize: 'A4',
  }

  pdfMake.createPdf(docDef).download('stringstudio.pdf')
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function downloadMarkdownPdf(md: string): Promise<void> {
  const tokens = marked.lexer(md)
  const content = tokensToContent(tokens as Token[])
  await buildAndDownload(content)
}
