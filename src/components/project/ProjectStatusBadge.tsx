import type { ProjectStatus } from '../../types'

const labelMap: Record<ProjectStatus, string> = {
  PLANNING: 'Planning',
  ACTIVE: 'Active',
  ON_HOLD: 'On Hold',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
}

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span className="inline-flex rounded-sm border border-ci-blue-800 px-2 py-0.5 text-xs font-medium text-ci-blue-900">
      {labelMap[status]}
    </span>
  )
}
