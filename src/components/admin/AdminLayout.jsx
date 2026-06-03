import { Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import AdminSidebar from './AdminSidebar'

const TITLES = {
  '/admin/dashboard':              'Dashboard',
  '/admin/slides':                 'Hero Slides',
  '/admin/portfolio':              'Portfolio',
  '/admin/portfolio/categories':   'Categories',
  '/admin/packages':               'Packages',
  '/admin/about':                  'About Section',
  '/admin/team':                   'Proprietors',
  '/admin/testimonials':           'Testimonials',
  '/admin/messages':               'Messages',
  '/admin/settings':               'Settings',
}

export default function AdminLayout() {
  const { pathname } = useLocation()
  const title = TITLES[pathname] ?? 'Admin'

  return (
    <div className="flex min-h-screen bg-[#f4f5f7]">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">

        {/* Topbar */}
        <header className="bg-white border-b border-sand px-8 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="font-heading text-xl text-text">{title}</h1>
            <p className="font-body text-xs text-muted mt-0.5">
              Admin / {title}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white font-heading text-sm">
              A
            </div>
            <div className="hidden sm:block">
              <p className="font-body text-sm text-text leading-none">Admin</p>
              <p className="font-body text-xs text-muted mt-0.5">Administrator</p>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>

      </div>
    </div>
  )
}
