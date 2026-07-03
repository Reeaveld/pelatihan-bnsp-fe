import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { authApi } from '../api/auth'

const AuthContext = createContext(null)

const STORAGE_KEY = 'cinema.auth.user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    else localStorage.removeItem(STORAGE_KEY)
  }, [user])

  const login = async ({ email, password }) => {
    setLoading(true)
    try {
      const res = await authApi.login({ email, password })
      setUser(res.data)
      return res
    } finally {
      setLoading(false)
    }
  }

  const register = async ({ username, email, password }) => {
    setLoading(true)
    try {
      const res = await authApi.register({ username, email, password })
      setUser(res.data)
      return res
    } finally {
      setLoading(false)
    }
  }

  const logout = () => setUser(null)

  const value = useMemo(
    () => ({ user, loading, login, register, logout, isAuthenticated: !!user }),
    [user, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth harus dipakai di dalam <AuthProvider>')
  return ctx
}
