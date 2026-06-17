export type ProjectStatus =
  | 'PLANNING'
  | 'ACTIVE'
  | 'ON_HOLD'
  | 'COMPLETED'
  | 'CANCELLED'

export interface Project {
  id: number
  name: string
  description?: string
  location?: string
  clientName?: string
  status: ProjectStatus
  startDate?: string
  endDate?: string
  createdById: number
  createdByName: string
  createdAt: string
  updatedAt?: string | null
}
