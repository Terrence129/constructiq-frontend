export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

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

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}
