import { marked } from 'marked'

marked.setOptions({ gfm: true, breaks: true })

export function buildMarkdownDoc(md: string): string {
  const html = marked.parse(md) as string
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
*,*::before,*::after{box-sizing:border-box}
body{margin:0;padding:2rem 2.5rem;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:15px;line-height:1.75;color:#1a1a2e;background:#ffffff;max-width:860px;margin-left:auto;margin-right:auto}
h1,h2,h3,h4,h5,h6{margin:1.5em 0 0.5em;font-weight:700;line-height:1.3;color:#0d0d1a}
h1{font-size:2em;border-bottom:2px solid #e2e8f0;padding-bottom:.4em}
h2{font-size:1.5em;border-bottom:1px solid #e2e8f0;padding-bottom:.3em}
h3{font-size:1.25em}
p{margin:0.75em 0}
a{color:#4f46e5;text-decoration:underline}
a:hover{color:#3730a3}
code{font-family:'SFMono-Regular',Consolas,monospace;font-size:.875em;background:#f1f5f9;border:1px solid #e2e8f0;border-radius:4px;padding:.15em .4em}
pre{background:#1e1e2e;color:#cdd6f4;border-radius:8px;padding:1.25em 1.5em;overflow-x:auto;margin:1em 0}
pre code{background:none;border:none;padding:0;font-size:.875em;color:inherit}
blockquote{margin:1em 0;padding:.5em 1em;border-left:4px solid #6366f1;background:#f8f7ff;color:#4b5563;border-radius:0 6px 6px 0}
blockquote p{margin:0}
ul,ol{padding-left:1.75em;margin:.75em 0}
li{margin:.3em 0}
table{border-collapse:collapse;width:100%;margin:1em 0}
th,td{border:1px solid #e2e8f0;padding:.5em .75em;text-align:left}
th{background:#f8fafc;font-weight:600}
tr:nth-child(even){background:#fafafa}
img{max-width:100%;height:auto;border-radius:6px}
hr{border:none;border-top:1px solid #e2e8f0;margin:2em 0}
</style>
</head>
<body>${html}</body>
</html>`
}
