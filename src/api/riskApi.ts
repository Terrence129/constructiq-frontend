import { apiClient } from './axios'
import type { Risk, RiskRequest } from '../types'

export async function getRisksByProject(projectId: number): Promise<Risk[]> {
  const { data } = await apiClient.get<Risk[]>(
    `/api/projects/${projectId}/risks`,
  )

  return data
}

export async function createRisk(
  projectId: number,
  request: RiskRequest,
): Promise<Risk> {
  const { data } = await apiClient.post<Risk>(
    `/api/projects/${projectId}/risks`,
    request,
  )

  return data
}

export async function updateRisk(
  riskId: number,
  request: RiskRequest,
): Promise<Risk> {
  const { data } = await apiClient.put<Risk>(`/api/risks/${riskId}`, request)

  return data
}

export async function deleteRisk(riskId: number): Promise<void> {
  await apiClient.delete(`/api/risks/${riskId}`)
}
