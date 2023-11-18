export const downloadBlobFile = (blob: Blob, fileName?: string) => {
  const link = document.createElement('a')
  const url = window.URL.createObjectURL(blob)
  const download = fileName || blob.type.replace('/', '.')

  link.href = url
  link.download = download

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(link.href)
}
