import type { ProjectRegistration } from '../../types'

interface ProjectMemberTableProps {
  deletingRegistrationId: number | null
  members: ProjectRegistration[]
  onDelete: (member: ProjectRegistration) => void
}

export function ProjectMemberTable({
  deletingRegistrationId,
  members,
  onDelete,
}: ProjectMemberTableProps) {
  if (members.length === 0) {
    return (
      <div className="border-t border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
        No project members have been registered.
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[1100px] table-fixed text-left text-sm">
        <colgroup>
          <col className="w-[170px]" />
          <col className="w-[230px]" />
          <col className="w-[160px]" />
          <col className="w-[260px]" />
          <col className="w-[110px]" />
          <col className="w-[170px]" />
          <col className="w-[100px]" />
        </colgroup>
        <thead className="bg-ci-blue-950 text-xs text-white">
          <tr>
            {[
              'User Name',
              'User Email',
              'Title',
              'Description',
              'Role',
              'Created At',
              'Actions',
            ].map((column) => (
              <th className="whitespace-nowrap px-4 py-3" key={column}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {members.map((member) => (
            <tr className="hover:bg-blue-50" key={member.id}>
              <td className="px-4 py-3 font-medium text-gray-900">
                <span className="block truncate" title={member.userName}>
                  {member.userName}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-700">
                <span className="block truncate" title={member.userEmail}>
                  {member.userEmail}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-700">
                <span className="block truncate" title={member.title ?? '-'}>
                  {member.title ?? '-'}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-700">
                <span
                  className="block truncate"
                  title={member.description ?? '-'}
                >
                  {member.description ?? '-'}
                </span>
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <span className="inline-flex rounded-sm border border-ci-blue-800 px-2 py-0.5 text-xs font-medium text-ci-blue-900">
                  {formatMemberRole(member.role)}
                </span>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                {member.createdAt}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <button
                  className="font-medium text-ci-red-700 hover:text-red-900 disabled:cursor-not-allowed disabled:text-gray-400"
                  disabled={deletingRegistrationId === member.id}
                  onClick={() => onDelete(member)}
                  type="button"
                >
                  {deletingRegistrationId === member.id ? 'Deleting...' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function formatMemberRole(value: string): string {
  return value
    .split('_')
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(' ')
}
