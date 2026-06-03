import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { adminGetTeam, adminCreateTeam, adminUpdateTeam, adminDeleteTeam } from '../../api/endpoints'
import AdminTable from '../../components/admin/AdminTable'
import Modal from '../../components/ui/Modal'
import ImageUpload from '../../components/ui/ImageUpload'
import { toFormData } from '../../utils'

const preventNumberScroll = (event) => {
  event.currentTarget.blur()
}

export default function AdminTeam() {
  const qc = useQueryClient()
  const [modal, setModal] = useState(null)
  const { data: members = [], isLoading } = useQuery({ queryKey: ['admin-team'], queryFn: adminGetTeam })
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['admin-team'] })
    qc.invalidateQueries({ queryKey: ['team'] })
  }

  const createMut = useMutation({
    mutationFn: (d) => adminCreateTeam(toFormData(d)),
    onSuccess: () => { toast.success('Member added'); invalidate(); setModal(null) },
    onError: () => toast.error('Failed to add member'),
  })
  const updateMut = useMutation({
    mutationFn: ({ id, data }) => adminUpdateTeam(id, toFormData(data)),
    onSuccess: () => { toast.success('Member updated'); invalidate(); setModal(null) },
    onError: () => toast.error('Failed to update member'),
  })
  const deleteMut = useMutation({
    mutationFn: adminDeleteTeam,
    onSuccess: () => { toast.success('Member deleted'); invalidate() },
    onError: () => toast.error('Failed to delete member'),
  })

  const openAdd = () => { reset({ role: 'Proprietor', is_active: true }); setModal({ mode: 'add' }) }
  const openEdit = (row) => { reset({ ...row, role: row.role || 'Proprietor' }); setModal({ mode: 'edit', data: row }) }
  const onSubmit = (d) => {
    const payload = { ...d, role: d.role || 'Proprietor' }
    return modal.mode === 'add'
      ? createMut.mutate(payload)
      : updateMut.mutate({ id: modal.data.id, data: payload })
  }

  const columns = [
    {
      key: 'photo',
      label: 'Photo',
      render: (r) => (r.photo ? <img src={r.photo} alt="" className="h-10 w-10 rounded-full object-cover" /> : '-'),
    },
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' },
    { key: 'order', label: 'Order' },
    { key: 'is_active', label: 'Active', render: (r) => (r.is_active ? 'Yes' : 'No') },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-3xl text-text">Proprietors</h1>
        <button onClick={openAdd} className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-body hover:bg-accent/90">
          + Add Proprietor
        </button>
      </div>
      {isLoading ? <p className="text-muted font-body">Loading...</p> : (
        <AdminTable columns={columns} data={members}
          onEdit={openEdit}
          onDelete={(r) => { if (confirm('Delete this proprietor?')) deleteMut.mutate(r.id) }}
        />
      )}
      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.mode === 'add' ? 'Add Proprietor' : 'Edit Proprietor'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-body mb-1">Name *</label>
              <input className="w-full border border-sand rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
                {...register('name', { required: 'Required' })} />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-body mb-1">Role *</label>
              <input
                className="w-full border border-sand rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
                {...register('role', { required: 'Required' })}
              />
              {errors.role && <p className="text-red-400 text-xs mt-1">{errors.role.message}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-body mb-1">Description</label>
            <textarea
              rows={4}
              className="w-full resize-none border border-sand rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
              {...register('bio')}
            />
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
              <input type="checkbox" id="member_active" {...register('is_active')} />
              <label htmlFor="member_active" className="text-sm font-body">Active</label>
            </div>
          </div>
          <ImageUpload label="Photo" name="photo" register={register} currentUrl={modal?.data?.photo} />
          <button type="submit" className="w-full bg-accent text-white py-2.5 rounded-lg text-sm font-body hover:bg-accent/90">
            {modal?.mode === 'add' ? 'Create' : 'Save Changes'}
          </button>
        </form>
      </Modal>
    </div>
  )
}
