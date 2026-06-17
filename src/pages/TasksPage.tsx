import { TaskPriorityBadge } from '../components/task/TaskPriorityBadge'
import { PageHeader } from '../components/ui/PageHeader'
import { SectionCard } from '../components/ui/SectionCard'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { TaskPriority } from '../types'

const tasks: Array<[string, string, TaskPriority, string, string]> = [
  [
    'Foundation acceptance file review',
    'Harbour Tower Phase 1',
    TaskPriority.HIGH,
    'Jane Builder',
    '2026-07-15',
  ],
  [
    'MEP reserved opening inspection',
    'East Utility Tunnel',
    TaskPriority.MEDIUM,
    'Site Engineer',
    '2026-07-20',
  ],
  [
    'Steel supply plan confirmation',
    'Harbour Tower Phase 1',
    TaskPriority.CRITICAL,
    'Procurement Manager',
    '2026-07-10',
  ],
]

export function TasksPage() {
  useDocumentTitle('Task Supervision')

  return (
    <>
      <PageHeader
        title="Task Supervision"
        description="Track task status, priority, assignee, and due dates"
        action="New Task"
      />
      <div className="p-5">
        <SectionCard title="Task List">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-ci-blue-950 text-xs text-white">
                <tr>
                  {['Task', 'Project', 'Priority', 'Assignee', 'Due Date'].map((column) => (
                    <th key={column} className="px-4 py-3">{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tasks.map(([title, project, priority, assignee, dueDate]) => (
                  <tr key={title} className="hover:bg-blue-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{title}</td>
                    <td className="px-4 py-3">{project}</td>
                    <td className="px-4 py-3"><TaskPriorityBadge priority={priority} /></td>
                    <td className="px-4 py-3">{assignee}</td>
                    <td className="px-4 py-3">{dueDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>
    </>
  )
}
