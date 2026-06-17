interface DataTableProps {
  columns: string[]
  rows: string[][]
}

export function DataTable({ columns, rows }: DataTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse text-left text-sm">
        <thead>
          <tr className="bg-ci-blue-950 text-xs font-semibold text-white">
            {columns.map((column) => (
              <th key={column} className="whitespace-nowrap px-4 py-3">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {rows.map((row) => (
            <tr key={row.join('|')} className="hover:bg-blue-50">
              {row.map((cell, index) => (
                <td
                  key={`${cell}-${index}`}
                  className="whitespace-nowrap px-4 py-3 text-gray-700"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
