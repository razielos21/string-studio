import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { createTwoFilesPatch } from 'diff'
import { z } from 'zod'
import { fixJson, formatJson, minifyJson, validateJson, type JsonResult } from '../src/tools/json-studio/json-studio.utils.js'
import * as text from '../src/tools/text-playground/text-playground.utils.js'
import { computeDiffStats, detectLanguage, normalizeForDiff } from '../src/tools/comparator/comparator.utils.js'
import { decodeJwt, EXPIRING_SOON_SECS, getExpStatus, nowSecs } from '../src/tools/jwt-decoder/jwt.utils.js'
import { buildMarkdownDoc, markdownToHtml } from '../src/tools/markdown-preview/markdown-preview.utils.js'
import {
  buildHtmlDocument,
  dirForLang,
  FONT_OPTIONS,
  LANGUAGE_OPTIONS,
  type ComposeFont,
  type ComposeLang,
} from '../src/tools/html-simulator/compose.utils.js'

// ─── Limits ──────────────────────────────────────────────────────────────────

const MAX_INPUT = 1_000_000
/** Tighter cap when a user-supplied regex runs, to bound catastrophic backtracking. */
const MAX_REGEX_INPUT = 100_000

const input = (description: string) => z.string().max(MAX_INPUT).describe(description)
const indent = z.union([z.literal(2), z.literal(4)]).default(2).describe('Spaces per indent level')

// ─── Result helpers ──────────────────────────────────────────────────────────

function ok(value: string) {
  return { content: [{ type: 'text' as const, text: value }] }
}

function okJson(value: unknown) {
  return ok(JSON.stringify(value, null, 2))
}

function fail(message: string) {
  return { isError: true, content: [{ type: 'text' as const, text: message }] }
}

/** Maps a json-studio `{ output, error }` result to a tool result. */
function fromJsonResult({ output, error }: JsonResult) {
  return error ? fail(error) : ok(output)
}

// ─── Text transforms ─────────────────────────────────────────────────────────

const TRANSFORMS = {
  upper_case: text.toUpperCase,
  lower_case: text.toLowerCase,
  title_case: text.toTitleCase,
  sentence_case: text.toSentenceCase,
  camel_case: text.toCamelCase,
  snake_case: text.toSnakeCase,
  kebab_case: text.toKebabCase,
  trim: text.trimEnds,
  collapse_spaces: text.collapseSpaces,
  remove_blank_lines: text.removeBlankLines,
  normalize_line_endings: text.normalizeLineEndings,
  sort_lines_az: text.sortLinesAZ,
  sort_lines_za: text.sortLinesZA,
  remove_duplicate_lines: text.removeDuplicateLines,
  reverse_lines: text.reverseLines,
  add_line_numbers: text.addLineNumbers,
  base64_encode: text.base64Encode,
  base64_decode: text.base64Decode,
  url_encode: text.urlEncode,
  url_decode: text.urlDecode,
  html_escape: text.htmlEscape,
  html_unescape: text.htmlUnescape,
} satisfies Record<string, (s: string) => string>

type TransformName = keyof typeof TRANSFORMS

const TRANSFORM_NAMES = Object.keys(TRANSFORMS) as [TransformName, ...TransformName[]]

const LANG_VALUES = LANGUAGE_OPTIONS.map((o) => o.value) as [ComposeLang, ...ComposeLang[]]
const FONT_VALUES = FONT_OPTIONS.map((o) => o.value) as [ComposeFont, ...ComposeFont[]]

// ─── Server ──────────────────────────────────────────────────────────────────

