import PDFDocumentWithTables from 'pdfkit-table'

interface PdfTable {
  subtitle?: string
  headers?: string[]
  rows?: string[][]
}

export const generatePdfTable = async (
  tables: PdfTable[],
  options = {},
  title?: string,
): Promise<PDFDocumentWithTables> => {
  const doc = new PDFDocumentWithTables({ margin: 20, size: 'A4' })

  doc.text(title || 'TUSSIS - Reporte del periodo', { align: 'center' })
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
