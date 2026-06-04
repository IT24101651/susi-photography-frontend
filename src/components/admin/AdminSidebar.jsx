import { NavLink, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../context/AuthContext'
import { adminGetMessages, adminGetTestimonials } from '../../api/endpoints'

const GROUPS = [
  {
    label: 'Content',
    links: [
      { to: '/admin/slides',               label: 'Hero Slides' },
      { to: '/admin/portfolio',            label: 'Portfolio' },
      { to: '/admin/portfolio/categories', label: 'Categories' },
      { to: '/admin/packages',             label: 'Packages' },
      { to: '/admin/about',                label: 'About' },
      { to: '/admin/team',                 label: 'Proprietors' },
    ],
  },
  {
    label: 'Engagement',
    links: [
      { to: '/admin/testimonials', label: 'Testimonials', badge: 'pending' },
      { to: '/admin/messages',     label: 'Messages',     badge: 'unread' },
    ],
  },
  {
    label: 'System',
    links: [
      { to: '/admin/settings', label: 'Settings' },
    ],
  },
]

export default function AdminSidebar() {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  const { data: messages = [] }     = useQuery({ queryKey: ['admin-messages'],     queryFn: adminGetMessages })
  const { data: testimonials = [] } = useQuery({ queryKey: ['admin-testimonials'], queryFn: adminGetTestimonials })

  const badges = {
    unread:  messages.filter(m => !m.is_read).length,
    pending: testimonials.filter(t => !t.is_approved).length,
  }

  const handleLogout = () => { signOut(); navigate('/admin/login') }

  return (
    <aside className="w-60 min-h-screen bg-[#1a1a2e] text-white flex flex-col flex-shrink-0">

      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white font-heading text-sm">S</div>
          <div>
            <p className="font-wordmark text-sm text-white tracking-[0.24em]">Susi Photography</p>
            <p className="font-body text-xs text-white/40">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Dashboard link */}
      <div className="px-3 pt-4">
        <NavLink
          to="/admin/dashboard"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body transition-all ${
              isActive
                ? 'bg-accent text-white'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`
          }
        >
          <span>Dashboard</span>
        </NavLink>
      </div>

      {/* Grouped nav */}
      <nav className="flex-1 px-3 py-2 space-y-5 overflow-y-auto">
        {GROUPS.map(group => (
          <div key={group.label}>
            <p className="font-body text-[10px] uppercase tracking-[0.15em] text-white/30 px-3 mb-1">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.links.map(({ to, icon, label, badge }) => {
                const count = badge ? badges[badge] : 0
                return (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-body transition-all ${
                        isActive
                          ? 'bg-accent/20 text-accent'
                          : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`
                    }
                  >
                    <span className="flex items-center gap-3">
                      <span>{label}</span>
                    </span>
                    {count > 0 && (
                      <span className="bg-accent text-white text-[10px] font-body font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                        {count}
                      </span>
                    )}
                  </NavLink>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 border-t border-white/10 pt-4 space-y-1">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body text-white/60 hover:text-white hover:bg-white/5 transition-all"
        >
          <span>View Site</span>
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body text-white/60 hover:text-red-400 hover:bg-red-400/10 transition-all"
        >
          <span>Sign Out</span>
        </button>
      </div>

    </aside>
  )
}