export function createServer(): McpServer {
  const server = new McpServer({ name: 'string-studio', version: '1.0.0' })

  // JSON

  server.registerTool(
    'json_format',
    {
      description: 'Pretty-print a JSON string. Fails if the input is not valid JSON (use json_fix for malformed input).',
      inputSchema: { json: input('JSON text'), indent },
      annotations: { readOnlyHint: true },
    },
    async ({ json, indent }) => fromJsonResult(formatJson(json, indent)),
  )

  server.registerTool(
    'json_fix',
    {
      description:
        'Repair malformed JSON (trailing commas, single quotes, unquoted keys, comments, missing brackets, etc.) and return it pretty-printed.',
      inputSchema: { json: input('Possibly malformed JSON text'), indent },
      annotations: { readOnlyHint: true },
    },
    async ({ json, indent }) => fromJsonResult(fixJson(json, indent)),
  )

  server.registerTool(
    'json_minify',
    {
      description: 'Minify JSON to a single line. Attempts repair first if the input is malformed.',
      inputSchema: { json: input('JSON text') },
      annotations: { readOnlyHint: true },
    },
    async ({ json }) => fromJsonResult(minifyJson(json)),
  )

  server.registerTool(
    'json_validate',
    {
      description: 'Check whether a string is valid JSON. Returns { valid, message?, line?, col? }.',
      inputSchema: { json: input('JSON text') },
      annotations: { readOnlyHint: true },
    },
    async ({ json }) => {
      const error = validateJson(json)
      return okJson(error ? { valid: false, ...error } : { valid: true })
    },
  )

  // Text

  server.registerTool(
    'text_transform',
    {
      description:
        'Apply a text transformation: case conversion, whitespace cleanup, line operations, or encoding/decoding. ' +
        'For find & replace use operation "find_replace" with `find`, `replace` and optional `regex`.',
      inputSchema: {
        text: input('Input text'),
        operation: z.enum([...TRANSFORM_NAMES, 'find_replace']),
        find: z.string().max(10_000).optional().describe('find_replace only: text or regex pattern to search for'),
        replace: z.string().max(MAX_INPUT).optional().describe('find_replace only: replacement ($1 etc. work in regex mode)'),
        regex: z.boolean().default(false).describe('find_replace only: treat `find` as a regular expression'),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ text: s, operation, find, replace, regex }) => {
      try {
        if (operation === 'find_replace') {
          if (!find) return fail('find_replace requires a non-empty `find`')
          if (regex) {
            if (!text.isValidRegex(find)) return fail(`Invalid regular expression: ${find}`)
            if (s.length > MAX_REGEX_INPUT) return fail(`Regex find_replace is limited to ${MAX_REGEX_INPUT} characters of input`)
          }
          return ok(text.findReplace(s, find, replace ?? '', regex))
        }
        return ok(TRANSFORMS[operation](s))
      } catch (e) {
        return fail((e as Error).message)
      }
    },
  )

  server.registerTool(
    'text_stats',
    {
      description: 'Count characters, words and lines in a text.',
      inputSchema: { text: input('Input text') },
      annotations: { readOnlyHint: true },
    },
    async ({ text: s }) => okJson(text.getStats(s)),
  )

  // Comparator

  server.registerTool(
    'text_diff',
    {
      description:
        'Line-diff two texts. Returns added/removed/unchanged line counts and a unified diff patch (A = original, B = modified). ' +
        'When ignoreCase/ignoreWhitespace are set, the patch shows the normalized (lowercased/trimmed) text, not the original.',
      inputSchema: {
        a: input('Original text (left side)'),
        b: input('Modified text (right side)'),
        ignoreCase: z.boolean().default(false),
        ignoreWhitespace: z.boolean().default(false).describe('Trim leading/trailing whitespace on every line before comparing'),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ a, b, ignoreCase, ignoreWhitespace }) => {
      const [left, right] = normalizeForDiff(a, b, { ignoreCase, ignoreWhitespace })
      const stats = computeDiffStats(left, right) ?? { added: 0, removed: 0, unchanged: 0, identical: true }
      const patch = stats.identical ? '' : createTwoFilesPatch('a', 'b', left, right)
      return okJson({ ...stats, patch })
    },
  )

  server.registerTool(
    'detect_language',
    {
      description:
        'Heuristically detect the language of a snippet: json, javascript, typescript, html, css, markdown, python, sql, yaml, xml, shell, or plaintext.',
      inputSchema: { text: input('Code or text snippet') },
      annotations: { readOnlyHint: true },
    },
    async ({ text: s }) => ok(detectLanguage(s)),
  )

  // JWT

  server.registerTool(
    'jwt_decode',
    {
      description:
        'Decode a JWT into header and payload. Decode only: the signature is NOT verified. ' +
        `If the payload has \`exp\`, also returns expStatus (valid | expiring (<${EXPIRING_SOON_SECS / 60} min) | expired) and expiresAt (ISO).`,
      inputSchema: { token: z.string().max(100_000).describe('JWT (header.payload.signature)') },
      annotations: { readOnlyHint: true },
    },
    async ({ token }) => {
      const decoded = decodeJwt(token.trim())
      if (!decoded) return fail('Token is empty')
      if (!decoded.ok) return fail(decoded.error)
      const { exp } = decoded.payload
      const expiry =
        typeof exp === 'number'
          ? { expStatus: getExpStatus(exp - nowSecs()), expiresAt: new Date(exp * 1000).toISOString() }
          : {}
      return okJson({ header: decoded.header, payload: decoded.payload, signature: decoded.signature, ...expiry })
    },
  )

  // Markdown

  server.registerTool(
    'markdown_to_html',
    {
      description:
        'Convert Markdown (GitHub-flavored, single newlines become <br>) to HTML. ' +
        'Set fullDocument to get a standalone styled HTML page instead of a fragment.',
      inputSchema: { markdown: input('Markdown text'), fullDocument: z.boolean().default(false) },
      annotations: { readOnlyHint: true },
    },
    async ({ markdown, fullDocument }) => ok(fullDocument ? buildMarkdownDoc(markdown) : markdownToHtml(markdown)),
  )

  // HTML

  server.registerTool(
    'html_build_document',
    {
      description:
        'Wrap an HTML body fragment in a complete HTML document with lang/dir set (Hebrew → RTL) and a base stylesheet. ' +
        'The body is inserted as-is and is NOT sanitized.',
      inputSchema: {
        body: input('HTML body fragment'),
        lang: z.enum(LANG_VALUES).default('en'),
        font: z.enum(FONT_VALUES).default('sans'),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ body, lang, font }) => ok(buildHtmlDocument(body, lang, dirForLang(lang), font)),
  )

  return server
}
