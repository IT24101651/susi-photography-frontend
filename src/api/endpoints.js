import api from './axios'

// ── Auth ──────────────────────────────────────────────────────────────────────
export const login = (credentials) => api.post('/auth/login/', credentials).then(r => r.data)

// ── Public ────────────────────────────────────────────────────────────────────
export const getSlides      = ()       => api.get('/slides/').then(r => r.data)
export const getPortfolioAll = ()      => api.get('/portfolio/').then(r => r.data)
export const getPortfolioPreview  = ()     => api.get('/portfolio/?preview=true').then(r => r.data)
export const getPortfolioByCategory = (slug) => api.get(`/portfolio/?category=${slug}`).then(r => r.data)
export const getCategories  = ()       => api.get('/portfolio/categories/').then(r => r.data)
export const getPackages    = ()       => api.get('/packages/').then(r => r.data)
export const getPackagesByCategory = (slug) => api.get(`/packages/?category=${slug}`).then(r => r.data)
export const getAbout       = ()       => api.get('/about/').then(r => r.data)
export const getTeam        = ()       => api.get('/team/').then(r => r.data)
export const getTestimonials= ()       => api.get('/testimonials/').then(r => r.data)
export const postContact    = (data)   => api.post('/contact/', data).then(r => r.data)
export const getSettings    = ()       => api.get('/settings/').then(r => r.data)

// ── Admin: Slides ─────────────────────────────────────────────────────────────
export const adminGetSlides    = ()         => api.get('/admin/slides/').then(r => r.data)
export const adminCreateSlide  = (data)     => api.post('/admin/slides/', data).then(r => r.data)
export const adminUpdateSlide  = (id, data) => api.patch(`/admin/slides/${id}/`, data).then(r => r.data)
export const adminDeleteSlide  = (id)       => api.delete(`/admin/slides/${id}/`)

// ── Admin: Portfolio ──────────────────────────────────────────────────────────
export const adminGetPortfolio    = ()         => api.get('/admin/portfolio/').then(r => r.data)
export const adminCreatePortfolio = (data)     => api.post('/admin/portfolio/', data).then(r => r.data)
export const adminUpdatePortfolio = (id, data) => api.patch(`/admin/portfolio/${id}/`, data).then(r => r.data)
export const adminDeletePortfolio = (id)       => api.delete(`/admin/portfolio/${id}/`)

export const adminGetCategories    = ()         => api.get('/admin/portfolio/categories/').then(r => r.data)
export const adminCreateCategory   = (data)     => api.post('/admin/portfolio/categories/', data).then(r => r.data)
export const adminUpdateCategory   = (slug, data) => api.patch(`/admin/portfolio/categories/${slug}/`, data).then(r => r.data)
export const adminDeleteCategory   = (slug)     => api.delete(`/admin/portfolio/categories/${slug}/`)
export const adminGetPackages      = ()         => api.get('/admin/packages/').then(r => r.data)
export const adminCreatePackage    = (data)     => api.post('/admin/packages/', data).then(r => r.data)
export const adminUpdatePackage    = (id, data) => api.patch(`/admin/packages/${id}/`, data).then(r => r.data)
export const adminDeletePackage    = (id)       => api.delete(`/admin/packages/${id}/`)

// ── Admin: About ──────────────────────────────────────────────────────────────
export const adminGetAbout    = ()     => api.get('/admin/about/').then(r => r.data)
export const adminUpdateAbout = (data) => api.put('/admin/about/', data).then(r => r.data)

// ── Admin: Team ───────────────────────────────────────────────────────────────
export const adminGetTeam    = ()         => api.get('/admin/team/').then(r => r.data)
export const adminCreateTeam = (data)     => api.post('/admin/team/', data).then(r => r.data)
export const adminUpdateTeam = (id, data) => api.patch(`/admin/team/${id}/`, data).then(r => r.data)
export const adminDeleteTeam = (id)       => api.delete(`/admin/team/${id}/`)

// ── Admin: Testimonials ───────────────────────────────────────────────────────
export const adminGetTestimonials    = ()         => api.get('/admin/testimonials/').then(r => r.data)
export const adminCreateTestimonial  = (data)     => api.post('/admin/testimonials/', data).then(r => r.data)
export const adminUpdateTestimonial  = (id, data) => api.patch(`/admin/testimonials/${id}/`, data).then(r => r.data)
export const adminDeleteTestimonial  = (id)       => api.delete(`/admin/testimonials/${id}/`)
export const adminApproveTestimonial = (id)       => api.post(`/admin/testimonials/${id}/approve/`).then(r => r.data)
export const adminRejectTestimonial  = (id)       => api.post(`/admin/testimonials/${id}/reject/`).then(r => r.data)

// ── Admin: Messages ───────────────────────────────────────────────────────────
export const adminGetMessages  = ()   => api.get('/admin/messages/').then(r => r.data)
export const adminMarkRead     = (id) => api.post(`/admin/messages/${id}/mark-read/`).then(r => r.data)

// ── Admin: Settings ───────────────────────────────────────────────────────────
export const adminGetSettings    = ()     => api.get('/admin/settings/').then(r => r.data)
export const adminUpdateSettings = (data) => api.put('/admin/settings/', data).then(r => r.data)
