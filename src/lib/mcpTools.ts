// Names of the tools exposed by the MCP server (mcp/tools.ts). Shown on the Home page;
// mcp/handler.test.ts asserts this list matches what the server actually registers.
export const MCP_TOOL_NAMES = [
  'json_format',
  'json_fix',
  'json_minify',
  'json_validate',
  'text_transform',
  'text_stats',
  'text_diff',
  'detect_language',
  'jwt_decode',
  'markdown_to_html',
  'html_build_document',
] as const
