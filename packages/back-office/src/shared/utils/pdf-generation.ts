import PDFDocumentWithTables from 'pdfkit-table'

interface PdfTable {
  title?: string
  subtitle?: string
  headers?: string[]
  rows?: string[][]
}

export const generatePdfTable = async (
  table: PdfTable,
  options = {},
): Promise<PDFDocumentWithTables> => {
  const doc = new PDFDocumentWithTables({ margin: 20, size: 'A4' })
  // save document

  await doc.table(table, {
    padding: [2],
    ...options,
  })
  if (table.rows?.length < 1) doc.text('No existen hay datos para mostrar')

  return doc
}
