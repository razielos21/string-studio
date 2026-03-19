import { describe, it, expect } from 'vitest'
import {
  toUpperCase,
  toLowerCase,
  toTitleCase,
  toSentenceCase,
  toCamelCase,
  toSnakeCase,
  toKebabCase,
  trimEnds,
  collapseSpaces,
  removeBlankLines,
  normalizeLineEndings,
  findReplace,
  escapeRegex,
  sortLinesAZ,
  sortLinesZA,
  removeDuplicateLines,
  reverseLines,
  addLineNumbers,
  base64Encode,
  base64Decode,
  urlEncode,
  urlDecode,
  htmlEscape,
  htmlUnescape,
  getStats,
} from '../tools/text-playground/text-playground.utils'

// ── Case transforms ──────────────────────────────────────────────────────────

describe('toUpperCase', () => {
  it('converts to uppercase', () => expect(toUpperCase('hello world')).toBe('HELLO WORLD'))
})

describe('toLowerCase', () => {
  it('converts to lowercase', () => expect(toLowerCase('HELLO WORLD')).toBe('hello world'))
})

describe('toTitleCase', () => {
  it('capitalizes each word', () => expect(toTitleCase('hello world')).toBe('Hello World'))
  it('handles already-titlecase', () => expect(toTitleCase('Hello World')).toBe('Hello World'))
})

describe('toSentenceCase', () => {
  it('capitalizes first letter and lowercases rest', () => {
    expect(toSentenceCase('HELLO WORLD')).toBe('Hello world')
  })
  it('handles multiple sentences', () => {
    const result = toSentenceCase('hello world. foo bar.')
    expect(result).toContain('Hello')
  })
})

describe('toCamelCase', () => {
  it('converts kebab to camelCase', () => expect(toCamelCase('hello-world')).toBe('helloWorld'))
  it('converts snake to camelCase', () => expect(toCamelCase('hello_world')).toBe('helloWorld'))
  it('converts spaces to camelCase', () => expect(toCamelCase('hello world')).toBe('helloWorld'))
})

describe('toSnakeCase', () => {
  it('converts spaces to snake_case', () => expect(toSnakeCase('hello world')).toBe('hello_world'))
  it('converts camelCase to snake_case', () => expect(toSnakeCase('helloWorld')).toBe('hello_world'))
})

describe('toKebabCase', () => {
  it('converts spaces to kebab-case', () => expect(toKebabCase('hello world')).toBe('hello-world'))
  it('converts camelCase to kebab-case', () => expect(toKebabCase('helloWorld')).toBe('hello-world'))
})

// ── Whitespace transforms ────────────────────────────────────────────────────

describe('trimEnds', () => {
  it('removes leading and trailing whitespace', () => {
    expect(trimEnds('  hello  ')).toBe('hello')
  })
})

describe('collapseSpaces', () => {
  it('collapses multiple spaces into one', () => {
    expect(collapseSpaces('hello   world')).toBe('hello world')
  })
  it('preserves leading and trailing spaces', () => {
    // Fixed behavior: only collapses internal runs, does NOT strip leading/trailing
    const result = collapseSpaces('  hello   world  ')
    expect(result).toBe(' hello world ')
  })
  it('collapses tabs', () => {
    expect(collapseSpaces('hello\t\tworld')).toBe('hello world')
  })
})

describe('removeBlankLines', () => {
  it('removes blank lines', () => {
    const input = 'line1\n\nline2\n\n\nline3'
    const result = removeBlankLines(input)
    expect(result).toBe('line1\nline2\nline3')
  })
  it('removes lines with only whitespace', () => {
    const result = removeBlankLines('line1\n   \nline2')
    expect(result).toBe('line1\nline2')
  })
})

describe('normalizeLineEndings', () => {
  it('converts CRLF to LF', () => {
    expect(normalizeLineEndings('hello\r\nworld')).toBe('hello\nworld')
  })
  it('converts CR to LF', () => {
    expect(normalizeLineEndings('hello\rworld')).toBe('hello\nworld')
  })
})

