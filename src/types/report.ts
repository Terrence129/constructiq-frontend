export interface ProgressReport {
  id: number
  projectId: number
  projectName: string
  reportDate: string
  summary: string
  completedWork: string | null
  delayedWork: string | null
  issues: string | null
  nextActions: string | null
  createdById: number
  createdByName: string
  createdAt: string
  updatedAt: string | null
}

export interface CreateProgressReportRequest {
  reportDate: string
  summary: string
  completedWork?: string
  delayedWork?: string
  issues?: string
  nextActions?: string
}

export interface UpdateProgressReportRequest {
  reportDate?: string
  summary?: string
  completedWork?: string
  delayedWork?: string
  issues?: string
  nextActions?: string
}
