import { apiClient, AUTH_TOKEN_STORAGE_KEY, AUTH_USER_STORAGE_KEY } from './axios'
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '../types'

export async function login(request: LoginRequest): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/api/auth/login', request)

  persistAuth(data)

  return data
}

export async function register(request: RegisterRequest): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/api/auth/register', request)

  persistAuth(data)

  return data
}

export function logout() {
  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
  localStorage.removeItem(AUTH_USER_STORAGE_KEY)
}

export function getStoredToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)
}

export function getStoredUser(): User | null {
  const rawUser = localStorage.getItem(AUTH_USER_STORAGE_KEY)

  if (!rawUser) {
    return null
  }

  try {
    return JSON.parse(rawUser) as User
  } catch {
    localStorage.removeItem(AUTH_USER_STORAGE_KEY)
    return null
  }
}

function persistAuth(response: AuthResponse) {
  localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, response.token)
  localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(response.user))
}
