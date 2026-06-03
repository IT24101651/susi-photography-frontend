import { useMemo } from 'react'

export default function MultiImageUpload({
  label,
  currentImages = [],
  removedImageIds = [],
  onRemoveSaved,
  newUploads = [],
  onAddFiles,
  onRemoveNew,
  batchOptions = [],
  batchValue = '',
  onBatchValueChange,
  batchLabel = 'Upload Group',
  batchPlaceholder = 'Select an option',
  getImageMetaLabel,
}) {
  const visibleCurrentImages = useMemo(
    () => currentImages.filter((image) => !removedImageIds.includes(image.id)),
    [currentImages, removedImageIds],
  )

  const handleChange = (e) => {
    const nextFiles = Array.from(e.target.files || [])
    if (!nextFiles.length) return
    onAddFiles?.(nextFiles)
    e.target.value = ''
  }

  return (
    <div className="space-y-3 rounded-xl border border-sand bg-beige/40 p-4">
      {label && <label className="block text-sm font-medium text-text">{label}</label>}

      {visibleCurrentImages.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.18em] text-muted">Saved Photos</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {visibleCurrentImages.map((image) => (
              <div key={image.id} className="overflow-hidden rounded-lg border border-sand bg-white p-2 shadow-sm">
                <img
                  src={image.image}
                  alt={image.title}
                  className="h-28 w-full rounded bg-white object-contain"
                />
                {getImageMetaLabel?.(image) && (
                  <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-[#8c6b43]">
                    {getImageMetaLabel(image)}
                  </p>
                )}
                {onRemoveSaved && (
                  <button
                    type="button"
                    onClick={() => onRemoveSaved(image.id)}
                    className="mt-2 w-full rounded-md border border-red-200 px-3 py-1.5 text-xs text-red-500 transition-colors hover:bg-red-50"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {newUploads.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.18em] text-muted">New Uploads</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {newUploads.map((upload, index) => (
              <div key={`${upload.preview}-${index}`} className="overflow-hidden rounded-lg border border-sand bg-white p-2 shadow-sm">
                <img
                  src={upload.preview}
                  alt={`gallery preview ${index + 1}`}
                  className="h-28 w-full rounded bg-white object-contain"
                />
                {upload.shootPhase && (
                  <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-[#8c6b43]">
                    {batchOptions.find((option) => option.value === upload.shootPhase)?.label || upload.shootPhase}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => onRemoveNew?.(index)}
                  className="mt-2 w-full rounded-md border border-slate-200 px-3 py-1.5 text-xs text-slate-600 transition-colors hover:bg-slate-50"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-lg border border-dashed border-[#ccb38a] bg-white/80 p-4">
        {batchOptions.length > 0 && (
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-text">{batchLabel}</label>
            <select
              value={batchValue}
              onChange={(event) => onBatchValueChange?.(event.target.value)}
              className="w-full rounded-lg border border-sand bg-white px-3 py-2 text-sm text-text focus:border-accent focus:outline-none"
            >
              <option value="">{batchPlaceholder}</option>
              {batchOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        )}
        <p className="mb-3 text-sm text-muted">Select multiple images at once to add them under this main portfolio card.</p>
        <input
          type="file"
          accept="image/*"
          multiple
          className="block w-full cursor-pointer text-sm text-muted file:mr-3 file:rounded file:border-0 file:bg-sand file:px-3 file:py-1 file:text-text file:[content:'Add_Gallery_Photos'] hover:file:bg-accent/20"
          onChange={handleChange}
        />
      </div>

      <p className="text-xs text-muted">
        Saved photos stay until you remove them. New selected files will be added when you save changes.
      </p>
    </div>
  )
}
