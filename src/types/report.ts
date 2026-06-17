export interface ProgressReport {
  id: number
  projectId: number
  projectName: string
  reportDate: string
  summary: string
  completedWork?: string
  delayedWork?: string
  issues?: string
  nextActions?: string
  createdByName: string
}
