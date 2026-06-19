import { apiClient } from './axios'
import type { User } from '../types'

export interface UserSearchParams {
  email?: string
  name?: string
}

export async function getUsers(params: UserSearchParams = {}): Promise<User[]> {
  const { data } = await apiClient.get<User[]>('/api/users', { params })

  return data
}

export async function getUserById(userId: number): Promise<User> {
  const { data } = await apiClient.get<User>(`/api/users/${userId}`)

  return data
}
