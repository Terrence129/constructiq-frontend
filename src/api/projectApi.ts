import { apiClient } from './axios'
import type { CreateProjectRequest, Project, UpdateProjectRequest } from '../types'

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

export async function getProjectById(projectId: number): Promise<Project> {
  const { data } = await apiClient.get<Project>(`/api/projects/${projectId}`)

  return data
}

export async function updateProject(
  projectId: number,
  request: UpdateProjectRequest,
): Promise<Project> {
  const { data } = await apiClient.put<Project>(
    `/api/projects/${projectId}`,
    request,
  )

  return data
}

export async function deleteProject(projectId: number): Promise<void> {
  await apiClient.delete(`/api/projects/${projectId}`)
}