// ── Find & Replace ───────────────────────────────────────────────────────────

describe('escapeRegex', () => {
  it('escapes special regex characters', () => {
    expect(escapeRegex('a.b*c')).toBe('a\\.b\\*c')
    expect(escapeRegex('(foo)')).toBe('\\(foo\\)')
  })
})

describe('findReplace', () => {
  it('replaces all occurrences (literal)', () => {
    expect(findReplace('aaa', 'a', 'b', false)).toBe('bbb')
  })
  it('replaces using regex', () => {
    expect(findReplace('foo123bar', '\\d+', 'NUM', true)).toBe('fooNUMbar')
  })
  it('returns original when find is empty', () => {
    expect(findReplace('hello', '', 'x', false)).toBe('hello')
  })
  it('throws on invalid regex', () => {
    expect(() => findReplace('hello', '[invalid', 'x', true)).toThrow()
  })
})

// ── Line transforms ──────────────────────────────────────────────────────────

describe('sortLinesAZ', () => {
  it('sorts lines alphabetically', () => {
    expect(sortLinesAZ('banana\napple\ncherry')).toBe('apple\nbanana\ncherry')
  })
})

describe('sortLinesZA', () => {
  it('sorts lines in reverse alphabetical order', () => {
    expect(sortLinesZA('apple\nbanana\ncherry')).toBe('cherry\nbanana\napple')
  })
})

describe('removeDuplicateLines', () => {
  it('removes duplicate lines preserving first occurrence', () => {
    expect(removeDuplicateLines('a\nb\na\nc\nb')).toBe('a\nb\nc')
  })
})

describe('reverseLines', () => {
  it('reverses line order', () => {
    expect(reverseLines('a\nb\nc')).toBe('c\nb\na')
  })
})

describe('addLineNumbers', () => {
  it('prepends line numbers', () => {
    expect(addLineNumbers('foo\nbar')).toBe('1. foo\n2. bar')
  })
})

// ── Encoding ─────────────────────────────────────────────────────────────────

describe('base64Encode / base64Decode', () => {
  it('round-trips ASCII strings', () => {
    const original = 'Hello, World!'
    expect(base64Decode(base64Encode(original))).toBe(original)
  })
  it('round-trips Unicode strings', () => {
    const original = 'héllo wörld 🌍'
    expect(base64Decode(base64Encode(original))).toBe(original)
  })
  it('throws on invalid Base64 input', () => {
    expect(() => base64Decode('!!!not base64!!!')).toThrow()
  })
})

describe('urlEncode / urlDecode', () => {
  it('round-trips special characters', () => {
    const original = 'hello world & foo=bar'
    expect(urlDecode(urlEncode(original))).toBe(original)
  })
  it('throws on malformed percent sequences', () => {
    expect(() => urlDecode('%ZZ')).toThrow()
  })
})

describe('htmlEscape / htmlUnescape', () => {
  it('escapes HTML entities', () => {
    expect(htmlEscape('<div class="foo">bar & baz</div>')).toBe(
      '&lt;div class=&quot;foo&quot;&gt;bar &amp; baz&lt;/div&gt;'
    )
  })
  it('round-trips HTML entities', () => {
    const original = '<script>alert("xss")</script>'
    expect(htmlUnescape(htmlEscape(original))).toBe(original)
  })
})

// ── Stats ─────────────────────────────────────────────────────────────────────

describe('getStats', () => {
  it('counts chars, words, and lines', () => {
    const stats = getStats('hello world\nfoo bar')
    expect(stats.chars).toBe(19)
    expect(stats.words).toBe(4)
    expect(stats.lines).toBe(2)
  })
  it('returns zeros for empty string', () => {
    const stats = getStats('')
    expect(stats.chars).toBe(0)
    expect(stats.words).toBe(0)
    expect(stats.lines).toBe(0)
  })
})
