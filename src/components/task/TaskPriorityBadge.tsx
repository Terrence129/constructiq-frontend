import { TaskPriority } from '../../types'

const labelMap: Record<TaskPriority, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical',
}

export function TaskPriorityBadge({ priority }: { priority: TaskPriority }) {
  const isCritical =
    priority === TaskPriority.CRITICAL || priority === TaskPriority.HIGH

  return (
    <span
      className={`inline-flex rounded-sm border px-2 py-0.5 text-xs font-medium ${
        isCritical
          ? 'border-ci-red-700 text-ci-red-700'
          : 'border-gray-300 text-gray-700'
      }`}
    >
      {labelMap[priority]}
    </span>
  )
}
