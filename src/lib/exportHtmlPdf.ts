export async function exportHtmlPdf(html: string): Promise<void> {
  const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
    import('jspdf'),
    import('html2canvas'),
  ])

  const frame = document.createElement('iframe')
  Object.assign(frame.style, {
    position: 'fixed',
    top: '-9999px',
    left: '-9999px',
    width: '794px',
    height: '1123px',
    border: 'none',
  })
  document.body.appendChild(frame)

  await new Promise<void>((resolve, reject) => {
    frame.onload = async () => {
      try {
        const body = frame.contentDocument?.body
        if (!body) { reject(new Error('iframe body unavailable')); return }

        const canvas = await html2canvas(body, {
          useCORS: true,
          allowTaint: true,
          logging: false,
          width: 794,
          windowWidth: 794,
        })

        const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' })
        const pageW = pdf.internal.pageSize.getWidth()
        const pageH = pdf.internal.pageSize.getHeight()
        const imgW = pageW
        const imgH = (canvas.height * pageW) / canvas.width

        // Slice canvas across pages — each page shifts the image up by one page height
        let slicePos = 0
        while (slicePos < imgH) {
          if (slicePos > 0) pdf.addPage()
          // Pass canvas directly to avoid a toDataURL encode→decode roundtrip
          pdf.addImage(canvas as any, 'PNG', 0, -slicePos, imgW, imgH)
          slicePos += pageH
        }

        pdf.save('stringstudio.pdf')
        resolve()
      } catch (e) {
        reject(e)
      } finally {
        frame.remove()
      }
    }
    frame.srcdoc = html
  })
}
