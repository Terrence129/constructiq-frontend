export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'BLOCKED' | 'DONE'
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export interface Task {
  id: number
  projectId: number
  projectName: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  assignee?: string
  dueDate?: string
  createdAt: string
  updatedAt?: string | null
}
