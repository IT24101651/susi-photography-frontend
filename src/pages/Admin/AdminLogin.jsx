import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function AdminLogin() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    try {
      await signIn(data)
      navigate('/admin/dashboard')
    } catch {
      toast.error('Invalid username or password')
    }
  }

  return (
    <div className="min-h-screen bg-beige flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-sm">
        <h1 className="font-heading text-3xl text-text text-center mb-1">Susi Photography</h1>
        <p className="font-body text-muted text-center text-sm mb-8">Admin Panel</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              className="w-full border border-sand rounded-lg px-4 py-2.5 text-sm font-body focus:outline-none focus:border-accent"
              placeholder="Username"
              {...register('username', { required: true })}
            />
            {errors.username && <p className="text-red-400 text-xs mt-1">Required</p>}
          </div>
          <div>
            <input
              type="password"
              className="w-full border border-sand rounded-lg px-4 py-2.5 text-sm font-body focus:outline-none focus:border-accent"
              placeholder="Password"
              {...register('password', { required: true })}
            />
            {errors.password && <p className="text-red-400 text-xs mt-1">Required</p>}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-accent text-white py-2.5 rounded-lg font-body text-sm hover:bg-accent/90 transition-colors disabled:opacity-60"
          >
            {isSubmitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
