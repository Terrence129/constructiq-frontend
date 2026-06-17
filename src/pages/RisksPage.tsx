import { RiskLevelBadge } from '../components/risk/RiskLevelBadge'
import { PageHeader } from '../components/ui/PageHeader'
import { SectionCard } from '../components/ui/SectionCard'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import type { RiskLevel } from '../types'

const risks: Array<[string, string, string, string, RiskLevel]> = [
  ['Steel delivery delay', 'Schedule', '4', '5', 'CRITICAL'],
  ['Edge protection reinspection', 'Safety', '3', '4', 'HIGH'],
  ['Drawing change confirmation', 'Design', '2', '3', 'MEDIUM'],
]

export function RisksPage() {
  useDocumentTitle('Risk Control')

  return (
    <>
      <PageHeader
        title="Risk Control"
        description="Risk level is calculated from probability and impact by the backend"
        action="Register Risk"
      />
      <div className="grid gap-5 p-5 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionCard title="Risk Register">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-ci-blue-950 text-xs text-white">
                <tr>
                  {['Risk Item', 'Category', 'Probability', 'Impact', 'Level'].map((column) => (
                    <th key={column} className="px-4 py-3">{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {risks.map(([title, category, probability, impact, level]) => (
                  <tr key={title} className="hover:bg-blue-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{title}</td>
                    <td className="px-4 py-3">{category}</td>
                    <td className="px-4 py-3">{probability}</td>
                    <td className="px-4 py-3">{impact}</td>
                    <td className="px-4 py-3"><RiskLevelBadge level={level} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
        <SectionCard title="Risk Matrix">
          <div className="grid grid-cols-5 gap-1 p-4">
            {Array.from({ length: 25 }, (_, index) => {
              const value = 25 - index
              const color =
                value >= 16
                  ? 'bg-red-100 text-ci-red-700'
                  : value >= 11
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-blue-50 text-ci-blue-900'

              return (
                <div
                  className={`flex aspect-square items-center justify-center border border-white text-xs font-semibold ${color}`}
                  key={value}
                >
                  {value}
                </div>
              )
            })}
          </div>
        </SectionCard>
      </div>
    </>
  )
}
