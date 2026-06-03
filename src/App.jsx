import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/admin/PrivateRoute'
import AdminLayout from './components/admin/AdminLayout'
import Home from './pages/Home'
import Gallery from './pages/Gallery'
import PortfolioCategoryPage from './pages/PortfolioCategoryPage'
import AdminLogin from './pages/Admin/AdminLogin'
import AdminDashboard from './pages/Admin/AdminDashboard'
import AdminSlides from './pages/Admin/AdminSlides'
import AdminPortfolio from './pages/Admin/AdminPortfolio'
import AdminCategories from './pages/Admin/AdminCategories'
import AdminPackages from './pages/Admin/AdminPackages'
import AdminAbout from './pages/Admin/AdminAbout'
import AdminTeam from './pages/Admin/AdminTeam'
import AdminTestimonials from './pages/Admin/AdminTestimonials'
import AdminMessages from './pages/Admin/AdminMessages'
import AdminSettings from './pages/Admin/AdminSettings'
import FloatingContactButtons from './components/ui/FloatingContactButtons'

function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) return
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [hash, pathname])

  return null
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Toaster
          position="top-right"
          toastOptions={{
            style: { fontFamily: 'Lato, sans-serif', fontSize: '14px' },
            success: { iconTheme: { primary: '#C4A882', secondary: '#fff' } },
          }}
        />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/portfolio/:categorySlug" element={<PortfolioCategoryPage />} />
          <Route path="/portfolio/:categorySlug/:photoId" element={<PortfolioCategoryPage />} />

          {/* Admin auth */}
          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin protected */}
          <Route element={<PrivateRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard"             element={<AdminDashboard />} />
              <Route path="/admin/slides"                element={<AdminSlides />} />
              <Route path="/admin/portfolio"             element={<AdminPortfolio />} />
              <Route path="/admin/portfolio/categories"  element={<AdminCategories />} />
              <Route path="/admin/packages"              element={<AdminPackages />} />
              <Route path="/admin/about"                 element={<AdminAbout />} />
              <Route path="/admin/team"                  element={<AdminTeam />} />
              <Route path="/admin/testimonials"          element={<AdminTestimonials />} />
              <Route path="/admin/messages"              element={<AdminMessages />} />
              <Route path="/admin/settings"              element={<AdminSettings />} />
            </Route>
          </Route>
        </Routes>
        <FloatingContactButtons />
      </BrowserRouter>
    </AuthProvider>
  )
}
