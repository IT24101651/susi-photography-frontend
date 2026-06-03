import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { adminGetAbout, adminUpdateAbout } from '../../api/endpoints'
import ImageUpload from '../../components/ui/ImageUpload'
import { toFormData } from '../../utils'

export default function AdminAbout() {
  const qc = useQueryClient()
  const { data: about, isLoading } = useQuery({ queryKey: ['admin-about'], queryFn: adminGetAbout })
  const { register, handleSubmit, reset } = useForm()

  useEffect(() => { if (about) reset(about) }, [about, reset])

  const updateMut = useMutation({
    mutationFn: (d) => adminUpdateAbout(toFormData(d)),
    onSuccess: () => { toast.success('About section updated'); qc.invalidateQueries({ queryKey: ['admin-about'] }) },
    onError: () => toast.error('Failed to update'),
  })

  if (isLoading) return <p className="text-muted font-body">Loading…</p>

  return (
    <div className="max-w-2xl">
      <h1 className="font-heading text-3xl text-text mb-8">About Section</h1>
      <form onSubmit={handleSubmit((d) => updateMut.mutate(d))} className="space-y-5 bg-white rounded-xl p-6 border border-sand">
        <div>
          <label className="block text-sm font-body mb-1">Heading *</label>
          <input className="w-full border border-sand rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
            {...register('heading', { required: true })} />
        </div>
        <div>
          <label className="block text-sm font-body mb-1">Subheading</label>
          <input className="w-full border border-sand rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
            {...register('subheading')} />
        </div>
        <div>
          <label className="block text-sm font-body mb-1">Body Text *</label>
          <textarea rows={6} className="w-full border border-sand rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent resize-none"
            {...register('body_text', { required: true })} />
        </div>
        <ImageUpload label="Image" name="image" register={register} currentUrl={about?.image} />
        <button type="submit" disabled={updateMut.isPending}
          className="bg-accent text-white px-6 py-2.5 rounded-lg text-sm font-body hover:bg-accent/90 disabled:opacity-60">
          {updateMut.isPending ? 'Saving…' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}
