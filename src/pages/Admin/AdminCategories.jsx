import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { adminGetCategories, adminCreateCategory, adminUpdateCategory, adminDeleteCategory } from '../../api/endpoints'
import AdminTable from '../../components/admin/AdminTable'
import Modal from '../../components/ui/Modal'

const preventNumberScroll = (event) => {
  event.currentTarget.blur()
}

export default function AdminCategories() {
  const qc = useQueryClient()
  const [modal, setModal] = useState(null)
  const { data: categories = [], isLoading } = useQuery({ queryKey: ['admin-categories'], queryFn: adminGetCategories })
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['admin-categories'] })
    qc.invalidateQueries({ queryKey: ['categories'] })
    qc.invalidateQueries({ queryKey: ['portfolio-all'] })
    qc.invalidateQueries({ queryKey: ['portfolio-preview'] })
    qc.invalidateQueries({ queryKey: ['portfolio-cat'] })
    qc.invalidateQueries({ queryKey: ['packages'] })
    qc.invalidateQueries({ queryKey: ['packages-cat'] })
  }

  const createMut = useMutation({
    mutationFn: adminCreateCategory,
    onSuccess: () => { toast.success('Category created'); invalidate(); setModal(null) },
    onError: () => toast.error('Failed to create category'),
  })
  const updateMut = useMutation({
    mutationFn: ({ slug, data }) => adminUpdateCategory(slug, data),
    onSuccess: () => { toast.success('Category updated'); invalidate(); setModal(null) },
    onError: () => toast.error('Failed to update category'),
  })
  const deleteMut = useMutation({
    mutationFn: adminDeleteCategory,
    onSuccess: () => { toast.success('Category deleted'); invalidate() },
    onError: () => toast.error('Failed to delete category'),
  })

  const openAdd = () => { reset({ is_active: true, order: categories.length + 1 }); setModal({ mode: 'add' }) }
  const openEdit = (row) => { reset(row); setModal({ mode: 'edit', data: row }) }
  const onSubmit = (d) => modal.mode === 'add'
    ? createMut.mutate(d)
    : updateMut.mutate({ slug: modal.data.slug, data: d })

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'slug', label: 'Slug' },
    { key: 'order', label: 'Order' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-3xl text-text">Portfolio Categories</h1>
        <button onClick={openAdd} className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-body hover:bg-accent/90">
          + Add Category
        </button>
      </div>
      {isLoading ? <p className="text-muted font-body">Loading...</p> : (
        <AdminTable columns={columns} data={categories}
          onEdit={openEdit}
          onDelete={(r) => { if (confirm('Delete this category?')) deleteMut.mutate(r.slug) }}
        />
      )}
      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.mode === 'add' ? 'Add Category' : 'Edit Category'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-body mb-1">Name *</label>
            <input className="w-full border border-sand rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
              {...register('name', { required: 'Required' })} />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-body mb-1">Slug <span className="text-muted text-xs">(auto-generated if blank)</span></label>
            <input className="w-full border border-sand rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
              {...register('slug')} />
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
              <input type="checkbox" id="cat_active" {...register('is_active')} />
              <label htmlFor="cat_active" className="text-sm font-body">Active</label>
            </div>
          </div>
          <button type="submit" className="w-full bg-accent text-white py-2.5 rounded-lg text-sm font-body hover:bg-accent/90">
            {modal?.mode === 'add' ? 'Create' : 'Save Changes'}
          </button>
        </form>
      </Modal>
    </div>
  )
}
