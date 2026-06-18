import { apiClient } from './axios'
import type {
  CreateProgressReportRequest,
  ProgressReport,
  UpdateProgressReportRequest,
} from '../types'

export async function getReportsByProject(
  projectId: number,
): Promise<ProgressReport[]> {
  const { data } = await apiClient.get<ProgressReport[]>(
    `/api/projects/${projectId}/progressReports`,
  )

  return data
}

export async function createReport(
  projectId: number,
  request: CreateProgressReportRequest,
): Promise<ProgressReport> {
  const { data } = await apiClient.post<ProgressReport>(
    `/api/projects/${projectId}/progressReports`,
    request,
  )

  return data
}

export async function getReportById(reportId: number): Promise<ProgressReport> {
  const { data } = await apiClient.get<ProgressReport>(
    `/api/progressReports/${reportId}`,
  )

  return data
}

export async function updateReport(
  reportId: number,
  request: UpdateProgressReportRequest,
): Promise<ProgressReport> {
  const { data } = await apiClient.put<ProgressReport>(
    `/api/progressReports/${reportId}`,
    request,
  )

  return data
}

export async function deleteReport(reportId: number): Promise<void> {
  await apiClient.delete(`/api/progressReports/${reportId}`)
}
