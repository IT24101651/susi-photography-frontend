import { useState, useEffect } from 'react'

export default function ImageUpload({ label, name, register, currentUrl }) {
  const [preview, setPreview] = useState(currentUrl || null)

  useEffect(() => {
    setPreview(currentUrl || null)
  }, [currentUrl])

  useEffect(() => {
    return () => {
      if (preview?.startsWith('blob:')) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  const handleChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (preview?.startsWith('blob:')) {
      URL.revokeObjectURL(preview)
    }

    setPreview(URL.createObjectURL(file))
  }

  const field = register(name)

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-text">{label}</label>}
      {preview && (
        <img src={preview} alt="preview" className="h-32 w-auto rounded object-cover border border-sand" />
      )}
      <input
        type="file"
        accept="image/*"
        className="block w-full text-sm text-muted file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:bg-sand file:text-text hover:file:bg-accent/20 cursor-pointer"
        {...field}
        onChange={(e) => { handleChange(e); field.onChange(e) }}
      />
      {preview && <p className="text-xs text-muted">Leave empty to keep current image</p>}
    </div>
  )
}
