import { ReportSummaryList } from '../components/report/ReportSummaryList'
import { PageHeader } from '../components/ui/PageHeader'
import { SectionCard } from '../components/ui/SectionCard'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function ReportsPage() {
  useDocumentTitle('Progress Reports')

  return (
    <>
      <PageHeader
        title="Progress Reports"
        description="Archive weekly reports, monthly reports, and site progress summaries"
        action="Submit Progress"
      />
      <div className="p-5">
        <SectionCard title="Latest Report Summaries">
          <ReportSummaryList />
        </SectionCard>
      </div>
    </>
  )
}
