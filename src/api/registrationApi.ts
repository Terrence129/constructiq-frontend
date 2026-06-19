import { apiClient } from './axios'
import type { ProjectRegistration, ProjectRegistrationRequest } from '../types'

export async function getProjectRegistrations(
  projectId: number,
): Promise<ProjectRegistration[]> {
  const { data } = await apiClient.get<ProjectRegistration[]>(
    `/api/projects/${projectId}/registrations`,
  )

  return data
}

export async function addProjectRegistration(
  projectId: number,
  request: ProjectRegistrationRequest,
): Promise<ProjectRegistration> {
  const { data } = await apiClient.post<ProjectRegistration>(
    `/api/projects/${projectId}/registrations`,
    request,
  )

  return data
}

export async function deleteProjectRegistration(
  projectId: number,
  registrationId: number,
): Promise<void> {
  await apiClient.delete(
    `/api/projects/${projectId}/registrations/${registrationId}`,
  )
}
