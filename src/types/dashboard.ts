export interface DashboardStatistics {
  snapshotId: number | null
  userId: number
  userName: string
  totalProjects: number
  activeProjects: number
  completedProjects: number
  totalTasks: number
  openTasks: number
  completedTasks: number
  overdueTasks: number
  totalRisks: number
  openRisks: number
  highRisks: number
  criticalRisks: number
  progressReports: number
  documents: number
  generatedAt: string
}
