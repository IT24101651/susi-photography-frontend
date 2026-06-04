const DEFAULT_MAX_WIDTH = 1800
const DEFAULT_MAX_HEIGHT = 1800
const DEFAULT_QUALITY = 0.84

const getEnvValue = (key) => (import.meta.env[key] || '').trim()

const getCloudinaryConfig = () => {
  const cloudName = getEnvValue('VITE_CLOUDINARY_CLOUD_NAME')
  const uploadPreset = getEnvValue('VITE_CLOUDINARY_UPLOAD_PRESET')
  const folder = getEnvValue('VITE_CLOUDINARY_UPLOAD_FOLDER')

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary upload config is missing. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.')
  }

  return { cloudName, uploadPreset, folder }
}

export const hasCloudinaryUploadConfig = () =>
  Boolean(getEnvValue('VITE_CLOUDINARY_CLOUD_NAME') && getEnvValue('VITE_CLOUDINARY_UPLOAD_PRESET'))

const getImageDimensions = (file) =>
  new Promise((resolve, reject) => {
    if (typeof createImageBitmap === 'function') {
      createImageBitmap(file)
        .then((bitmap) => resolve({ width: bitmap.width, height: bitmap.height, bitmap }))
        .catch(reject)
      return
    }

    const image = new Image()
    const objectUrl = URL.createObjectURL(file)

    image.onload = () => {
      URL.revokeObjectURL(objectUrl)
      resolve({ width: image.naturalWidth, height: image.naturalHeight, image })
    }

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Failed to read image dimensions'))
    }

    image.src = objectUrl
  })

export const prepareCloudinaryImage = async (file, { maxWidth = DEFAULT_MAX_WIDTH, maxHeight = DEFAULT_MAX_HEIGHT, quality = DEFAULT_QUALITY } = {}) => {
  if (!(file instanceof File)) return file

  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return file
  }

  try {
    const { width, height, bitmap, image } = await getImageDimensions(file)
    const scale = Math.min(maxWidth / width, maxHeight / height, 1)
    const targetWidth = Math.max(1, Math.round(width * scale))
    const targetHeight = Math.max(1, Math.round(height * scale))

    if (scale === 1 && file.size < 3_500_000) {
      if (bitmap?.close) bitmap.close()
      return file
    }

    const canvas = document.createElement('canvas')
    canvas.width = targetWidth
    canvas.height = targetHeight
    const context = canvas.getContext('2d')
    if (!context) {
      if (bitmap?.close) bitmap.close()
      return file
    }

    context.drawImage(bitmap || image, 0, 0, targetWidth, targetHeight)

    const blob = await new Promise((resolve) => {
      canvas.toBlob((value) => resolve(value), 'image/jpeg', quality)
    })

    if (bitmap?.close) bitmap.close()
    if (!blob) return file

    const baseName = file.name.replace(/\.[^.]+$/, '') || 'image'
    return new File([blob], `${baseName}.jpg`, { type: 'image/jpeg', lastModified: Date.now() })
  } catch {
    return file
  }
}

export const uploadFilesToCloudinary = async (files = [], { maxWidth, maxHeight, quality } = {}) => {
  if (!files.length) return []

  const { cloudName, uploadPreset, folder } = getCloudinaryConfig()
  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`

  return Promise.all(
    files.map(async (file, index) => {
      const preparedFile = await prepareCloudinaryImage(file, { maxWidth, maxHeight, quality })
      const formData = new FormData()
      formData.append('file', preparedFile)
      formData.append('upload_preset', uploadPreset)
      if (folder) formData.append('folder', folder)

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(text || `Cloudinary upload failed for file ${index + 1}`)
      }

      const data = await response.json()
      return {
        publicId: data.public_id,
        secureUrl: data.secure_url,
        width: data.width,
        height: data.height,
        format: data.format,
      }
    }),
  )
}
