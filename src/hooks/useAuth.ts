import { useCallback, useMemo, useState } from 'react'
import * as authApi from '../api/authApi'
import type { LoginRequest, RegisterRequest, User } from '../types'

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => authApi.getStoredUser())
  const [token, setToken] = useState<string | null>(() => authApi.getStoredToken())

  const login = useCallback(async (request: LoginRequest) => {
    const response = await authApi.login(request)
    setUser(response.user)
    setToken(response.token)
    return response
  }, [])

  const register = useCallback(async (request: RegisterRequest) => {
    const response = await authApi.register(request)
    setUser(response.user)
    setToken(response.token)
    return response
  }, [])

  const logout = useCallback(() => {
    authApi.logout()
    setUser(null)
    setToken(null)
  }, [])

  return useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout,
    }),
    [login, logout, register, token, user],
  )
}
