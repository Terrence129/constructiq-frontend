import axios from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  createDashboardStatisticsSnapshot,
  getDashboardStatistics,
  getLatestDashboardStatisticsSnapshot,
} from '../api/dashboardApi'
import { MetricCard } from '../components/ui/MetricCard'
import { PageHeader } from '../components/ui/PageHeader'
import { SectionCard } from '../components/ui/SectionCard'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import type { DashboardStatistics, ErrorResponse } from '../types'
import {
  getDashboardMetricPath,
  type DashboardMetricKey,
} from './dashboardMetricDetails/metricConfig'

const statisticGroups = [
  {
    title: 'Projects',
    description: 'Portfolio scale and project status',
    items: [
      ['totalProjects', 'Total Projects'],
      ['activeProjects', 'Active Projects'],
      ['completedProjects', 'Completed Projects'],
    ],
  },
  {
    title: 'Tasks',
    description: 'Delivery workload and overdue work',
    items: [
      ['totalTasks', 'Total Tasks'],
      ['openTasks', 'Open Tasks'],
      ['completedTasks', 'Completed Tasks'],
      ['overdueTasks', 'Overdue Tasks'],
    ],
  },
  {
    title: 'Risks',
    description: 'Exposure, status, and severity',
    items: [
      ['totalRisks', 'Total Risks'],
      ['openRisks', 'Open Risks'],
      ['highRisks', 'High Risks'],
      ['criticalRisks', 'Critical Risks'],
    ],
  },
  {
    title: 'Reports',
    description: 'Progress reporting and document records',
    items: [
      ['progressReports', 'Progress Reports'],
      ['documents', 'Documents'],
    ],
  },
] satisfies Array<{
  title: string
  description: string
  items: Array<[DashboardMetricKey, string]>
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
  const queryClient = useQueryClient()

  const {
    data: statistics,
    error,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['dashboard', 'statistics'],
    queryFn: getDashboardStatistics,
  })

  const {
    data: latestSnapshot,
    error: latestSnapshotError,
    isError: isLatestSnapshotError,
    isFetching: isLatestSnapshotFetching,
  } = useQuery({
    queryKey: ['dashboard', 'statistics', 'snapshots', 'latest'],
    queryFn: getLatestDashboardStatisticsSnapshot,
    retry: false,
  })

  const createSnapshotMutation = useMutation({
    mutationFn: createDashboardStatisticsSnapshot,
    onSuccess: (snapshot) => {
      queryClient.setQueryData(
        ['dashboard', 'statistics', 'snapshots', 'latest'],
        snapshot,
      )
    },
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
        {statistics ? (
          <DashboardStatisticsView
            createSnapshotError={createSnapshotMutation.error}
            isCreatingSnapshot={createSnapshotMutation.isPending}
            isLatestSnapshotError={isLatestSnapshotError}
            isLatestSnapshotFetching={isLatestSnapshotFetching}
            latestSnapshot={latestSnapshot}
            latestSnapshotError={latestSnapshotError}
            onCreateSnapshot={() => createSnapshotMutation.mutate()}
            statistics={statistics}
          />
        ) : null}
      </div>
    </>
  )
}

function DashboardStatisticsView({
  createSnapshotError,
  isCreatingSnapshot,
  isLatestSnapshotError,
  isLatestSnapshotFetching,
  latestSnapshot,
  latestSnapshotError,
  onCreateSnapshot,
  statistics,
}: {
  createSnapshotError: unknown
  isCreatingSnapshot: boolean
  isLatestSnapshotError: boolean
  isLatestSnapshotFetching: boolean
  latestSnapshot: DashboardStatistics | undefined
  latestSnapshotError: unknown
  onCreateSnapshot: () => void
  statistics: DashboardStatistics
}) {
  return (
    <>
      <DashboardMetricGroups statistics={statistics} />

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

        <SnapshotControls
          createSnapshotError={createSnapshotError}
          isCreatingSnapshot={isCreatingSnapshot}
          isLatestSnapshotError={isLatestSnapshotError}
          isLatestSnapshotFetching={isLatestSnapshotFetching}
          latestSnapshot={latestSnapshot}
          latestSnapshotError={latestSnapshotError}
          liveStatistics={statistics}
          onCreateSnapshot={onCreateSnapshot}
        />
      </div>
    </>
  )
}

