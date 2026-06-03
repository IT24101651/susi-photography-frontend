import { createContext, useContext, useState } from 'react'
import { login as apiLogin } from '../api/endpoints'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('access'))

  const signIn = async (credentials) => {
    const data = await apiLogin(credentials)
    localStorage.setItem('access', data.access)
    localStorage.setItem('refresh', data.refresh)
    setToken(data.access)
  }

  const signOut = () => {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: !!token, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
