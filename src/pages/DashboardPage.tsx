import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { getDashboardStatistics } from '../api/dashboardApi'
import { MetricCard } from '../components/ui/MetricCard'
import { PageHeader } from '../components/ui/PageHeader'
import { SectionCard } from '../components/ui/SectionCard'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import type { DashboardStatistics, ErrorResponse } from '../types'

const statisticGroups = [
  {
    title: 'Project Portfolio',
    items: [
      ['totalProjects', 'Total Projects'],
      ['activeProjects', 'Active Projects'],
      ['completedProjects', 'Completed Projects'],
    ],
  },
  {
    title: 'Task Execution',
    items: [
      ['totalTasks', 'Total Tasks'],
      ['openTasks', 'Open Tasks'],
      ['completedTasks', 'Completed Tasks'],
      ['overdueTasks', 'Overdue Tasks'],
    ],
  },
  {
    title: 'Risk Control',
    items: [
      ['totalRisks', 'Total Risks'],
      ['openRisks', 'Open Risks'],
      ['highRisks', 'High Risks'],
      ['criticalRisks', 'Critical Risks'],
    ],
  },
  {
    title: 'Records',
    items: [
      ['progressReports', 'Progress Reports'],
      ['documents', 'Documents'],
    ],
  },
] satisfies Array<{
  title: string
  items: Array<[keyof DashboardStatistics, string]>
}>

const cardDetails: Partial<Record<keyof DashboardStatistics, string>> = {
  totalProjects: 'Accessible project count',
  activeProjects: 'Projects currently active',
  completedProjects: 'Projects marked completed',
  totalTasks: 'Tasks across accessible projects',
  openTasks: 'Tasks not yet done',
  completedTasks: 'Tasks marked done',
  overdueTasks: 'Past due and not done',
  totalRisks: 'Registered project risks',
  openRisks: 'Risks not yet closed',
  highRisks: 'Risks at high level',
  criticalRisks: 'Risks at critical level',
  progressReports: 'Submitted progress reports',
  documents: 'Archived project documents',
}

export function DashboardPage() {
  useDocumentTitle('Executive Dashboard')

  const {
    data: statistics,
    error,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['dashboard', 'statistics'],
    queryFn: getDashboardStatistics,
  })

  return (
    <>
      <PageHeader
        eyebrow="CONSTRUCTIQ"
        title="Executive Dashboard"
        description="Live portfolio statistics from the ConstructIQ backend"
      />
      <div className="space-y-5 p-5">
        {isLoading ? <DashboardLoadingState /> : null}
        {isError ? <DashboardErrorState error={error} /> : null}
        {statistics ? <DashboardStatisticsView statistics={statistics} /> : null}
      </div>
    </>
  )
}

function DashboardStatisticsView({
  statistics,
}: {
  statistics: DashboardStatistics
}) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statisticGroups.flatMap((group) =>
          group.items.map(([key, label]) => (
            <MetricCard
              accent={getMetricAccent(key)}
              detail={cardDetails[key] ?? 'Dashboard statistic'}
              key={key}
              label={label}
              value={String(statistics[key])}
            />
          )),
        )}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionCard title="Statistics Summary">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-ci-blue-950 text-xs font-semibold text-white">
                <tr>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Metric</th>
                  <th className="px-4 py-3">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {statisticGroups.flatMap((group) =>
                  group.items.map(([key, label]) => (
                    <tr className="hover:bg-blue-50" key={key}>
                      <td className="px-4 py-3 text-gray-600">{group.title}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {label}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {statistics[key]}
                      </td>
                    </tr>
                  )),
                )}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard title="Snapshot Context">
          <dl className="space-y-3 p-4 text-sm">
            <div className="border-l-4 border-ci-blue-800 bg-blue-50 px-3 py-2">
              <dt className="font-semibold text-gray-900">User</dt>
              <dd className="text-gray-600">{statistics.userName}</dd>
            </div>
            <div className="border-l-4 border-ci-gold-500 bg-yellow-50 px-3 py-2">
              <dt className="font-semibold text-gray-900">Generated At</dt>
              <dd className="text-gray-600">{statistics.generatedAt}</dd>
            </div>
            <div className="border-l-4 border-ci-blue-800 bg-blue-50 px-3 py-2">
              <dt className="font-semibold text-gray-900">Snapshot ID</dt>
              <dd className="text-gray-600">
                {statistics.snapshotId ?? 'Live statistics'}
              </dd>
            </div>
          </dl>
        </SectionCard>
      </div>
    </>
  )
}

function DashboardLoadingState() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 8 }, (_, index) => (
        <div
          className="h-28 animate-pulse border border-l-4 border-l-ci-blue-800 border-gray-200 bg-white p-4"
          key={index}
        >
          <div className="h-3 w-24 bg-gray-200" />
          <div className="mt-4 h-8 w-16 bg-gray-200" />
          <div className="mt-4 h-3 w-32 bg-gray-200" />
        </div>
      ))}
    </div>
  )
}

function DashboardErrorState({ error }: { error: unknown }) {
  return (
    <div className="border border-red-200 bg-red-50 p-4 text-sm text-ci-red-700">
      <div className="font-semibold">Unable to load dashboard statistics.</div>
      <div className="mt-1">{getErrorMessage(error)}</div>
    </div>
  )
}

function getMetricAccent(
  key: keyof DashboardStatistics,
): 'blue' | 'red' | 'gold' {
  if (
    key === 'overdueTasks' ||
    key === 'highRisks' ||
    key === 'criticalRisks'
  ) {
    return 'red'
  }

  if (key === 'openTasks' || key === 'openRisks') {
    return 'gold'
  }

  return 'blue'
}

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError<ErrorResponse>(error)) {
    return error.response?.data.message ?? error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Please verify the backend service is running and try again.'
}
