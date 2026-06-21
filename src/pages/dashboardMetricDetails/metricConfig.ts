import type { DashboardStatistics } from '../../types'
import {
  ProjectStatus,
  RiskCategory,
  RiskLevel,
  RiskStatus,
  TaskPriority,
  TaskStatus,
} from '../../types'

export type DashboardMetricKey = Extract<
  keyof DashboardStatistics,
  | 'totalProjects'
  | 'activeProjects'
  | 'completedProjects'
  | 'totalTasks'
  | 'openTasks'
  | 'completedTasks'
  | 'overdueTasks'
  | 'totalRisks'
  | 'openRisks'
  | 'highRisks'
  | 'criticalRisks'
  | 'progressReports'
  | 'documents'
>

export type MetricResource =
  | 'projects'
  | 'tasks'
  | 'risks'
  | 'reports'
  | 'documents'

export type ProjectStatusFilter = ProjectStatus | 'ALL'
export type TaskStatusFilter = TaskStatus | 'ALL' | 'OPEN'
export type TaskPriorityFilter = TaskPriority | 'ALL'
export type TaskDueFilter = 'ALL' | 'OVERDUE'
export type RiskStatusFilter = RiskStatus | 'ALL' | 'NOT_CLOSED'
export type RiskLevelFilter = RiskLevel | 'ALL'
export type RiskCategoryFilter = RiskCategory | 'ALL'

export interface MetricDetail {
  title: string
  description: string
  resource: MetricResource
  projectStatus?: ProjectStatus
  riskLevel?: RiskLevel
  riskStatusFilter?: RiskStatusFilter
  taskDueFilter?: TaskDueFilter
  taskStatusFilter?: TaskStatusFilter
}

export const dashboardMetricDetails: Record<DashboardMetricKey, MetricDetail> = {
  totalProjects: {
    title: 'Total Projects',
    description: 'All accessible projects from the project registry.',
    resource: 'projects',
  },
  activeProjects: {
    title: 'Active Projects',
    description: 'Accessible projects currently marked active.',
    resource: 'projects',
    projectStatus: ProjectStatus.ACTIVE,
  },
  completedProjects: {
    title: 'Completed Projects',
    description: 'Accessible projects marked completed.',
    resource: 'projects',
    projectStatus: ProjectStatus.COMPLETED,
  },
  totalTasks: {
    title: 'Total Tasks',
    description: 'All tasks under projects you can access.',
    resource: 'tasks',
  },
  openTasks: {
    title: 'Open Tasks',
    description: 'Tasks that are not marked done.',
    resource: 'tasks',
    taskStatusFilter: 'OPEN',
  },
  completedTasks: {
    title: 'Completed Tasks',
    description: 'Tasks marked done.',
    resource: 'tasks',
    taskStatusFilter: TaskStatus.DONE,
  },
  overdueTasks: {
    title: 'Overdue Tasks',
    description: 'Tasks past due and not marked done.',
    resource: 'tasks',
    taskDueFilter: 'OVERDUE',
    taskStatusFilter: 'OPEN',
  },
  totalRisks: {
    title: 'Total Risks',
    description: 'All risks under projects you can access.',
    resource: 'risks',
  },
  openRisks: {
    title: 'Open Risks',
    description: 'Risks that are not closed.',
    resource: 'risks',
    riskStatusFilter: 'NOT_CLOSED',
  },
  highRisks: {
    title: 'High Risks',
    description: 'Risks currently rated high.',
    resource: 'risks',
    riskLevel: RiskLevel.HIGH,
  },
  criticalRisks: {
    title: 'Critical Risks',
    description: 'Risks currently rated critical.',
    resource: 'risks',
    riskLevel: RiskLevel.CRITICAL,
  },
  progressReports: {
    title: 'Progress Reports',
    description: 'Progress reports under projects you can access.',
    resource: 'reports',
  },
  documents: {
    title: 'Documents',
    description:
      'Documents are managed inside each project. Select a project to open its document records.',
    resource: 'documents',
  },
}

export function getDashboardMetricDetail(
  metricKey: string | undefined,
): MetricDetail | undefined {
  return dashboardMetricDetails[metricKey as DashboardMetricKey]
}

export function getDashboardMetricPath(metricKey: DashboardMetricKey): string {
  return `/dashboard/${metricKey}`
}
