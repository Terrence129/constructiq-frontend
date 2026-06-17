export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  BLOCKED = 'BLOCKED',
  DONE = 'DONE',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export interface Task {
  id: number
  projectId: number
  projectName: string
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  assignee: string | null
  dueDate: string | null
  createdAt: string
  updatedAt: string | null
}

export interface TaskRequest {
  title: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  assignee?: string
  dueDate?: string
}
