import { apiClient } from './axios'
import type { DashboardStatistics } from '../types'

export async function getDashboardStatistics(): Promise<DashboardStatistics> {
  const { data } = await apiClient.get<DashboardStatistics>(
    '/api/dashboard/statistics',
  )

  return data
}

export async function createDashboardStatisticsSnapshot(): Promise<DashboardStatistics> {
  const { data } = await apiClient.post<DashboardStatistics>(
    '/api/dashboard/statistics/snapshots',
  )

  return data
}

export async function getLatestDashboardStatisticsSnapshot(): Promise<DashboardStatistics> {
  const { data } = await apiClient.get<DashboardStatistics>(
    '/api/dashboard/statistics/snapshots/latest',
  )

  return data
}
