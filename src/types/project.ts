export enum ProjectStatus {
  PLANNING = 'PLANNING',
  ACTIVE = 'ACTIVE',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum ProjectMemberRole {
  MEMBER = 'MEMBER',
  MANAGER = 'MANAGER',
}

export interface Project {
  id: number
  name: string
  description: string | null
  location: string | null
  clientName: string | null
  status: ProjectStatus
  startDate: string | null
  endDate: string | null
  createdById: number
  createdByName: string
  createdAt: string
  updatedAt: string | null
}

export interface ProjectMemberRequest {
  userId: number
  title?: string
  description?: string
  role?: ProjectMemberRole
}

export interface CreateProjectRequest {
  name: string
  description?: string
  location?: string
  clientName?: string
  status?: ProjectStatus
  startDate?: string
  endDate?: string
  members?: ProjectMemberRequest[]
}

export interface UpdateProjectRequest {
  name: string
  description?: string
  location?: string
  clientName?: string
  status?: ProjectStatus
  startDate?: string
  endDate?: string
}

export interface ProjectRegistration {
  id: number
  userId: number
  userName: string
  userEmail: string
  projectId: number
  projectName: string
  title: string | null
  description: string | null
  role: ProjectMemberRole
  createdAt: string
  updatedAt: string | null
}

export interface ProjectRegistrationRequest {
  userId: number
  title?: string
  description?: string
  role?: ProjectMemberRole
}
