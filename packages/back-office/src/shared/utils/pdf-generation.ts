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
      margin: 20,
      size: 'A4',
      bufferPages: true,
    })

    doc.table(table, {
      padding: [2],
      ...options,
    })
    if (table.rows?.length < 1) doc.text('No existen hay datos para mostrar')

    const buffer = []
    doc.on('data', buffer.push.bind(buffer))
    doc.on('end', () => {
      const data = Buffer.concat(buffer)
      resolve(data)
    })
    doc.end()
  })
}
