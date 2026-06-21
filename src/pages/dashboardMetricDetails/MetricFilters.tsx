import {
  ProjectStatus,
  RiskCategory,
  RiskLevel,
  RiskStatus,
  TaskPriority,
  TaskStatus,
} from '../../types'
import { SectionCard } from '../../components/ui/SectionCard'
import { formatEnumLabel } from './formatters'
import type {
  ProjectStatusFilter,
  RiskCategoryFilter,
  RiskLevelFilter,
  RiskStatusFilter,
  TaskDueFilter,
  TaskPriorityFilter,
  TaskStatusFilter,
} from './metricConfig'

export function ProjectFilters({
  onReset,
  onSearchChange,
  onStatusChange,
  searchTerm,
  statusFilter,
}: {
  onReset: () => void
  onSearchChange: (value: string) => void
  onStatusChange: (value: ProjectStatusFilter) => void
  searchTerm: string
  statusFilter: ProjectStatusFilter
}) {
  return (
    <SectionCard
      title="Filters"
      toolbar={
        <button className="text-sm text-ci-blue-800" onClick={onReset} type="button">
          Reset
        </button>
      }
    >
      <div className="grid gap-3 p-4 md:grid-cols-[1fr_220px]">
        <input
          className="h-9 border border-gray-300 px-3 outline-none focus:border-ci-blue-800"
          placeholder="Search by project, client, or location"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
        />
        <select
          className="h-9 border border-gray-300 px-3 outline-none focus:border-ci-blue-800"
          value={statusFilter}
          onChange={(event) =>
            onStatusChange(event.target.value as ProjectStatusFilter)
          }
        >
          <option value="ALL">All statuses</option>
          {Object.values(ProjectStatus).map((status) => (
            <option key={status} value={status}>
              {formatEnumLabel(status)}
            </option>
          ))}
        </select>
      </div>
    </SectionCard>
  )
}

export function TaskFilters({
  dueFilter,
  onDueChange,
  onPriorityChange,
  onReset,
  onSearchChange,
  onStatusChange,
  priorityFilter,
  searchTerm,
  statusFilter,
}: {
  dueFilter: TaskDueFilter
  onDueChange: (value: TaskDueFilter) => void
  onPriorityChange: (value: TaskPriorityFilter) => void
  onReset: () => void
  onSearchChange: (value: string) => void
  onStatusChange: (value: TaskStatusFilter) => void
  priorityFilter: TaskPriorityFilter
  searchTerm: string
  statusFilter: TaskStatusFilter
}) {
  return (
    <SectionCard
      title="Filters"
      toolbar={
        <button
          className="text-sm text-ci-blue-800"
          onClick={onReset}
          type="button"
        >
          Reset
        </button>
      }
    >
      <div className="grid gap-3 p-4 md:grid-cols-[1fr_180px_180px_180px]">
        <input
          className="h-9 border border-gray-300 px-3 outline-none focus:border-ci-blue-800"
          placeholder="Search by task, project, or assignee"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
        />
        <select
          className="h-9 border border-gray-300 px-3 outline-none focus:border-ci-blue-800"
          value={statusFilter}
          onChange={(event) =>
            onStatusChange(event.target.value as TaskStatusFilter)
          }
        >
          <option value="ALL">All statuses</option>
          <option value="OPEN">Open</option>
          {Object.values(TaskStatus).map((status) => (
            <option key={status} value={status}>
              {formatEnumLabel(status)}
            </option>
          ))}
        </select>
        <select
          className="h-9 border border-gray-300 px-3 outline-none focus:border-ci-blue-800"
          value={priorityFilter}
          onChange={(event) =>
            onPriorityChange(event.target.value as TaskPriorityFilter)
          }
        >
          <option value="ALL">All priorities</option>
          {Object.values(TaskPriority).map((priority) => (
            <option key={priority} value={priority}>
              {formatEnumLabel(priority)}
            </option>
          ))}
        </select>
        <select
          className="h-9 border border-gray-300 px-3 outline-none focus:border-ci-blue-800"
          value={dueFilter}
          onChange={(event) => onDueChange(event.target.value as TaskDueFilter)}
        >
          <option value="ALL">All due dates</option>
          <option value="OVERDUE">Overdue</option>
        </select>
      </div>
    </SectionCard>
  )
}

