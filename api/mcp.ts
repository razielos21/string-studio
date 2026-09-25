// Vercel Function entry — the only Vercel-specific MCP code. All logic lives in mcp/handler.ts.
import { handleMcp } from '../mcp/handler.js'

const env = { apiKey: process.env.MCP_API_KEY }

export const POST = (req: Request) => handleMcp(req, env)
export const GET = POST
export const DELETE = POST
// Vercel routes by named method export — without this, CORS preflight never reaches handleMcp.
export const OPTIONS = POST