function DashboardMetricGroups({
  statistics,
}: {
  statistics: DashboardStatistics
}) {
  return (
    <div className="space-y-4">
      {statisticGroups.map((group) => (
        <section className="border border-gray-200 bg-gray-50" key={group.title}>
          <div className="flex flex-col gap-1 border-b border-gray-200 bg-white px-4 py-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-950">
                {group.title}
              </h2>
              <p className="text-xs text-gray-500">{group.description}</p>
            </div>
            <div className="text-xs font-medium text-gray-500">
              {group.items.length} metrics
            </div>
          </div>
          <div
            className={`grid gap-4 p-4 ${getMetricGroupGridClass(group.items.length)}`}
          >
            {group.items.map(([key, label]) => (
              <Link
                aria-label={`View ${label}`}
                className="block outline-none transition hover:-translate-y-0.5 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-ci-blue-800 focus-visible:ring-offset-2"
                key={key}
                to={getDashboardMetricPath(key)}
              >
                <MetricCard
                  accent={getMetricAccent(key)}
                  detail={cardDetails[key] ?? 'Dashboard statistic'}
                  label={label}
                  value={String(statistics[key])}
                />
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

function SnapshotControls({
  createSnapshotError,
  isCreatingSnapshot,
  isLatestSnapshotError,
  isLatestSnapshotFetching,
  latestSnapshot,
  latestSnapshotError,
  liveStatistics,
  onCreateSnapshot,
}: {
  createSnapshotError: unknown
  isCreatingSnapshot: boolean
  isLatestSnapshotError: boolean
  isLatestSnapshotFetching: boolean
  latestSnapshot: DashboardStatistics | undefined
  latestSnapshotError: unknown
  liveStatistics: DashboardStatistics
  onCreateSnapshot: () => void
}) {
  const latestSnapshotNotFound =
    axios.isAxiosError<ErrorResponse>(latestSnapshotError) &&
    latestSnapshotError.response?.status === 404

  return (
    <SectionCard
      title="Statistics Snapshots"
      toolbar={
        <button
          className="h-8 bg-ci-blue-800 px-3 text-xs font-semibold text-white hover:bg-ci-blue-900 disabled:cursor-not-allowed disabled:bg-gray-400"
          disabled={isCreatingSnapshot}
          onClick={onCreateSnapshot}
          type="button"
        >
          {isCreatingSnapshot ? 'Saving...' : 'Save Current Snapshot'}
        </button>
      }
    >
      <div className="space-y-4 p-4">
        {createSnapshotError ? (
          <div className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-ci-red-700">
            {getErrorMessage(createSnapshotError)}
          </div>
        ) : null}

        <dl className="space-y-3 text-sm">
          <div className="border-l-4 border-ci-blue-800 bg-blue-50 px-3 py-2">
            <dt className="font-semibold text-gray-900">Live User</dt>
            <dd className="text-gray-600">{liveStatistics.userName}</dd>
          </div>
          <div className="border-l-4 border-ci-gold-500 bg-yellow-50 px-3 py-2">
            <dt className="font-semibold text-gray-900">Live Generated At</dt>
            <dd className="text-gray-600">{liveStatistics.generatedAt}</dd>
          </div>
        </dl>

        <div className="border-t border-gray-200 pt-4">
          <div className="mb-3 text-sm font-semibold text-gray-900">
            Latest Saved Snapshot
          </div>
          {isLatestSnapshotFetching ? (
            <div className="text-sm text-gray-500">Loading latest snapshot...</div>
          ) : null}
          {isLatestSnapshotError && latestSnapshotNotFound ? (
            <div className="border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600">
              No saved dashboard snapshot exists yet.
            </div>
          ) : null}
          {isLatestSnapshotError && !latestSnapshotNotFound ? (
            <div className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-ci-red-700">
              {getErrorMessage(latestSnapshotError)}
            </div>
          ) : null}
          {latestSnapshot ? (
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <SnapshotField
                label="Snapshot ID"
                value={latestSnapshot.snapshotId ?? 'Live statistics'}
              />
              <SnapshotField label="Generated At" value={latestSnapshot.generatedAt} />
              <SnapshotField label="Total Projects" value={latestSnapshot.totalProjects} />
              <SnapshotField label="Overdue Tasks" value={latestSnapshot.overdueTasks} />
              <SnapshotField label="High Risks" value={latestSnapshot.highRisks} />
              <SnapshotField
                label="Critical Risks"
                value={latestSnapshot.criticalRisks}
              />
            </dl>
          ) : null}
        </div>
      </div>
    </SectionCard>
  )
}

function SnapshotField({
  label,
  value,
}: {
  label: string
  value: number | string
}) {
  return (
    <div className="border border-gray-200 bg-white px-3 py-2">
      <dt className="text-xs font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 font-semibold text-gray-900">{value}</dd>
    </div>
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

function getMetricGroupGridClass(itemCount: number) {
  if (itemCount >= 4) {
    return 'sm:grid-cols-2 xl:grid-cols-4'
  }

  if (itemCount === 3) {
    return 'sm:grid-cols-3'
  }

  return 'sm:grid-cols-2'
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
