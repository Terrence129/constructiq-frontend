import type { Risk } from '../../types'
import { RiskLevelBadge } from './RiskLevelBadge'

interface RiskTableProps {
  deletingRiskId: number | null
  onDelete: (risk: Risk) => void
  onEdit: (risk: Risk) => void
  risks: Risk[]
}

export function RiskTable({
  deletingRiskId,
  onDelete,
  onEdit,
  risks,
}: RiskTableProps) {
  if (risks.length === 0) {
    return (
      <div className="border-t border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
        No risks have been registered for this project.
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[1280px] table-fixed text-left text-sm">
        <colgroup>
          <col className="w-[240px]" />
          <col className="w-[130px]" />
          <col className="w-[100px]" />
          <col className="w-[90px]" />
          <col className="w-[90px]" />
          <col className="w-[90px]" />
          <col className="w-[120px]" />
          <col className="w-[120px]" />
          <col className="w-[150px]" />
          <col className="w-[130px]" />
        </colgroup>
        <thead className="bg-ci-blue-950 text-xs text-white">
          <tr>
            {[
              'Title',
              'Category',
              'Status',
              'Probability',
              'Impact',
              'Severity',
              'Risk Level',
              'Owner',
              'Target Date',
              'Actions',
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
              <td className="whitespace-nowrap px-4 py-3">
                {formatEnumLabel(risk.category)}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                {formatEnumLabel(risk.status)}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                {risk.probability}
              </td>
              <td className="whitespace-nowrap px-4 py-3">{risk.impact}</td>
              <td className="whitespace-nowrap px-4 py-3 font-semibold">
                {risk.severity}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <RiskLevelBadge level={risk.riskLevel} />
              </td>
              <td className="px-4 py-3">
                <span className="block truncate" title={formatNullable(risk.owner)}>
                  {formatNullable(risk.owner)}
                </span>
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                {formatNullable(risk.targetDate)}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <div className="flex gap-2">
                  <button
                    className="font-medium text-ci-blue-800 hover:text-ci-blue-950"
                    onClick={() => onEdit(risk)}
                    type="button"
                  >
                    Edit
                  </button>
                  <button
                    className="font-medium text-ci-red-700 hover:text-red-900 disabled:cursor-not-allowed disabled:text-gray-400"
                    disabled={deletingRiskId === risk.id}
                    onClick={() => onDelete(risk)}
                    type="button"
                  >
                    {deletingRiskId === risk.id ? 'Deleting...' : 'Delete'}
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

function formatEnumLabel(value: string): string {
  return value
    .split('_')
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(' ')
}
