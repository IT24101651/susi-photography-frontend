const fileFieldNames = new Set(['image', 'photo', 'client_photo'])

export function toFormData(obj) {
  const fd = new FormData()
  Object.entries(obj).forEach(([key, val]) => {
    if (val === null || val === undefined) return
    if (Array.isArray(val)) {
      val.forEach((item) => fd.append(key, item))
    } else
    if (typeof FileList !== 'undefined' && val instanceof FileList) {
      Array.from(val).forEach((file) => fd.append(key, file))
    } else if (typeof File !== 'undefined' && val instanceof File) {
      fd.append(key, val)
    } else if (fileFieldNames.has(key) && typeof val === 'string') {
      // Edit forms may hold the current file URL in form state; omit it so the backend keeps the existing file.
      return
    } else {
      fd.append(key, val)
    }
  })
  return fd
}

export function stars(rating) {
  return Array.from({ length: 5 }, (_, i) => i < rating ? '★' : '☆').join('')
}
