import { Link, useParams } from 'react-router-dom'
import { PageHeader } from '../components/ui/PageHeader'
import { SectionCard } from '../components/ui/SectionCard'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import {
  DocumentProjectMetricList,
  ProjectMetricList,
  ReportMetricList,
  RiskMetricList,
  TaskMetricList,
} from './dashboardMetricDetails/MetricLists'
import { getDashboardMetricDetail } from './dashboardMetricDetails/metricConfig'

export function DashboardMetricDetailPage() {
  const { metricKey } = useParams()
  const metric = getDashboardMetricDetail(metricKey)

  useDocumentTitle(metric?.title ?? 'Dashboard Details')

  if (!metric) {
    return (
      <>
        <PageHeader
          title="Dashboard Details"
          description="The requested dashboard metric could not be found"
        />
        <div className="p-5">
          <SectionCard title="Metric Not Found">
            <div className="p-4 text-sm text-gray-600">
              <Link className="font-medium text-ci-blue-800" to="/dashboard">
                Back to Executive Dashboard
              </Link>
            </div>
          </SectionCard>
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader title={metric.title} description={metric.description} />
      <div className="space-y-4 p-5">
        <div className="border border-gray-200 bg-white px-4 py-3">
          <Link className="text-sm font-medium text-ci-blue-800" to="/dashboard">
            Back to Executive Dashboard
          </Link>
        </div>
        {metric.resource === 'projects' ? (
          <ProjectMetricList initialStatus={metric.projectStatus ?? 'ALL'} />
        ) : metric.resource === 'tasks' ? (
          <TaskMetricList
            initialDueFilter={metric.taskDueFilter ?? 'ALL'}
            initialStatusFilter={metric.taskStatusFilter ?? 'ALL'}
          />
        ) : metric.resource === 'risks' ? (
          <RiskMetricList
            initialLevelFilter={metric.riskLevel ?? 'ALL'}
            initialStatusFilter={metric.riskStatusFilter ?? 'ALL'}
          />
        ) : metric.resource === 'reports' ? (
          <ReportMetricList />
        ) : (
          <DocumentProjectMetricList />
        )}
      </div>
    </>
  )
}
