import type { Task } from '../../types'
import { TaskPriorityBadge } from './TaskPriorityBadge'
import { TaskStatusBadge } from './TaskStatusBadge'

interface TaskTableProps {
  deletingTaskId: number | null
  onDelete: (task: Task) => void
  onEdit: (task: Task) => void
  tasks: Task[]
}

export function TaskTable({
  deletingTaskId,
  onDelete,
  onEdit,
  tasks,
}: TaskTableProps) {
  if (tasks.length === 0) {
    return (
      <div className="border-t border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
        No tasks have been registered for this project.
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[1060px] table-fixed text-left text-sm">
        <colgroup>
          <col className="w-[260px]" />
          <col className="w-[240px]" />
          <col className="w-[130px]" />
          <col className="w-[120px]" />
          <col className="w-[150px]" />
          <col className="w-[120px]" />
          <col className="w-[120px]" />
        </colgroup>
        <thead className="bg-ci-blue-950 text-xs text-white">
          <tr>
            {[
              'Title',
              'Description',
              'Status',
              'Priority',
              'Assignee',
              'Due Date',
              'Actions',
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
              <td className="px-4 py-3 text-gray-700">
                <span
                  className="block truncate"
                  title={formatNullable(task.description)}
                >
                  {formatNullable(task.description)}
                </span>
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <TaskStatusBadge status={task.status} />
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <TaskPriorityBadge priority={task.priority} />
              </td>
              <td className="px-4 py-3 text-gray-700">
                <span
                  className="block truncate"
                  title={formatNullable(task.assignee)}
                >
                  {formatNullable(task.assignee)}
                </span>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                {formatNullable(task.dueDate)}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <div className="flex gap-2">
                  <button
                    className="font-medium text-ci-blue-800 hover:text-ci-blue-950"
                    onClick={() => onEdit(task)}
                    type="button"
                  >
                    Edit
                  </button>
                  <button
                    className="font-medium text-ci-red-700 hover:text-red-900 disabled:cursor-not-allowed disabled:text-gray-400"
                    disabled={deletingTaskId === task.id}
                    onClick={() => onDelete(task)}
                    type="button"
                  >
                    {deletingTaskId === task.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function formatNullable(value: string | null): string {
  return value ?? '-'
}
