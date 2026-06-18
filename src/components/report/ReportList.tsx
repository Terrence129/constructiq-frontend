import type { ProgressReport } from '../../types'
import dayjs from "dayjs";

interface ReportListProps {
  deletingReportId: number | null
  onDelete: (report: ProgressReport) => void
  onEdit: (report: ProgressReport) => void
  onSelect: (report: ProgressReport) => void
  reports: ProgressReport[]
  selectedReportId: number | null
}

export function ReportList({
  deletingReportId,
  onDelete,
  onEdit,
  onSelect,
  reports,
  selectedReportId,
}: ReportListProps) {
  if (reports.length === 0) {
    return (
      <div className="border-t border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
        No progress reports have been submitted for this project.
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[1040px] table-fixed text-left text-sm">
        <colgroup>
          <col className="w-[140px]" />
          <col className="w-[300px]" />
          <col className="w-[180px]" />
          <col className="w-[160px]" />
          <col className="w-[140px]" />
        </colgroup>
        <thead className="bg-ci-blue-950 text-xs text-white">
          <tr>
            {['Report Date', 'Summary', 'Created By', 'Created At', 'Actions'].map(
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
            <tr
              className={
                selectedReportId === report.id ? 'bg-blue-50' : 'hover:bg-blue-50'
              }
              key={report.id}
            >
              <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">
                {report.reportDate}
              </td>
              <td className="px-4 py-3">
                <button
                  className="block max-w-full truncate text-left font-medium text-ci-blue-800 hover:text-ci-blue-950 hover:underline"
                  onClick={() => onSelect(report)}
                  title={report.summary}
                  type="button"
                >
                  {report.summary}
                </button>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                {report.createdByName}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                {dayjs(report.createdAt)
                    .format("YYYY-MM-DD HH:mm")}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <div className="flex gap-2">
                  <button
                    className="font-medium text-ci-blue-800 hover:text-ci-blue-950"
                    onClick={() => onSelect(report)}
                    type="button"
                  >
                    View
                  </button>
                  <button
                    className="font-medium text-ci-blue-800 hover:text-ci-blue-950"
                    onClick={() => onEdit(report)}
                    type="button"
                  >
                    Edit
                  </button>
                  <button
                    className="font-medium text-ci-red-700 hover:text-red-900 disabled:cursor-not-allowed disabled:text-gray-400"
                    disabled={deletingReportId === report.id}
                    onClick={() => onDelete(report)}
                    type="button"
                  >
                    {deletingReportId === report.id ? 'Deleting...' : 'Delete'}
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
