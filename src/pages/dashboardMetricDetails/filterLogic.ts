import dayjs from 'dayjs'
import type { ProgressReport, Project, Risk, Task } from '../../types'
import { RiskStatus, TaskStatus } from '../../types'
import type {
  ProjectStatusFilter,
  RiskCategoryFilter,
  RiskLevelFilter,
  RiskStatusFilter,
  TaskDueFilter,
  TaskPriorityFilter,
  TaskStatusFilter,
} from './metricConfig'

export function filterProjects(
  projects: Project[],
  searchTerm: string,
  statusFilter: ProjectStatusFilter,
) {
  const normalizedSearch = normalizeSearch(searchTerm)

  return projects.filter((project) => {
    const matchesStatus =
      statusFilter === 'ALL' || project.status === statusFilter
    const matchesSearch =
      normalizedSearch.length === 0 ||
      [project.name, project.clientName ?? '', project.location ?? '']
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch)

    return matchesStatus && matchesSearch
  })
}

export function getTaskServerFilters(
  statusFilter: TaskStatusFilter,
  priorityFilter: TaskPriorityFilter,
) {
  return {
    priority: priorityFilter !== 'ALL' ? priorityFilter : undefined,
    status:
      statusFilter !== 'ALL' && statusFilter !== 'OPEN'
        ? statusFilter
        : undefined,
  }
}

export function filterTasks(
  tasks: Task[],
  searchTerm: string,
  statusFilter: TaskStatusFilter,
  dueFilter: TaskDueFilter,
) {
  const normalizedSearch = normalizeSearch(searchTerm)

  return tasks.filter((task) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      [task.title, task.projectName, task.assignee ?? '']
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch)
    const matchesOpen =
      statusFilter !== 'OPEN' || task.status !== TaskStatus.DONE
    const matchesDue =
      dueFilter !== 'OVERDUE' ||
      (task.status !== TaskStatus.DONE &&
        task.dueDate !== null &&
        dayjs(task.dueDate).isBefore(dayjs(), 'day'))

    return matchesSearch && matchesOpen && matchesDue
  })
}

export function getRiskServerFilters(
  categoryFilter: RiskCategoryFilter,
  levelFilter: RiskLevelFilter,
  statusFilter: RiskStatusFilter,
) {
  return {
    category: categoryFilter !== 'ALL' ? categoryFilter : undefined,
    riskLevel: levelFilter !== 'ALL' ? levelFilter : undefined,
    status:
      statusFilter !== 'ALL' && statusFilter !== 'NOT_CLOSED'
        ? statusFilter
        : undefined,
  }
}

export function filterRisks(
  risks: Risk[],
  searchTerm: string,
  statusFilter: RiskStatusFilter,
) {
  const normalizedSearch = normalizeSearch(searchTerm)

  return risks.filter((risk) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      [risk.title, risk.projectName, risk.owner ?? '', risk.category]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch)
    const matchesStatus =
      statusFilter !== 'NOT_CLOSED' || risk.status !== RiskStatus.CLOSED

    return matchesSearch && matchesStatus
  })
}

export function getReportProjectOptions(reports: ProgressReport[]) {
  return Array.from(new Set(reports.map((report) => report.projectName))).sort()
}

export function filterReports(
  reports: ProgressReport[],
  searchTerm: string,
  projectFilter: string,
  fromDate: string,
  toDate: string,
) {
  const normalizedSearch = normalizeSearch(searchTerm)

  return reports
    .filter((report) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        [report.summary, report.projectName, report.createdByName]
          .join(' ')
          .toLowerCase()
          .includes(normalizedSearch)
      const matchesProject =
        projectFilter === 'ALL' || report.projectName === projectFilter
      const matchesFrom = fromDate === '' || report.reportDate >= fromDate
      const matchesTo = toDate === '' || report.reportDate <= toDate

      return matchesSearch && matchesProject && matchesFrom && matchesTo
    })
    .sort((first, second) => second.reportDate.localeCompare(first.reportDate))
}

function normalizeSearch(value: string) {
  return value.trim().toLowerCase()
}
