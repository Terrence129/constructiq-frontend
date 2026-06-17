import { DataTable } from '../components/ui/DataTable'
import { MetricCard } from '../components/ui/MetricCard'
import { PageHeader } from '../components/ui/PageHeader'
import { SectionCard } from '../components/ui/SectionCard'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

const recentReports = [
  ['2026-06-17', 'Harbour Tower Phase 1', 'Weekly progress reached 78%', 'Project Manager'],
  ['2026-06-16', 'East Utility Tunnel', 'Shield tunnel survey completed', 'Site Engineer'],
  ['2026-06-15', 'Urban Renewal Section B', 'Material arrival inspection pending', 'Quality Lead'],
]

export function DashboardPage() {
  useDocumentTitle('Executive Dashboard')

  return (
    <>
      <PageHeader
        eyebrow="CONSTRUCTIQ"
        title="Executive Dashboard"
        description="Core indicators for projects, tasks, risks, and reports"
      />
      <div className="space-y-5 p-5">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Total Projects" value="18" detail="3 added this month" />
          <MetricCard label="Active Projects" value="11" detail="4 under key supervision" />
          <MetricCard
            accent="red"
            label="High Risks"
            value="7"
            detail="Includes 2 critical risks"
          />
          <MetricCard
            accent="gold"
            label="Overdue Tasks"
            value="5"
            detail="Require closure this week"
          />
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
          <SectionCard title="Recent Progress Reports">
            <DataTable
              columns={['Date', 'Project', 'Summary', 'Submitted By']}
              rows={recentReports}
            />
          </SectionCard>
          <SectionCard title="Supervision Notices">
            <div className="space-y-3 p-4 text-sm text-gray-700">
              <p className="border-l-4 border-ci-red-700 bg-red-50 px-3 py-2">
                Steel delivery delay risk requires a mitigation plan.
              </p>
              <p className="border-l-4 border-ci-gold-500 bg-yellow-50 px-3 py-2">
                Three monthly progress reports must be archived this week.
              </p>
              <p className="border-l-4 border-ci-blue-800 bg-blue-50 px-3 py-2">
                Project member roles will connect to backend authentication later.
              </p>
            </div>
          </SectionCard>
        </div>
      </div>
    </>
  )
}
