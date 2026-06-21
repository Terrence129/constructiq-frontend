import { apiClient } from './axios'
import type { Task, TaskPriority, TaskRequest, TaskStatus } from '../types'

export interface TaskListParams {
  priority?: TaskPriority
  status?: TaskStatus
}

export async function getTasks(params?: TaskListParams): Promise<Task[]> {
  const { data } = await apiClient.get<Task[]>('/api/tasks', { params })

  return data
}

export async function getTasksByProject(projectId: number): Promise<Task[]> {
  const { data } = await apiClient.get<Task[]>(
    `/api/projects/${projectId}/tasks`,
  )

  return data
}

export async function createTask(
  projectId: number,
  request: TaskRequest,
): Promise<Task> {
  const { data } = await apiClient.post<Task>(
    `/api/projects/${projectId}/tasks`,
    request,
  )

  return data
}

export async function updateTask(
  taskId: number,
  request: TaskRequest,
): Promise<Task> {
  const { data } = await apiClient.put<Task>(`/api/tasks/${taskId}`, request)

  return data
}

export async function deleteTask(taskId: number): Promise<void> {
  await apiClient.delete(`/api/tasks/${taskId}`)
}
