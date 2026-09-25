import { describe, it, expect } from 'vitest'
import { handleMcp } from './handler.js'
import { MCP_TOOL_NAMES } from '../src/lib/mcpTools.js'

const API_KEY = 'test-key'
const env = { apiKey: API_KEY }

type ToolResult = { isError?: boolean; content: { type: string; text: string }[] }
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- JSON-RPC response bodies are loosely typed
type RpcBody = { result: any }

let nextId = 1

function rpc(method: string, params: unknown = {}, headers: Record<string, string> = {}) {
  return new Request('http://localhost/mcp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/event-stream',
      'MCP-Protocol-Version': '2025-06-18',
      Authorization: `Bearer ${API_KEY}`,
      ...headers,
    },
    body: JSON.stringify({ jsonrpc: '2.0', id: nextId++, method, params }),
  })
}

async function call(name: string, args: Record<string, unknown>) {
  const res = await handleMcp(rpc('tools/call', { name, arguments: args }), env)
  expect(res.status).toBe(200)
  const body = (await res.json()) as RpcBody
  return body.result as ToolResult
}

const textOf = (r: { content: { text: string }[] }) => r.content[0].text

describe('auth', () => {
  it('rejects a missing token', async () => {
    const res = await handleMcp(rpc('tools/list', {}, { Authorization: '' }), env)
    expect(res.status).toBe(401)
    expect(res.headers.get('WWW-Authenticate')).toBe('Bearer')
  })

  it('rejects a wrong token', async () => {
    const res = await handleMcp(rpc('tools/list', {}, { Authorization: 'Bearer nope' }), env)
    expect(res.status).toBe(401)
  })

  it('allows any request when no apiKey is configured', async () => {
    const res = await handleMcp(rpc('tools/list', {}, { Authorization: '' }), {})
    expect(res.status).toBe(200)
  })
})

describe('public mode + CORS', () => {
  it('serves tools without any Authorization header when no apiKey is configured', async () => {
    const res = await handleMcp(rpc('tools/call', { name: 'text_stats', arguments: { text: 'a b' } }, { Authorization: '' }), {})
    expect(res.status).toBe(200)
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*')
  })

  it('answers CORS preflight with 204 and no auth', async () => {
    const res = await handleMcp(new Request('http://localhost/mcp', { method: 'OPTIONS' }), env)
    expect(res.status).toBe(204)
    expect(res.headers.get('Access-Control-Allow-Methods')).toContain('POST')
    expect(res.headers.get('Access-Control-Allow-Headers')).toContain('Mcp-Protocol-Version')
  })

  it('adds CORS headers to error responses too', async () => {
    const res = await handleMcp(rpc('tools/list', {}, { Authorization: '' }), env)
    expect(res.status).toBe(401)
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*')
  })
})

describe('protocol', () => {
  it('rejects non-POST methods in stateless mode', async () => {
    const res = await handleMcp(new Request('http://localhost/mcp', { headers: { Authorization: `Bearer ${API_KEY}` } }), env)
    expect(res.status).toBe(405)
  })

  it('initializes', async () => {
    const res = await handleMcp(
      rpc('initialize', { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'test', version: '1' } }),
      env,
    )
    expect(res.status).toBe(200)
    const body = (await res.json()) as RpcBody
    expect(body.result.serverInfo.name).toBe('string-studio')
  })

  it('lists all 11 tools', async () => {
    const res = await handleMcp(rpc('tools/list'), env)
    const body = (await res.json()) as RpcBody
    const names = body.result.tools.map((t: { name: string }) => t.name).sort()
    expect(names).toHaveLength(11)
    // The Home page's "Use with AI" list must stay in sync with the server.
    expect(names).toEqual([...MCP_TOOL_NAMES].sort())
  })
})

describe('tools', () => {
  it('json_format', async () => {
    expect(textOf(await call('json_format', { json: '{"a":1}' }))).toBe('{\n  "a": 1\n}')
    expect((await call('json_format', { json: '{bad' })).isError).toBe(true)
  })

  it('json_fix', async () => {
    expect(textOf(await call('json_fix', { json: "{a:'x',}", indent: 4 }))).toBe('{\n    "a": "x"\n}')
  })

  it('json_minify', async () => {
    expect(textOf(await call('json_minify', { json: '{ "a": [1, 2] }' }))).toBe('{"a":[1,2]}')
  })

  it('json_validate', async () => {
    expect(JSON.parse(textOf(await call('json_validate', { json: '[1]' })))).toEqual({ valid: true })
    expect(JSON.parse(textOf(await call('json_validate', { json: '[1,' }))).valid).toBe(false)
  })

  it('text_transform', async () => {
    expect(textOf(await call('text_transform', { text: 'hello world', operation: 'snake_case' }))).toBe('hello_world')
    expect(textOf(await call('text_transform', { text: 'héllo', operation: 'base64_encode' }))).toBe('aMOpbGxv')
    expect(
      textOf(await call('text_transform', { text: 'a1 b2', operation: 'find_replace', find: '(\\w)(\\d)', replace: '$2$1', regex: true })),
    ).toBe('1a 2b')
    expect((await call('text_transform', { text: 'x', operation: 'find_replace', find: '(', regex: true })).isError).toBe(true)
    expect((await call('text_transform', { text: '!!!', operation: 'base64_decode' })).isError).toBe(true)
  })

  it('text_transform rejects oversized regex input', async () => {
    const r = await call('text_transform', { text: 'a'.repeat(100_001), operation: 'find_replace', find: 'a', regex: true })
    expect(r.isError).toBe(true)
  })

  it('text_stats', async () => {
    expect(JSON.parse(textOf(await call('text_stats', { text: 'one two\nthree' })))).toEqual({ chars: 13, lines: 2, words: 3 })
  })

  it('text_diff', async () => {
    const r = JSON.parse(textOf(await call('text_diff', { a: 'a\nb\n', b: 'a\nc\n' })))
    expect(r).toMatchObject({ identical: false, added: 1, removed: 1, unchanged: 1 })
    expect(r.patch).toContain('-b')
    expect(r.patch).toContain('+c')

    const same = JSON.parse(textOf(await call('text_diff', { a: 'Foo \n', b: 'foo\n', ignoreCase: true, ignoreWhitespace: true })))
    expect(same).toMatchObject({ identical: true, patch: '' })
  })

  it('detect_language', async () => {
    expect(textOf(await call('detect_language', { text: 'SELECT 1' }))).toBe('sql')
  })

  it('jwt_decode', async () => {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
    const r = JSON.parse(textOf(await call('jwt_decode', { token })))
    expect(r).toMatchObject({ header: { alg: 'HS256' }, payload: { name: 'John Doe' }, expStatus: 'valid' })
    expect((await call('jwt_decode', { token: 'a.b' })).isError).toBe(true)
  })

  it('markdown_to_html', async () => {
    expect(textOf(await call('markdown_to_html', { markdown: '# Hi' }))).toContain('<h1>Hi</h1>')
    expect(textOf(await call('markdown_to_html', { markdown: '# Hi', fullDocument: true }))).toContain('<!DOCTYPE html>')
  })

  it('html_build_document', async () => {
    const html = textOf(await call('html_build_document', { body: '<p>שלום</p>', lang: 'he' }))
    expect(html).toContain('<html lang="he" dir="rtl">')
    expect(html).toContain('<p>שלום</p>')
  })
})
