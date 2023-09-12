import PdfKitTable from 'pdfkit-table'

interface PdfTable {
  title?: string
  subtitle?: string
  headers?: string[]
  rows?: string[][]
}

export const generatePdfTable = (table: PdfTable, options = {}): Promise<Buffer> => {
  return new Promise(resolve => {
    const doc = new PdfKitTable({
      margin: 30,
      size: 'A4',
      bufferPages: true,
      ...options,
    })

    doc.table(table, {})

    const buffer = []
    doc.on('data', buffer.push.bind(buffer))
    doc.on('end', () => {
      const data = Buffer.concat(buffer)
      resolve(data)
    })
    doc.end()
  })
}
