# String Studio

A single-page developer text utility app — replace the half-dozen browser tabs you keep open for formatting, diffing, and transforming text.

**No backend. No accounts. Data never leaves your machine.**

**Live: [string-studio.vercel.app](https://www.stringstudio.dev/)**

---

## Tools

### JSON Studio
- Format / pretty-print with 2 or 4 space indentation
- Fix malformed JSON (missing quotes, trailing commas, unquoted keys) via `jsonrepair`
- Minify to a single line
- Live parse-error banner with exact line and column numbers
- Copy output to clipboard
- Tree view with hover-to-copy dot-path on any node (e.g. `user.address.city`)

### Comparator
- Side-by-side or inline diff powered by Monaco DiffEditor
- Auto-detects language (JSON, TypeScript, JavaScript, HTML, CSS, Python, SQL, YAML, Markdown, Shell)
- Manual language override
- Diff stats bar showing lines added / removed / unchanged
- Ignore whitespace and ignore case toggles

### Text Playground
- 22 string operations, applied on click and chainable — each operation runs on the previous output
- **Case**: UPPER, lower, Title, Sentence, camelCase, snake_case, kebab-case
- **Whitespace**: Trim ends, collapse spaces, remove blank lines, normalize line endings
- **Find & Replace**: literal or regex, with match count feedback and inline regex error display
- **Lines**: Sort A→Z, Sort Z→A, remove duplicates, reverse, add line numbers
- **Encoding**: Base64 encode/decode, URL encode/decode, HTML escape/unescape

### HTML Simulator
- Paste HTML and see it rendered instantly in a sandboxed iframe
- Supports inline CSS and JavaScript
- Live preview toggle (debounced 300ms) or manual Preview button
- Resizable editor/preview split pane
- Export to PDF via browser print dialog

### Markdown Preview
- Live Markdown preview with GitHub Flavored Markdown (GFM) — tables, code blocks, blockquotes, strikethrough
- Monaco editor with Markdown language support
- Live preview toggle (debounced 300ms) or manual Preview button
- Resizable editor/preview split pane
- Export to PDF via browser print dialog

### JWT Decoder
- Paste any JWT to decode header, payload, and signature into three panels
- Highlights expiry (`exp`) relative to now — valid / expires soon / expired
- Decode-only — no secret key required or accepted
- Hover any JSON node in the tree view to copy its dot-path

---

## Features

- **Persistent** — editor content survives page refresh via `localStorage`
- **Keyboard shortcuts** — `Alt+1–6` to jump between tools, `?` for shortcut reference
- **Keyboard accessible** — all interactive elements reachable by tab, focus indicators on every control
- **Dark only** — OLED-friendly deep dark theme with per-tool accent colors (green / indigo / amber / cyan / rose / purple)

---

## Tech Stack

| Layer | Library |
|---|---|
| Framework | React 19 + TypeScript 5 |
| Build | Vite 6 |
| Styling | Tailwind CSS 4 (CSS-first, no config file) |
| Editors | `@monaco-editor/react` (VS Code engine) |
| JSON repair | `jsonrepair` |
| Diff stats | `diff` (jsdiff) |
| Markdown | `marked` (GFM) |
| Icons | `lucide-react` |
| Routing | `react-router-dom` v7 |

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

```bash
npm run build    # production build → dist/
npm run preview  # preview the production build locally
```

---

## Deployment

The project includes a `vercel.json` that rewrites all routes to `index.html` for client-side routing. Deploy by connecting the repo to Vercel — no configuration needed.

For other static hosts, apply the same SPA rewrite rule (all paths → `index.html`).

---

## License
MIT
