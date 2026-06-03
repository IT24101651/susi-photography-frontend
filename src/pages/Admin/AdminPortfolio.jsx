import { useEffect, useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import {
  adminGetPortfolio, adminCreatePortfolio, adminUpdatePortfolio, adminDeletePortfolio,
  adminGetCategories,
} from '../../api/endpoints'
import AdminTable from '../../components/admin/AdminTable'
import Modal from '../../components/ui/Modal'
import ImageUpload from '../../components/ui/ImageUpload'
import MultiImageUpload from '../../components/ui/MultiImageUpload'
import TitleWithHeartDivider from '../../components/ui/TitleWithHeartDivider'
import { toFormData } from '../../utils'
import { resolveWeddingGalleryPhase } from '../../data/portfolioCategories'

const preventNumberScroll = (event) => {
  event.currentTarget.blur()
}

const WEDDING_TYPE_OPTIONS = [
  { value: 'hindu', label: 'Hindu Wedding' },
  { value: 'christian', label: 'Christian Wedding' },
  { value: 'sinhala', label: 'Sinhala Wedding' },
]
const PUBERTY_TYPE_OPTIONS = [
  { value: 'before_the_blessing', label: 'Mehendi Moments' },
  { value: 'the_celebration', label: 'The Celebration' },
  { value: 'after_glow_portraits', label: 'After Glow Portraits' },
]
const SHOOT_PHASE_OPTIONS = [
  { value: 'pre_wedding', label: 'Bridal Portraits' },
  { value: 'wedding_day', label: 'Wedding Portraits' },
  { value: 'post_wedding', label: 'Post-Wedding Shoot' },
]

export default function AdminPortfolio() {
  const qc = useQueryClient()
  const [modal, setModal] = useState(null)
  const [galleryPreview, setGalleryPreview] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [removedGalleryImageIds, setRemovedGalleryImageIds] = useState([])
  const [galleryUploads, setGalleryUploads] = useState([])
  const [galleryUploadPhase, setGalleryUploadPhase] = useState('')
  const { data: photos = [], isLoading } = useQuery({ queryKey: ['admin-portfolio'], queryFn: adminGetPortfolio })
  const { data: categories = [] } = useQuery({ queryKey: ['admin-categories'], queryFn: adminGetCategories })
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm()
  const selectedFormCategoryId = String(watch('category') ?? '')

  const getApiErrorMessage = (error, fallback) => {
    const data = error?.response?.data
    if (!data) return fallback

    if (typeof data === 'string') return data

    const message = Object.entries(data)
      .map(([field, value]) => {
        const text = Array.isArray(value) ? value.join(', ') : String(value)
        return field === 'non_field_errors' ? text : `${field}: ${text}`
      })
      .join(' | ')

    return message || fallback
  }

  const weddingCategoryId = useMemo(
    () => String(categories.find((category) => category.slug === 'wedding')?.id ?? ''),
    [categories],
  )
  const pubertyCategoryId = useMemo(
    () => String(categories.find((category) => category.slug === 'puberty-ceremony')?.id ?? ''),
    [categories],
  )
  const isWeddingCategorySelected = !!selectedFormCategoryId && selectedFormCategoryId === weddingCategoryId
  const isPubertyCategorySelected = !!selectedFormCategoryId && selectedFormCategoryId === pubertyCategoryId
  const isTypeRequiredCategory = isWeddingCategorySelected || isPubertyCategorySelected
  const typeOptions = isWeddingCategorySelected ? WEDDING_TYPE_OPTIONS : isPubertyCategorySelected ? PUBERTY_TYPE_OPTIONS : []
  const galleryPhaseOptions = isWeddingCategorySelected
    ? SHOOT_PHASE_OPTIONS
    : isPubertyCategorySelected
      ? PUBERTY_TYPE_OPTIONS
      : []

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['admin-portfolio'] })
    qc.invalidateQueries({ queryKey: ['portfolio-all'] })
    qc.invalidateQueries({ queryKey: ['portfolio-preview'] })
    qc.invalidateQueries({ queryKey: ['portfolio-cat'] })
  }

  const resetGalleryUploads = () => {
    galleryUploads.forEach((upload) => {
      if (upload.preview?.startsWith('blob:')) {
        URL.revokeObjectURL(upload.preview)
      }
    })
    setGalleryUploads([])
    setGalleryUploadPhase('')
  }

  const uploadGalleryImages = async ({ parentId, title, category, description, wedding_type, startingOrder = 0, uploads = [] }) => {
    if (!uploads.length) return

    await Promise.all(
      uploads.map((upload, index) => adminCreatePortfolio(toFormData({
        parent: parentId,
        category,
        wedding_type,
        shoot_phase: upload.shootPhase,
        title: `${title} Gallery ${startingOrder + index + 1}`,
        image: upload.file,
        description,
        order: startingOrder + index + 1,
      }))),
    )
  }

  const createMut = useMutation({
    mutationFn: async (data) => {
      const created = await adminCreatePortfolio(toFormData(data))

      await uploadGalleryImages({
        parentId: created.id,
        title: data.title,
        category: data.category,
        description: data.description,
        wedding_type: data.wedding_type,
        uploads: galleryUploads,
      })

      return created
    },
    onSuccess: () => { toast.success('Photo added'); invalidate(); resetGalleryUploads(); setModal(null) },
    onError: (error) => toast.error(getApiErrorMessage(error, 'Failed to add photo')),
  })

  const updateMut = useMutation({
    mutationFn: async ({ id, data, existingGalleryCount }) => {
      const updated = await adminUpdatePortfolio(id, toFormData(data))

      await uploadGalleryImages({
        parentId: id,
        title: data.title,
        category: data.category,
        description: data.description,
        wedding_type: data.wedding_type,
        startingOrder: existingGalleryCount,
        uploads: galleryUploads,
      })

      return updated
    },
    onSuccess: () => { toast.success('Photo updated'); invalidate(); resetGalleryUploads(); setModal(null) },
    onError: (error) => toast.error(getApiErrorMessage(error, 'Failed to update photo')),
  })

  const deleteMut = useMutation({
    mutationFn: (id) => adminDeletePortfolio(id),
    onSuccess: () => { toast.success('Photo deleted'); invalidate() },
    onError: () => toast.error('Failed to delete photo'),
  })

  const openAdd = () => {
    reset({
      category: selectedCategory !== 'all' ? selectedCategory : '',
      subtitle: '',
      wedding_type: '',
      shoot_phase: '',
    })
    resetGalleryUploads()
    setRemovedGalleryImageIds([])
    setModal({ mode: 'add' })
  }

  const openEdit = (row) => {
    reset({
      ...row,
      category: row.category?.id,
      subtitle: row.subtitle || '',
      wedding_type: row.wedding_type || '',
      shoot_phase: row.shoot_phase || '',
    })
    resetGalleryUploads()
    setRemovedGalleryImageIds([])
    setModal({ mode: 'edit', data: row })
  }

  const onSubmit = (data) => {
    const payload = {
      ...data,
      removed_gallery_image_ids: removedGalleryImageIds,
    }

    return modal.mode === 'add'
      ? createMut.mutate(payload)
    : updateMut.mutate({
      id: modal.data.id,
      data: payload,
      existingGalleryCount: (modal.data.gallery_images ?? []).filter((image) => !removedGalleryImageIds.includes(image.id)).length,
    })
  }

  const removeSavedGalleryImage = (imageId) => {
    const nextIds = removedGalleryImageIds.includes(imageId)
      ? removedGalleryImageIds
      : [...removedGalleryImageIds, imageId]

    setRemovedGalleryImageIds(nextIds)
  }

  const addGalleryFiles = (files) => {
    if (isTypeRequiredCategory && !galleryUploadPhase) {
      toast.error('Select a shoot phase before adding gallery images')
      return
    }

    setGalleryUploads((current) => [
      ...current,
      ...files.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        shootPhase: isTypeRequiredCategory ? galleryUploadPhase : '',
      })),
    ])
  }

  const removeNewGalleryFile = (indexToRemove) => {
    setGalleryUploads((current) => {
      const upload = current[indexToRemove]
      if (upload?.preview?.startsWith('blob:')) {
        URL.revokeObjectURL(upload.preview)
      }
      return current.filter((_, index) => index !== indexToRemove)
    })
  }

  const columns = [
    {
      key: 'image',
      label: 'Image',
      render: (row) => (row.image ? <img src={row.image} alt="" className="h-10 w-16 rounded object-cover" /> : '-'),
    },
    {
      key: 'title',
      label: 'Title',
      render: (row) => (
        <span className="block max-w-[18rem] text-sm leading-5 text-text">
          <TitleWithHeartDivider
            title={row.title}
            textClassName="font-medium"
            heartClassName="h-[1.18em] w-[0.86em] -translate-y-[0.05em] text-[#7b6241]"
          />
        </span>
      ),
    },
    { key: 'category', label: 'Category', render: (row) => row.category?.name ?? '-' },
    {
      key: 'wedding_type',
      label: 'Type',
      render: (row) => {
        const categorySlug = row.category?.slug
        if (categorySlug === 'wedding') {
          return WEDDING_TYPE_OPTIONS.find((option) => option.value === row.wedding_type)?.label ?? '-'
        }
        if (categorySlug === 'puberty-ceremony') {
          return PUBERTY_TYPE_OPTIONS.find((option) => option.value === row.shoot_phase)?.label ?? '-'
        }
        return '-'
      },
    },
    { key: 'gallery_images', label: 'Gallery', render: (row) => `${row.gallery_images?.length ?? 0} photos` },
    { key: 'is_featured', label: 'Featured', render: (row) => (row.is_featured ? 'Yes' : '') },
    { key: 'order', label: 'Order' },
  ]

  const filteredPhotos = selectedCategory === 'all'
    ? photos
    : photos.filter((photo) => String(photo.category?.id ?? '') === selectedCategory)
  const visibleSavedGalleryImages = (modal?.data?.gallery_images ?? []).filter(
    (image) => !removedGalleryImageIds.includes(image.id),
  )

  useEffect(() => {
    if (!modal || isTypeRequiredCategory) return
    setValue('wedding_type', '', { shouldDirty: true })
    setValue('shoot_phase', '', { shouldDirty: true })
    setGalleryUploadPhase('')
  }, [isTypeRequiredCategory, modal, setValue])

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-3xl text-text">Portfolio</h1>
        <button onClick={openAdd} className="rounded-lg bg-accent px-4 py-2 text-sm font-body text-white hover:bg-accent/90">
          + Add Photo
        </button>
      </div>

      <div className="mb-6 flex flex-col gap-2 sm:max-w-xs">
        <label htmlFor="portfolio-category-filter" className="text-sm font-body text-text">
          Filter by Category
        </label>
        <select
          id="portfolio-category-filter"
          value={selectedCategory}
          onChange={(event) => setSelectedCategory(event.target.value)}
          className="w-full rounded-lg border border-sand bg-white px-3 py-2 text-sm focus:border-accent focus:outline-none"
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={String(category.id)}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? <p className="font-body text-muted">Loading...</p> : (
        <AdminTable
          columns={columns}
          data={filteredPhotos}
          onEdit={openEdit}
          onDelete={(row) => { if (confirm('Delete this photo?')) deleteMut.mutate(row.id) }}
          actionStyle="button"
          extraActions={(row) => (
            <button
              onClick={() => setGalleryPreview(row)}
              className="mr-2 inline-flex items-center justify-center rounded-full border border-[#c9ab74] bg-gradient-to-r from-[#f6ead3] via-[#edd3a4] to-[#d8ae62] px-3 py-1.5 text-xs font-medium text-[#3b2815] transition-colors hover:border-[#b8945b] hover:from-[#f9eed9] hover:via-[#f0d8ab] hover:to-[#c99847]"
            >
              View Gallery
            </button>
          )}
        />
      )}

      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal?.mode === 'add' ? 'Add Photo' : 'Edit Photo'}
        panelClassName="max-w-3xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="rounded-xl border border-sand bg-beige/60 px-4 py-3 text-sm text-muted">
            This image is the main portfolio card. Add extra gallery photos below so a click on the main photo can open the full set.
          </div>

          <div>
            <label className="mb-1 block text-sm font-body">Title *</label>
            <input
              className="w-full rounded-lg border border-sand px-3 py-2 text-sm focus:border-accent focus:outline-none"
              {...register('title', { required: 'Required' })}
            />
            {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-body">Subtitle</label>
            <input
              className="w-full rounded-lg border border-sand px-3 py-2 text-sm focus:border-accent focus:outline-none"
              placeholder="A short caption shown under the title"
              {...register('subtitle')}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-body">Category</label>
            <select
              className="w-full rounded-lg border border-sand px-3 py-2 text-sm focus:border-accent focus:outline-none"
              {...register('category', {
                validate: (value) => {
                  if (modal?.mode !== 'add') return true
                  return value ? true : 'Category is required'
                },
              })}
            >
              <option value="">- None -</option>
              {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
            {errors.category && <p className="mt-1 text-xs text-red-400">{errors.category.message}</p>}
          </div>

          {(isWeddingCategorySelected || isPubertyCategorySelected) && (
            <div>
              <label className="mb-1 block text-sm font-body">Type *</label>
              <select
                className="w-full rounded-lg border border-sand px-3 py-2 text-sm focus:border-accent focus:outline-none"
                {...register(isWeddingCategorySelected ? 'wedding_type' : 'shoot_phase', {
                  validate: (value) => {
                    if (!isWeddingCategorySelected && !isPubertyCategorySelected) return true
                    return value ? true : 'Select a type'
                  },
                })}
              >
                <option value="">Select type</option>
                {typeOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              {errors.wedding_type && <p className="mt-1 text-xs text-red-400">{errors.wedding_type.message}</p>}
              {errors.shoot_phase && <p className="mt-1 text-xs text-red-400">{errors.shoot_phase.message}</p>}
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-body">Description</label>
            <textarea
              rows={3}
              className="w-full resize-none rounded-lg border border-sand px-3 py-2 text-sm focus:border-accent focus:outline-none"
              {...register('description')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-body">Order</label>
              <input
                type="number"
                min="1"
                onWheel={preventNumberScroll}
                className="w-full rounded-lg border border-sand px-3 py-2 text-sm focus:border-accent focus:outline-none"
                {...register('order', {
                  valueAsNumber: true,
                  min: { value: 1, message: 'Order must be greater than 0' },
                })}
              />
              {errors.order && <p className="mt-1 text-xs text-red-400">{errors.order.message}</p>}
            </div>
            <div className="mt-6 flex items-center gap-2">
              <input type="checkbox" id="is_featured" {...register('is_featured')} />
              <label htmlFor="is_featured" className="text-sm font-body">Featured</label>
            </div>
          </div>

          <ImageUpload label="Main Image" name="image" register={register} currentUrl={modal?.data?.image} />
          <MultiImageUpload
            label="Gallery Images"
            currentImages={modal?.data?.gallery_images ?? []}
            removedImageIds={removedGalleryImageIds}
            onRemoveSaved={removeSavedGalleryImage}
            newUploads={galleryUploads}
            onAddFiles={addGalleryFiles}
            onRemoveNew={removeNewGalleryFile}
            batchOptions={galleryPhaseOptions}
            batchValue={galleryUploadPhase}
            onBatchValueChange={setGalleryUploadPhase}
            batchLabel="Shoot Phase"
            batchPlaceholder="Select shoot phase"
            getImageMetaLabel={(image) => {
              const phase = isWeddingCategorySelected
                ? resolveWeddingGalleryPhase(image, visibleSavedGalleryImages)
                : image.shoot_phase
              return galleryPhaseOptions.find((option) => option.value === phase)?.label || phase
            }}
          />

          <button type="submit" className="w-full rounded-lg bg-accent py-2.5 text-sm font-body text-white hover:bg-accent/90">
            {modal?.mode === 'add' ? 'Create' : 'Save Changes'}
          </button>
        </form>
      </Modal>

      <Modal
        open={!!galleryPreview}
        onClose={() => setGalleryPreview(null)}
        title={galleryPreview?.title || 'Gallery'}
        panelClassName="max-w-5xl"
      >
        <div className="space-y-4">
          {galleryPreview?.image && (
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-muted">Main Photo</p>
              <div className="overflow-hidden rounded-xl border border-sand bg-beige/40 p-3">
                <img src={galleryPreview.image} alt={galleryPreview.title} className="max-h-[60vh] w-full rounded-lg bg-white object-contain" />
              </div>
            </div>
          )}

          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-muted">Additional Photos</p>
            {galleryPreview?.gallery_images?.length ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {galleryPreview.gallery_images.map((image) => {
                  const phase = galleryPreview.category?.slug === 'wedding'
                    ? resolveWeddingGalleryPhase(image, galleryPreview.gallery_images)
                    : image.shoot_phase

                  return (
                    <div key={image.id} className="overflow-hidden rounded-xl border border-sand bg-beige/40 p-2">
                      <img src={image.image} alt={image.title} className="h-40 w-full rounded-lg bg-white object-contain" />
                      {phase && (
                        <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-[#8c6b43]">
                          {SHOOT_PHASE_OPTIONS.find((option) => option.value === phase)?.label || phase}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-sm text-muted">No extra gallery photos added yet.</p>
            )}
          </div>
        </div>
      </Modal>
    </div>
  )
}
