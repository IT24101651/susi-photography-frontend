export function normalizeUrl(url) {
  const value = url?.trim()

  if (!value) return ''
  if (/^https?:\/\//i.test(value)) return value

  return `https://${value}`
}
