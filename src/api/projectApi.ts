import { apiClient } from './axios'
import type { CreateProjectRequest, Project } from '../types'

export async function getProjects(): Promise<Project[]> {
  const { data } = await apiClient.get<Project[]>('/api/projects')

  return data
}

export async function createProject(
  request: CreateProjectRequest,
): Promise<Project> {
  const { data } = await apiClient.post<Project>('/api/projects', request)

  return data
}
