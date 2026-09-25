import { useId, useState } from "react";
import { Bot, Plug } from "lucide-react";
import { CopyButton } from "../components/ui/CopyButton";
import { MCP_TOOL_NAMES } from "../lib/mcpTools";

interface Client {
  id: string;
  label: string;
  hint: string;
  snippet: (url: string) => string;
}

const CLIENTS: Client[] = [
  {
    id: "claude-code",
    label: "Claude Code",
    hint: "Run in your terminal.",
    snippet: (url) => `claude mcp add --transport http string-studio ${url}`,
  },
  {
    id: "claude",
    label: "Claude.ai / Desktop",
    hint: "Settings → Connectors → Add custom connector, then paste this URL.",
    snippet: (url) => url,
  },
  {
    id: "cursor",
    label: "Cursor",
    hint: "Add to ~/.cursor/mcp.json (or .cursor/mcp.json in a project).",
    snippet: (url) =>
      JSON.stringify({ mcpServers: { "string-studio": { url } } }, null, 2),
  },
  {
    id: "vscode",
    label: "VS Code",
    hint: "Add to .vscode/mcp.json, then use Copilot in agent mode.",
    snippet: (url) =>
      JSON.stringify(
        { servers: { "string-studio": { type: "http", url } } },
        null,
        2,
      ),
  },
  {
    id: "chatgpt",
    label: "ChatGPT",
    hint: "Settings → Connectors (developer mode) → create a connector with this URL, no authentication.",
    snippet: (url) => url,
  },
  {
    id: "openai-api",
    label: "OpenAI API",
    hint: "Responses API — pass as a remote MCP tool.",
    snippet: (url) =>
      `tools: [{
  type: "mcp",
  server_label: "string-studio",
  server_url: "${url}",
  require_approval: "never",
}]`,
  },
  {
    id: "anthropic-api",
    label: "Anthropic API",
    hint: "Messages API — pass as an MCP connector server.",
    snippet: (url) =>
      `mcp_servers: [{
  type: "url",
  url: "${url}",
  name: "string-studio",
}]`,
  },
];

export function UseWithAi() {
  const mcpUrl = `${window.location.origin}/mcp`;
  const [activeId, setActiveId] = useState(CLIENTS[0].id);
  const active = CLIENTS.find((c) => c.id === activeId) ?? CLIENTS[0];
  const snippet = active.snippet(mcpUrl);
  const baseId = useId();

  function onTabKeyDown(e: React.KeyboardEvent, index: number) {
    const delta = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = CLIENTS[(index + delta + CLIENTS.length) % CLIENTS.length];
    setActiveId(next.id);
    document.getElementById(`${baseId}-tab-${next.id}`)?.focus();
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "var(--bg-glass)",
        border: "1px solid var(--border)",
      }}
    >
      {/* Header */}
      <div
        className="flex flex-col md:flex-row md:items-center gap-5 md:gap-8"
        style={{ padding: "clamp(1.25rem, 2.5vw, 1.75rem)" }}
      >
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: "var(--accent-subtle-bg)",
              border: "1px solid var(--accent-subtle-border)",
            }}
          >
            <Bot size={22} style={{ color: "var(--accent)" }} aria-hidden />
          </div>
          <div className="min-w-0">
            <h2
              className="font-semibold mb-1"
              style={{ fontSize: "1.05rem", color: "var(--text-primary)" }}
            >
              Use String Studio from your AI
            </h2>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              The same tools are available as a remote MCP server. Connect it to
              Claude, ChatGPT, Cursor, VS Code, or your own agent. No API key
              needed.
            </p>
          </div>
        </div>

        {/* Endpoint */}
        <div
          className="flex items-center gap-2 rounded-xl pl-3 pr-1.5 py-1.5 md:max-w-sm w-full min-w-0"
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--accent-subtle-border)",
          }}
        >
          <Plug
            size={13}
            style={{ color: "var(--accent)", flexShrink: 0 }}
            aria-hidden
          />
          <code
            className="font-mono text-xs truncate flex-1"
            style={{ color: "var(--text-primary)" }}
            title={mcpUrl}
          >
            {mcpUrl}
          </code>
          <CopyButton text={mcpUrl} />
        </div>
      </div>

      {/* Client tabs */}
      <div
        role="tablist"
        aria-label="MCP client"
        className="flex gap-1 overflow-x-auto px-3"
        style={{ borderTop: "1px solid var(--border-muted)" }}
      >
        {CLIENTS.map((c, i) => {
          const selected = c.id === active.id;
          return (
            <button
              key={c.id}
              id={`${baseId}-tab-${c.id}`}
              role="tab"
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveId(c.id)}
              onKeyDown={(e) => onTabKeyDown(e, i)}
              className="shrink-0 px-3 py-2.5 text-xs font-medium cursor-pointer transition-colors"
              style={{
                color: selected ? "var(--accent-hover)" : "var(--text-muted)",
                borderBottom: `2px solid ${selected ? "var(--accent)" : "transparent"}`,
              }}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {/* Snippet */}
      <div
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${active.id}`}
        style={{
          background: "var(--bg-surface)",
          borderTop: "1px solid var(--border-muted)",
        }}
      >
        <div className="flex items-center justify-between gap-3 px-4 pt-3">
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
            {active.hint}
          </p>
          <CopyButton text={snippet} />
        </div>
        <pre
          className="font-mono text-[12px] leading-relaxed m-0 px-4 pt-2 pb-4 overflow-x-auto"
          style={{ color: "var(--text-primary)" }}
        >
          {snippet}
        </pre>
      </div>

      {/* Tool list + privacy note */}
      <div
        className="flex flex-col gap-3 px-4 py-3"
        style={{ borderTop: "1px solid var(--border-muted)" }}
      >
        <div className="flex flex-wrap gap-1.5">
          {MCP_TOOL_NAMES.map((t) => (
            <span
              key={t}
              className="font-mono text-[11px] px-2 py-0.5 rounded-full"
              style={{
                background: "var(--accent-subtle-bg)",
                color: "var(--accent-hover)",
                border: "1px solid var(--accent-subtle-border)",
              }}
            >
              {t}
            </span>
          ))}
        </div>
        <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
          The web app still runs entirely in your browser. The MCP endpoint
          only processes what your AI sends it and stores nothing.
        </p>
      </div>
    </div>
  );
}
