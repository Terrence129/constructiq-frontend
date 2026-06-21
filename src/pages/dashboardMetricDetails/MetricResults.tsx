import { Link } from 'react-router-dom'
import { ProjectStatusBadge } from '../../components/project/ProjectStatusBadge'
import { RiskLevelBadge } from '../../components/risk/RiskLevelBadge'
import { TaskPriorityBadge } from '../../components/task/TaskPriorityBadge'
import { TaskStatusBadge } from '../../components/task/TaskStatusBadge'
import type { ProgressReport, Project, Risk, Task } from '../../types'
import { formatDateTime, formatEnumLabel, formatNullable, getErrorMessage } from './formatters'

export function ProjectResultsTable({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return <EmptyState label="projects" />
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[1040px] table-fixed text-left text-sm">
        <colgroup>
          <col className="w-[260px]" />
          <col className="w-[130px]" />
          <col className="w-[180px]" />
          <col className="w-[180px]" />
          <col className="w-[110px]" />
          <col className="w-[110px]" />
        </colgroup>
        <thead className="bg-ci-blue-950 text-xs text-white">
          <tr>
            {['Project', 'Status', 'Location', 'Client', 'Start Date', 'End Date'].map(
              (column) => (
                <th className="whitespace-nowrap px-4 py-3" key={column}>
                  {column}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {projects.map((project) => (
            <tr className="hover:bg-blue-50" key={project.id}>
              <td className="px-4 py-3 font-medium text-ci-blue-900">
                <Link
                  className="block truncate hover:text-ci-blue-950 hover:underline"
                  title={project.name}
                  to={`/projects/${project.id}`}
                >
                  {project.name}
                </Link>
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <ProjectStatusBadge status={project.status} />
              </td>
              <td className="truncate px-4 py-3" title={formatNullable(project.location)}>
                {formatNullable(project.location)}
              </td>
              <td
                className="truncate px-4 py-3"
                title={formatNullable(project.clientName)}
              >
                {formatNullable(project.clientName)}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                {formatNullable(project.startDate)}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                {formatNullable(project.endDate)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function DocumentProjectResultsTable({
  projects,
}: {
  projects: Project[]
}) {
  if (projects.length === 0) {
    return <EmptyState label="projects" />
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[900px] table-fixed text-left text-sm">
        <colgroup>
          <col className="w-[280px]" />
          <col className="w-[140px]" />
          <col className="w-[180px]" />
          <col className="w-[180px]" />
          <col className="w-[140px]" />
        </colgroup>
        <thead className="bg-ci-blue-950 text-xs text-white">
          <tr>
            {['Project', 'Status', 'Location', 'Client', 'Documents'].map(
              (column) => (
                <th className="whitespace-nowrap px-4 py-3" key={column}>
                  {column}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {projects.map((project) => (
            <tr className="hover:bg-blue-50" key={project.id}>
              <td className="px-4 py-3 font-medium text-ci-blue-900">
                <Link
                  className="block truncate hover:text-ci-blue-950 hover:underline"
                  title={project.name}
                  to={`/projects/${project.id}?tab=documents`}
                >
                  {project.name}
                </Link>
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <ProjectStatusBadge status={project.status} />
              </td>
              <td className="truncate px-4 py-3" title={formatNullable(project.location)}>
                {formatNullable(project.location)}
              </td>
              <td
                className="truncate px-4 py-3"
                title={formatNullable(project.clientName)}
              >
                {formatNullable(project.clientName)}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <Link
                  className="font-medium text-ci-blue-800 hover:text-ci-blue-950 hover:underline"
                  to={`/projects/${project.id}?tab=documents`}
                >
                  Open
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function TaskResultsTable({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) {
    return <EmptyState label="tasks" />
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[1120px] table-fixed text-left text-sm">
        <colgroup>
          <col className="w-[240px]" />
          <col className="w-[230px]" />
          <col className="w-[130px]" />
          <col className="w-[120px]" />
          <col className="w-[140px]" />
          <col className="w-[120px]" />
          <col className="w-[140px]" />
        </colgroup>
        <thead className="bg-ci-blue-950 text-xs text-white">
          <tr>
            {[
              'Task',
              'Project',
              'Status',
              'Priority',
              'Assignee',
              'Due Date',
              'Created At',
            ].map((column) => (
              <th className="whitespace-nowrap px-4 py-3" key={column}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {tasks.map((task) => (
            <tr className="hover:bg-blue-50" key={task.id}>
              <td className="px-4 py-3 font-medium text-gray-900">
                <span className="block truncate" title={task.title}>
                  {task.title}
                </span>
              </td>
              <td className="px-4 py-3 font-medium text-ci-blue-900">
                <Link
                  className="block truncate hover:text-ci-blue-950 hover:underline"
                  title={task.projectName}
                  to={`/projects/${task.projectId}?tab=tasks`}
                >
                  {task.projectName}
                </Link>
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <TaskStatusBadge status={task.status} />
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <TaskPriorityBadge priority={task.priority} />
              </td>
              <td className="truncate px-4 py-3" title={formatNullable(task.assignee)}>
                {formatNullable(task.assignee)}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                {formatNullable(task.dueDate)}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                {formatDateTime(task.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function RiskResultsTable({ risks }: { risks: Risk[] }) {
  if (risks.length === 0) {
    return <EmptyState label="risks" />
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[1180px] table-fixed text-left text-sm">
        <colgroup>
          <col className="w-[240px]" />
          <col className="w-[220px]" />
          <col className="w-[130px]" />
          <col className="w-[120px]" />
          <col className="w-[120px]" />
          <col className="w-[90px]" />
          <col className="w-[130px]" />
          <col className="w-[130px]" />
        </colgroup>
        <thead className="bg-ci-blue-950 text-xs text-white">
          <tr>
            {[
              'Risk',
              'Project',
              'Category',
              'Status',
              'Risk Level',
              'Severity',
              'Owner',
              'Target Date',
            ].map((column) => (
              <th className="whitespace-nowrap px-4 py-3" key={column}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {risks.map((risk) => (
            <tr className="hover:bg-blue-50" key={risk.id}>
              <td className="px-4 py-3 font-medium text-gray-900">
                <span className="block truncate" title={risk.title}>
                  {risk.title}
                </span>
              </td>
              <td className="px-4 py-3 font-medium text-ci-blue-900">
                <Link
                  className="block truncate hover:text-ci-blue-950 hover:underline"
                  title={risk.projectName}
                  to={`/projects/${risk.projectId}?tab=risks`}
                >
                  {risk.projectName}
                </Link>
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                {formatEnumLabel(risk.category)}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                {formatEnumLabel(risk.status)}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <RiskLevelBadge level={risk.riskLevel} />
              </td>
              <td className="whitespace-nowrap px-4 py-3 font-semibold">
                {risk.severity}
              </td>
              <td className="truncate px-4 py-3" title={formatNullable(risk.owner)}>
                {formatNullable(risk.owner)}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                {formatNullable(risk.targetDate)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function ReportResultsTable({ reports }: { reports: ProgressReport[] }) {
  if (reports.length === 0) {
    return <EmptyState label="progress reports" />
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[1040px] table-fixed text-left text-sm">
        <colgroup>
          <col className="w-[140px]" />
          <col className="w-[280px]" />
          <col className="w-[220px]" />
          <col className="w-[160px]" />
          <col className="w-[160px]" />
        </colgroup>
        <thead className="bg-ci-blue-950 text-xs text-white">
          <tr>
            {['Report Date', 'Summary', 'Project', 'Created By', 'Created At'].map(
              (column) => (
                <th className="whitespace-nowrap px-4 py-3" key={column}>
                  {column}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {reports.map((report) => (
            <tr className="hover:bg-blue-50" key={report.id}>
              <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">
                {report.reportDate}
              </td>
              <td className="px-4 py-3">
                <span className="block truncate" title={report.summary}>
                  {report.summary}
                </span>
              </td>
              <td className="px-4 py-3 font-medium text-ci-blue-900">
                <Link
                  className="block truncate hover:text-ci-blue-950 hover:underline"
                  title={report.projectName}
                  to={`/projects/${report.projectId}?tab=progressReports`}
                >
                  {report.projectName}
                </Link>
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                {report.createdByName}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                {formatDateTime(report.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function TableLoadingState() {
  return (
    <div className="space-y-2 p-4">
      {Array.from({ length: 5 }, (_, index) => (
        <div className="h-10 animate-pulse bg-gray-100" key={index} />
      ))}
    </div>
  )
}

export function TableErrorState({
  error,
  label,
}: {
  error: unknown
  label: string
}) {
  return (
    <div className="border-t border-red-200 bg-red-50 p-4 text-sm text-ci-red-700">
      <div className="font-semibold">Unable to load {label}.</div>
      <div className="mt-1">{getErrorMessage(error)}</div>
    </div>
  )
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="border-t border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
      No {label} match the current criteria.
    </div>
  )
}
