import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  adminGetSlides, adminGetPortfolio, adminGetMessages,
  adminGetTestimonials, adminGetTeam, adminGetCategories, adminGetPackages,
  adminMarkRead, adminApproveTestimonial,
} from '../../api/endpoints'

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon, accent, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-6 border border-sand shadow-sm flex items-start justify-between gap-4 ${onClick ? 'cursor-pointer hover:border-accent/50 hover:shadow-md transition-all' : ''}`}
    >
      <div>
        <p className="font-body text-muted text-xs uppercase tracking-widest mb-1">{label}</p>
        <p className={`font-heading text-4xl ${accent ? 'text-accent' : 'text-text'}`}>{value ?? '—'}</p>
        {sub && <p className="font-body text-xs text-muted mt-1">{sub}</p>}
      </div>
      <span className="text-3xl opacity-20 select-none">{icon}</span>
    </div>
  )
}

// ── Section Header ────────────────────────────────────────────────────────────
function SectionHeader({ title, action, onAction }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="font-heading text-lg text-text">{title}</h2>
      {action && (
        <button onClick={onAction} className="font-body text-xs text-accent hover:underline">
          {action} →
        </button>
      )}
    </div>
  )
}

// ── Quick Action Button ───────────────────────────────────────────────────────
function QuickAction({ icon, label, to, navigate }) {
  return (
    <button
      onClick={() => navigate(to)}
      className="flex flex-col items-center gap-2 bg-white border border-sand rounded-xl p-4 hover:border-accent/50 hover:shadow-sm transition-all group"
    >
      <span className="text-2xl group-hover:scale-110 transition-transform">{icon}</span>
      <span className="font-body text-xs text-muted group-hover:text-accent transition-colors text-center">{label}</span>
    </button>
  )
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const navigate = useNavigate()
  const qc = useQueryClient()

  const { data: slides = [] }       = useQuery({ queryKey: ['admin-slides'],       queryFn: adminGetSlides })
  const { data: portfolio = [] }    = useQuery({ queryKey: ['admin-portfolio'],    queryFn: adminGetPortfolio })
  const { data: packages = [] }     = useQuery({ queryKey: ['admin-packages'],     queryFn: adminGetPackages })
  const { data: messages = [] }     = useQuery({ queryKey: ['admin-messages'],     queryFn: adminGetMessages })
  const { data: testimonials = [] } = useQuery({ queryKey: ['admin-testimonials'], queryFn: adminGetTestimonials })
  const { data: team = [] }         = useQuery({ queryKey: ['admin-team'],         queryFn: adminGetTeam })
  const { data: categories = [] }   = useQuery({ queryKey: ['admin-categories'],   queryFn: adminGetCategories })

  const unread  = messages.filter(m => !m.is_read)
  const pending = testimonials.filter(t => !t.is_approved)
  const recent  = [...messages].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5)

  const markReadMut = useMutation({
    mutationFn: adminMarkRead,
    onSuccess: () => { toast.success('Marked as read'); qc.invalidateQueries({ queryKey: ['admin-messages'] }) },
  })
  const approveMut = useMutation({
    mutationFn: adminApproveTestimonial,
    onSuccess: () => { toast.success('Testimonial approved'); qc.invalidateQueries({ queryKey: ['admin-testimonials'] }) },
  })

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl text-text">Dashboard</h1>
          <p className="font-body text-sm text-muted mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 bg-accent text-white font-body text-sm px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors"
        >
          <span>🌐</span> View Site
        </a>
      </div>

      {/* Alert banners */}
      {(unread.length > 0 || pending.length > 0) && (
        <div className="space-y-2">
          {unread.length > 0 && (
            <div
              onClick={() => navigate('/admin/messages')}
              className="flex items-center gap-3 bg-accent/10 border border-accent/30 rounded-xl px-5 py-3 cursor-pointer hover:bg-accent/15 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0 animate-pulse" />
              <p className="font-body text-sm text-text">
                You have <strong>{unread.length}</strong> unread message{unread.length > 1 ? 's' : ''} — click to view
              </p>
            </div>
          )}
          {pending.length > 0 && (
            <div
              onClick={() => navigate('/admin/testimonials')}
              className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-xl px-5 py-3 cursor-pointer hover:bg-yellow-100 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0" />
              <p className="font-body text-sm text-text">
                <strong>{pending.length}</strong> testimonial{pending.length > 1 ? 's' : ''} waiting for approval
              </p>
            </div>
          )}
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        <StatCard label="Hero Slides"  value={slides.length}       icon="🖼️"  onClick={() => navigate('/admin/slides')} />
        <StatCard label="Photos"       value={portfolio.length}    icon="📷"  onClick={() => navigate('/admin/portfolio')} />
        <StatCard label="Categories"   value={categories.length}   icon="🗂️"  onClick={() => navigate('/admin/portfolio/categories')} />
        <StatCard label="Proprietors" value={team.length}         icon="👥"  onClick={() => navigate('/admin/team')} />
        <StatCard label="Unread"       value={unread.length}       icon="✉️"  accent onClick={() => navigate('/admin/messages')}
          sub={unread.length ? 'needs attention' : 'all caught up'} />
        <StatCard label="Pending"      value={pending.length}      icon="⭐"  accent onClick={() => navigate('/admin/testimonials')}
          sub={pending.length ? 'awaiting approval' : 'all approved'} />
      </div>

      {/* Quick actions */}
      <div>
        <SectionHeader title="Quick Actions" />
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {[
            { icon: '➕', label: 'Add Slide',    to: '/admin/slides' },
            { icon: '📸', label: 'Add Photo',    to: '/admin/portfolio' },
            { icon: '🗂️', label: 'Add Category', to: '/admin/portfolio/categories' },
            { icon: '✏️', label: 'Edit About',   to: '/admin/about' },
            { icon: '👤', label: 'Add Proprietor',   to: '/admin/team' },
            { icon: '✉️', label: 'Messages',     to: '/admin/messages' },
            { icon: '⭐', label: 'Testimonials', to: '/admin/testimonials' },
            { icon: '⚙️', label: 'Settings',     to: '/admin/settings' },
          ].map(a => <QuickAction key={a.to} {...a} navigate={navigate} />)}
        </div>
      </div>

      {/* Bottom two-column layout */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Recent messages */}
        <div className="bg-white rounded-2xl border border-sand p-6">
          <SectionHeader title="Recent Messages" action="View all" onAction={() => navigate('/admin/messages')} />
          {recent.length === 0 ? (
            <p className="font-body text-sm text-muted text-center py-8">No messages yet</p>
          ) : (
            <div className="space-y-3">
              {recent.map(msg => (
                <div key={msg.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-beige transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${msg.is_read ? 'bg-sand' : 'bg-accent'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-body text-sm font-bold text-text truncate">{msg.name}</p>
                      <p className="font-body text-xs text-muted flex-shrink-0">
                        {new Date(msg.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="font-body text-xs text-muted truncate">{msg.subject}</p>
                    <p className="font-body text-xs text-text/60 truncate mt-0.5">{msg.message}</p>
                  </div>
                  {!msg.is_read && (
                    <button
                      onClick={() => markReadMut.mutate(msg.id)}
                      className="text-xs font-body text-accent hover:underline flex-shrink-0"
                    >
                      Mark read
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending testimonials */}
        <div className="bg-white rounded-2xl border border-sand p-6">
          <SectionHeader title="Pending Testimonials" action="View all" onAction={() => navigate('/admin/testimonials')} />
          {pending.length === 0 ? (
            <p className="font-body text-sm text-muted text-center py-8">No pending testimonials</p>
          ) : (
            <div className="space-y-3">
              {pending.slice(0, 5).map(t => (
                <div key={t.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-beige transition-colors">
                  <div className="w-8 h-8 rounded-full bg-sand flex items-center justify-center font-heading text-text text-sm flex-shrink-0">
                    {t.client_name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-body text-sm font-bold text-text">{t.client_name}</p>
                      <p className="text-accent text-xs">{'★'.repeat(t.rating)}</p>
                    </div>
                    <p className="font-body text-xs text-text/60 truncate mt-0.5">"{t.quote}"</p>
                  </div>
                  <button
                    onClick={() => approveMut.mutate(t.id)}
                    className="text-xs font-body text-green-600 hover:underline flex-shrink-0"
                  >
                    Approve
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Portfolio overview */}
      <div className="bg-white rounded-2xl border border-sand p-6">
        <SectionHeader title="Portfolio Overview" action="Manage" onAction={() => navigate('/admin/portfolio')} />
        {categories.length === 0 ? (
          <p className="font-body text-sm text-muted text-center py-8">No categories yet</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map(cat => {
              const count = portfolio.filter(p => p.category?.id === cat.id || p.category?.slug === cat.slug).length
              const pct = portfolio.length ? Math.round((count / portfolio.length) * 100) : 0
              return (
                <div
                  key={cat.id}
                  onClick={() => navigate('/admin/portfolio')}
                  className="cursor-pointer group text-center p-4 rounded-xl border border-sand hover:border-accent/40 transition-colors"
                >
                  <p className="font-heading text-2xl text-text group-hover:text-accent transition-colors">{count}</p>
                  <p className="font-body text-xs text-muted mt-1 truncate">{cat.name}</p>
                  <div className="mt-2 h-1 bg-sand rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

    </div>
  )
}