export function RiskFilters({
  categoryFilter,
  levelFilter,
  onCategoryChange,
  onLevelChange,
  onReset,
  onSearchChange,
  onStatusChange,
  searchTerm,
  statusFilter,
}: {
  categoryFilter: RiskCategoryFilter
  levelFilter: RiskLevelFilter
  onCategoryChange: (value: RiskCategoryFilter) => void
  onLevelChange: (value: RiskLevelFilter) => void
  onReset: () => void
  onSearchChange: (value: string) => void
  onStatusChange: (value: RiskStatusFilter) => void
  searchTerm: string
  statusFilter: RiskStatusFilter
}) {
  return (
    <SectionCard
      title="Filters"
      toolbar={
        <button
          className="text-sm text-ci-blue-800"
          onClick={onReset}
          type="button"
        >
          Reset
        </button>
      }
    >
      <div className="grid gap-3 p-4 md:grid-cols-[1fr_180px_180px_180px]">
        <input
          className="h-9 border border-gray-300 px-3 outline-none focus:border-ci-blue-800"
          placeholder="Search by risk, project, owner, or category"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
        />
        <select
          className="h-9 border border-gray-300 px-3 outline-none focus:border-ci-blue-800"
          value={categoryFilter}
          onChange={(event) =>
            onCategoryChange(event.target.value as RiskCategoryFilter)
          }
        >
          <option value="ALL">All categories</option>
          {Object.values(RiskCategory).map((category) => (
            <option key={category} value={category}>
              {formatEnumLabel(category)}
            </option>
          ))}
        </select>
        <select
          className="h-9 border border-gray-300 px-3 outline-none focus:border-ci-blue-800"
          value={levelFilter}
          onChange={(event) =>
            onLevelChange(event.target.value as RiskLevelFilter)
          }
        >
          <option value="ALL">All levels</option>
          {Object.values(RiskLevel).map((level) => (
            <option key={level} value={level}>
              {formatEnumLabel(level)}
            </option>
          ))}
        </select>
        <select
          className="h-9 border border-gray-300 px-3 outline-none focus:border-ci-blue-800"
          value={statusFilter}
          onChange={(event) =>
            onStatusChange(event.target.value as RiskStatusFilter)
          }
        >
          <option value="ALL">All statuses</option>
          <option value="NOT_CLOSED">Not closed</option>
          {Object.values(RiskStatus).map((status) => (
            <option key={status} value={status}>
              {formatEnumLabel(status)}
            </option>
          ))}
        </select>
      </div>
    </SectionCard>
  )
}

export function ReportFilters({
  fromDate,
  onFromDateChange,
  onProjectChange,
  onReset,
  onSearchChange,
  onToDateChange,
  projectFilter,
  projectOptions,
  searchTerm,
  toDate,
}: {
  fromDate: string
  onFromDateChange: (value: string) => void
  onProjectChange: (value: string) => void
  onReset: () => void
  onSearchChange: (value: string) => void
  onToDateChange: (value: string) => void
  projectFilter: string
  projectOptions: string[]
  searchTerm: string
  toDate: string
}) {
  return (
    <SectionCard
      title="Filters"
      toolbar={
        <button
          className="text-sm text-ci-blue-800"
          onClick={onReset}
          type="button"
        >
          Reset
        </button>
      }
    >
      <div className="grid gap-3 p-4 md:grid-cols-[1fr_220px_160px_160px]">
        <input
          className="h-9 border border-gray-300 px-3 outline-none focus:border-ci-blue-800"
          placeholder="Search by summary, project, or creator"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
        />
        <select
          className="h-9 border border-gray-300 px-3 outline-none focus:border-ci-blue-800"
          value={projectFilter}
          onChange={(event) => onProjectChange(event.target.value)}
        >
          <option value="ALL">All projects</option>
          {projectOptions.map((projectName) => (
            <option key={projectName} value={projectName}>
              {projectName}
            </option>
          ))}
        </select>
        <input
          className="h-9 border border-gray-300 px-3 outline-none focus:border-ci-blue-800"
          type="date"
          value={fromDate}
          onChange={(event) => onFromDateChange(event.target.value)}
        />
        <input
          className="h-9 border border-gray-300 px-3 outline-none focus:border-ci-blue-800"
          type="date"
          value={toDate}
          onChange={(event) => onToDateChange(event.target.value)}
        />
      </div>
    </SectionCard>
  )
}
