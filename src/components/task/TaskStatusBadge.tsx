import { TaskStatus } from '../../types'

const labelMap: Record<TaskStatus, string> = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  BLOCKED: 'Blocked',
  DONE: 'Done',
}

const classMap: Record<TaskStatus, string> = {
  TODO: 'border-gray-300 text-gray-700',
  IN_PROGRESS: 'border-ci-blue-800 text-ci-blue-900',
  BLOCKED: 'border-ci-red-700 bg-red-50 text-ci-red-700',
  DONE: 'border-green-700 bg-green-50 text-green-700',
}

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span
      className={`inline-flex rounded-sm border px-2 py-0.5 text-xs font-medium ${classMap[status]}`}
    >
      {labelMap[status]}
    </span>
  )
}
