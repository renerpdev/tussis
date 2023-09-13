export const downloadBlobFile = (blob: Blob, fileName?: string) => {
  const link = document.createElement('a')
  link.href = window.URL.createObjectURL(blob)
  link.download = fileName || blob.type.replace('/', '.')
  link.click()
  window.URL.revokeObjectURL(link.href)
}
