import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { adminGetSlides, adminCreateSlide, adminUpdateSlide, adminDeleteSlide } from '../../api/endpoints'
import AdminTable from '../../components/admin/AdminTable'
import Modal from '../../components/ui/Modal'
import ImageUpload from '../../components/ui/ImageUpload'
import { toFormData } from '../../utils'

const preventNumberScroll = (event) => {
  event.currentTarget.blur()
}

export default function AdminSlides() {
  const qc = useQueryClient()
  const [modal, setModal] = useState(null)
  const { data: slides = [], isLoading } = useQuery({ queryKey: ['admin-slides'], queryFn: adminGetSlides })
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['admin-slides'] })
    qc.invalidateQueries({ queryKey: ['slides'] })
  }

  const createMut = useMutation({
    mutationFn: (d) => adminCreateSlide(toFormData(d)),
    onSuccess: () => { toast.success('Slide created'); invalidate(); setModal(null) },
    onError: () => toast.error('Failed to create slide'),
  })
  const updateMut = useMutation({
    mutationFn: ({ id, data }) => adminUpdateSlide(id, toFormData(data)),
    onSuccess: () => { toast.success('Slide updated'); invalidate(); setModal(null) },
    onError: () => toast.error('Failed to update slide'),
  })
  const deleteMut = useMutation({
    mutationFn: (id) => adminDeleteSlide(id),
    onSuccess: () => { toast.success('Slide deleted'); invalidate() },
    onError: () => toast.error('Failed to delete slide'),
  })

  const openAdd = () => { reset({ is_active: true }); setModal({ mode: 'add' }) }
  const openEdit = (row) => { reset(row); setModal({ mode: 'edit', data: row }) }
  const onSubmit = (d) => modal.mode === 'add'
    ? createMut.mutate(d)
    : updateMut.mutate({ id: modal.data.id, data: d })

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'order', label: 'Order' },
    { key: 'is_active', label: 'Active', render: (r) => (r.is_active ? 'Yes' : 'No') },
    {
      key: 'image',
      label: 'Image',
      render: (r) => (r.image ? <img src={r.image} alt="" className="h-10 w-16 object-cover rounded" /> : '-'),
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-3xl text-text">Hero Slides</h1>
        <button onClick={openAdd} className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-body hover:bg-accent/90">
          + Add Slide
        </button>
      </div>
      {isLoading ? <p className="text-muted font-body">Loading...</p> : (
        <AdminTable
          columns={columns}
          data={slides}
          onEdit={openEdit}
          onDelete={(r) => { if (confirm('Delete this slide?')) deleteMut.mutate(r.id) }}
        />
      )}
      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.mode === 'add' ? 'Add Slide' : 'Edit Slide'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-body mb-1">Title *</label>
            <input className="w-full border border-sand rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
              {...register('title', { required: 'Required' })} />
            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-body mb-1">Subtitle</label>
            <input className="w-full border border-sand rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
              {...register('subtitle')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-body mb-1">Order</label>
              <input
                type="number"
                min="1"
                onWheel={preventNumberScroll}
                className="w-full border border-sand rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
                {...register('order', {
                  valueAsNumber: true,
                  min: { value: 1, message: 'Order must be greater than 0' },
                })}
              />
              {errors.order && <p className="text-red-400 text-xs mt-1">{errors.order.message}</p>}
            </div>
            <div className="flex items-center gap-2 mt-6">
              <input type="checkbox" id="is_active" {...register('is_active')} />
              <label htmlFor="is_active" className="text-sm font-body">Active</label>
            </div>
          </div>
          <ImageUpload label="Image" name="image" register={register} currentUrl={modal?.data?.image} />
          <button type="submit" className="w-full bg-accent text-white py-2.5 rounded-lg text-sm font-body hover:bg-accent/90">
            {modal?.mode === 'add' ? 'Create' : 'Save Changes'}
          </button>
        </form>
      </Modal>
    </div>
  )
}
