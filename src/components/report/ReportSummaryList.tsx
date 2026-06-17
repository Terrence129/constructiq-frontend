const reports = [
  'Tower foundation acceptance completed',
  'MEP reserved openings under review',
  'Rebar material retest pending return',
]

export function ReportSummaryList() {
  return (
    <ul className="divide-y divide-gray-200">
      {reports.map((report) => (
        <li key={report} className="px-4 py-3 text-sm text-gray-700">
          {report}
        </li>
      ))}
    </ul>
  )
}
