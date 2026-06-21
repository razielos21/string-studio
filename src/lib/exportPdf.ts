export function exportPdf(html: string): void {
  const win = window.open('', '_blank')
  if (!win) return
  win.document.write(html)
  win.document.close()
  win.addEventListener('afterprint', () => win.close())
  win.print()
}
