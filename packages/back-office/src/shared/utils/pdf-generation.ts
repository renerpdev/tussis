import PDFDocumentWithTables from 'pdfkit-table'

interface PdfTable {
  subtitle?: string
  headers?: string[]
  rows?: string[][]
}

export const generatePdfTable = async (
  tables: PdfTable[],
  range?: string,
  options = {},
  title?: string,
): Promise<PDFDocumentWithTables> => {
  const doc = new PDFDocumentWithTables({ margin: 20, size: 'A4' })

  doc.text(title || 'TUSSIS', { align: 'center', stroke: true })
  doc.text(`Periodo: ${range || 'Completo'}`, { align: 'center', height: 10 })
  doc.text('\n')

  await Promise.all(
    tables.map(table => {
      doc.text('\n')
      if (table.rows?.length < 1) doc.text('No existen hay datos para mostrar')
      return doc.table(table, {
        padding: [2],
        ...options,
      })
    }),
  )

  return doc
}
