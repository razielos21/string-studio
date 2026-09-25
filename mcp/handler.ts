import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js'
import { createServer } from './tools.js'

/**
 * Host-agnostic MCP endpoint: web-standard Request in, Response out.
 * Hosts (Vercel, Cloudflare, Node/Hono, …) wrap this in a few lines and pass config in via `env`.
 */
export interface McpEnv {
  /**
   * When set, requests must send `Authorization: Bearer <apiKey>`.
   * Unset (the default deployment) = public endpoint; abuse is handled by input caps + host rate limiting.
   */
  apiKey?: string
}

// Public server: allow browser-based MCP clients from any origin. No cookies are used, so `*` is safe.
const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization, Mcp-Session-Id, Mcp-Protocol-Version, Last-Event-ID',
  'Access-Control-Expose-Headers': 'Mcp-Session-Id, Mcp-Protocol-Version, WWW-Authenticate',
  'Access-Control-Max-Age': '86400',
}

function withCors(res: Response): Response {
  const headers = new Headers(res.headers)
  for (const [k, v] of Object.entries(CORS_HEADERS)) headers.set(k, v)
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers })
}

function jsonRpcError(status: number, message: string, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify({ jsonrpc: '2.0', error: { code: -32000, message }, id: null }), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  })
}

/** Constant-time string comparison, so response timing doesn't leak how much of the key matched. */
function safeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder()
  const x = enc.encode(a)
  const y = enc.encode(b)
  let diff = x.length ^ y.length
  for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0)
  return diff === 0
}

function isAuthorized(req: Request, apiKey: string): boolean {
  const header = req.headers.get('authorization') ?? ''
  const match = /^Bearer\s+(.+)$/i.exec(header)
  return match !== null && safeEqual(match[1].trim(), apiKey)
}

export async function handleMcp(req: Request, env: McpEnv = {}): Promise<Response> {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS_HEADERS })
  return withCors(await route(req, env))
}

async function route(req: Request, env: McpEnv): Promise<Response> {
  if (env.apiKey && !isAuthorized(req, env.apiKey)) {
    return jsonRpcError(401, 'Unauthorized', { 'WWW-Authenticate': 'Bearer' })
  }

  // Stateless mode: no sessions, so no server-initiated SSE stream (GET) or session teardown (DELETE).
  if (req.method !== 'POST') {
    return jsonRpcError(405, 'Method not allowed', { Allow: 'POST' })
  }

  // Fresh server + transport per request — nothing is shared between invocations,
  // so this runs on any serverless or multi-instance host.
  const server = createServer()
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  })
  await server.connect(transport)
  try {
    return await transport.handleRequest(req)
  } finally {
    await server.close()
  }
}
