import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import {
  adminGetTestimonials, adminCreateTestimonial, adminUpdateTestimonial,
  adminDeleteTestimonial, adminApproveTestimonial, adminRejectTestimonial,
} from '../../api/endpoints'
import AdminTable from '../../components/admin/AdminTable'
import Modal from '../../components/ui/Modal'
import ImageUpload from '../../components/ui/ImageUpload'
import { toFormData } from '../../utils'

export default function AdminTestimonials() {
  const qc = useQueryClient()
  const [modal, setModal] = useState(null)
  const { data: items = [], isLoading } = useQuery({ queryKey: ['admin-testimonials'], queryFn: adminGetTestimonials })
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin-testimonials'] })

  const createMut  = useMutation({ mutationFn: (d) => adminCreateTestimonial(toFormData(d)),
    onSuccess: () => { toast.success('Testimonial created'); invalidate(); setModal(null) },
    onError: () => toast.error('Failed') })
  const updateMut  = useMutation({ mutationFn: ({ id, data }) => adminUpdateTestimonial(id, toFormData(data)),
    onSuccess: () => { toast.success('Testimonial updated'); invalidate(); setModal(null) },
    onError: () => toast.error('Failed') })
  const deleteMut  = useMutation({ mutationFn: adminDeleteTestimonial,
    onSuccess: () => { toast.success('Deleted'); invalidate() }, onError: () => toast.error('Failed') })
  const approveMut = useMutation({ mutationFn: adminApproveTestimonial,
    onSuccess: () => { toast.success('Approved'); invalidate() }, onError: () => toast.error('Failed') })
  const rejectMut  = useMutation({ mutationFn: adminRejectTestimonial,
    onSuccess: () => { toast.success('Rejected'); invalidate() }, onError: () => toast.error('Failed') })

  const openAdd  = () => { reset({}); setModal({ mode: 'add' }) }
  const openEdit = (row) => { reset(row); setModal({ mode: 'edit', data: row }) }
  const onSubmit = (d) => modal.mode === 'add'
    ? createMut.mutate(d)
    : updateMut.mutate({ id: modal.data.id, data: d })

  const columns = [
    { key: 'client_name', label: 'Client' },
    { key: 'rating', label: 'Rating', render: (r) => '★'.repeat(r.rating) },
    { key: 'quote', label: 'Quote', render: (r) => r.quote.slice(0, 60) + '…' },
    { key: 'is_approved', label: 'Status', render: (r) => (
      <span className={`text-xs font-body px-2 py-0.5 rounded-full ${r.is_approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
        {r.is_approved ? 'Approved' : 'Pending'}
      </span>
    )},
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-3xl text-text">Testimonials</h1>
        <button onClick={openAdd} className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-body hover:bg-accent/90">
          + Add Testimonial
        </button>
      </div>
      {isLoading ? <p className="text-muted font-body">Loading…</p> : (
        <AdminTable
          columns={columns}
          data={items}
          onEdit={openEdit}
          onDelete={(r) => { if (confirm('Delete?')) deleteMut.mutate(r.id) }}
          extraActions={(r) => r.is_approved
            ? <button onClick={() => rejectMut.mutate(r.id)} className="text-yellow-500 hover:underline mr-4 text-xs">Reject</button>
            : <button onClick={() => approveMut.mutate(r.id)} className="text-green-600 hover:underline mr-4 text-xs">Approve</button>
          }
        />
      )}
      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.mode === 'add' ? 'Add Testimonial' : 'Edit Testimonial'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-body mb-1">Client Name *</label>
            <input className="w-full border border-sand rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
              {...register('client_name', { required: 'Required' })} />
            {errors.client_name && <p className="text-red-400 text-xs mt-1">{errors.client_name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-body mb-1">Quote *</label>
            <textarea rows={3} className="w-full border border-sand rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent resize-none"
              {...register('quote', { required: 'Required' })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-body mb-1">Rating (1–5) *</label>
              <input type="number" min={1} max={5} className="w-full border border-sand rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
                {...register('rating', { required: 'Required', min: 1, max: 5 })} />
            </div>
            <div className="flex items-center gap-2 mt-6">
              <input type="checkbox" id="t_approved" {...register('is_approved')} />
              <label htmlFor="t_approved" className="text-sm font-body">Approved</label>
            </div>
          </div>
          <ImageUpload label="Client Photo (optional)" name="client_photo" register={register} currentUrl={modal?.data?.client_photo} />
          <button type="submit" className="w-full bg-accent text-white py-2.5 rounded-lg text-sm font-body hover:bg-accent/90">
            {modal?.mode === 'add' ? 'Create' : 'Save Changes'}
          </button>
        </form>
      </Modal>
    </div>
  )
}
