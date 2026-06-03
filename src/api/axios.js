import axios from 'axios'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '')

const api = axios.create({ baseURL: API_BASE_URL })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        const refresh = localStorage.getItem('refresh')
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh/`, { refresh })
        localStorage.setItem('access', data.access)
        original.headers.Authorization = `Bearer ${data.access}`
        return api(original)
      } catch {
        localStorage.removeItem('access')
        localStorage.removeItem('refresh')
        window.location.href = '/admin/login'
      }
    }
    return Promise.reject(err)
  }
)

export default api
