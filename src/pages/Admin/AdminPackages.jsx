import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import {
  adminGetPackages, adminCreatePackage, adminUpdatePackage, adminDeletePackage, adminGetCategories,
} from '../../api/endpoints'
import AdminTable from '../../components/admin/AdminTable'
import Modal from '../../components/ui/Modal'
import ImageUpload from '../../components/ui/ImageUpload'
import { toFormData } from '../../utils'

const preventNumberScroll = (event) => {
  event.currentTarget.blur()
}

export default function AdminPackages() {
  const qc = useQueryClient()
  const [modal, setModal] = useState(null)
  const { data: packages = [], isLoading } = useQuery({ queryKey: ['admin-packages'], queryFn: adminGetPackages })
  const { data: categories = [] } = useQuery({ queryKey: ['admin-categories'], queryFn: adminGetCategories })
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const syncPublicPackageQueries = () => {
    qc.invalidateQueries({ queryKey: ['packages'] })
    qc.invalidateQueries({ queryKey: ['packages-cat'] })
  }

  const createMut = useMutation({
    mutationFn: (data) => adminCreatePackage(toFormData(data)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-packages'] })
      syncPublicPackageQueries()
      toast.success('Package card created')
      setModal(null)
    },
    onError: () => toast.error('Failed to create package card'),
  })
  const updateMut = useMutation({
    mutationFn: ({ id, data }) => adminUpdatePackage(id, toFormData(data)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-packages'] })
      syncPublicPackageQueries()
      toast.success('Package card updated')
      setModal(null)
    },
    onError: () => toast.error('Failed to update package card'),
  })
  const deleteMut = useMutation({
    mutationFn: adminDeletePackage,
    onSuccess: (_, deletedId) => {
      qc.setQueryData(['admin-packages'], (current = []) =>
        current.filter((item) => item.id !== deletedId))
      syncPublicPackageQueries()
      toast.success('Package card deleted')
    },
    onError: () => toast.error('Failed to delete package card'),
  })

  const openAdd = () => {
    reset({ is_active: true, order: packages.length + 1 })
    setModal({ mode: 'add' })
  }
  const openEdit = (row) => {
    reset({ ...row, category: row.category?.id })
    setModal({ mode: 'edit', data: row })
  }
  const buildPayload = (data) => {
    const selectedCategory = categories.find((category) => String(category.id) === String(data.category))
    const order = data.order || modal?.data?.order || packages.length + 1
    return {
      ...data,
      title: `${selectedCategory?.name || 'Package'} ${order}`,
      price_prefix: modal?.data?.price_prefix || '',
      price_value: modal?.data?.price_value || 'Package',
      detail_1: modal?.data?.detail_1 || '',
      detail_2: modal?.data?.detail_2 || '',
      detail_3: modal?.data?.detail_3 || '',
      theme: modal?.data?.theme || 'bronze',
      is_active: modal?.data?.is_active ?? true,
    }
  }

  const onSubmit = (data) => modal?.mode === 'add'
    ? createMut.mutate(buildPayload(data))
    : updateMut.mutate({ id: modal.data.id, data: buildPayload(data) })

  const columns = [
    {
      key: 'image',
      label: 'Card Image',
      render: (row) => row.image ? <img src={row.image} alt="" className="h-12 w-12 rounded-xl object-cover" /> : '-',
    },
    { key: 'category', label: 'Category', render: (row) => row.category?.name ?? '-' },
    { key: 'order', label: 'Order' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-3xl text-text">Packages</h1>
        <button onClick={openAdd} className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-body hover:bg-accent/90">
          + Add Package Card
        </button>
      </div>

      {isLoading ? (
        <p className="text-muted font-body">Loading...</p>
      ) : (
        <AdminTable
          columns={columns}
          data={packages}
          onEdit={openEdit}
          onDelete={(row) => { if (confirm('Delete this package card?')) deleteMut.mutate(row.id) }}
        />
      )}

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.mode === 'add' ? 'Add Package Card' : 'Edit Package Card'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-body mb-1">Category *</label>
            <select
              className="w-full border border-sand rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
              {...register('category', { required: 'Required' })}
            >
              <option value="">- Select -</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category.message}</p>}
          </div>
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

          <ImageUpload label="Card Image" name="image" register={register} currentUrl={modal?.data?.image} />

          <button
            type="submit"
            disabled={createMut.isPending || updateMut.isPending}
            className="w-full bg-accent text-white py-2.5 rounded-lg text-sm font-body hover:bg-accent/90 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {createMut.isPending || updateMut.isPending
              ? 'Saving...'
              : modal?.mode === 'add' ? 'Create' : 'Save Changes'}
          </button>
        </form>
      </Modal>
    </div>
  )
}
