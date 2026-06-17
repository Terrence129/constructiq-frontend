export type UserRole = 'USER' | 'ADMIN'

export interface User {
  id: number
  name: string
  email: string
  role: UserRole
}

export interface AuthResponse {
  token: string
  tokenType: 'Bearer'
  user: User
}
