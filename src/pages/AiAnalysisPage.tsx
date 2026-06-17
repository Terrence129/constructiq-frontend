import { PageHeader } from '../components/ui/PageHeader'
import { SectionCard } from '../components/ui/SectionCard'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function AiAnalysisPage() {
  useDocumentTitle('AI Analysis')

  return (
    <>
      <PageHeader
        title="AI Analysis"
        description="Foundation screen for AI risk analysis and progress summaries"
        action="Analyze Project Risk"
      />
      <div className="grid gap-5 p-5 xl:grid-cols-3">
        <SectionCard title="Analysis Result">
          <div className="space-y-4 p-4 text-sm text-gray-700 xl:col-span-2">
            <div>
              <span className="font-semibold text-gray-900">Risk Level: </span>
              Not generated
            </div>
            <div>
              <span className="font-semibold text-gray-900">Summary: </span>
              Project risk assessment results will appear after the backend AI
              endpoint is connected.
            </div>
            <div>
              <span className="font-semibold text-gray-900">
                Suggested Actions:{' '}
              </span>
              This screen currently preserves the frontend layout only.
            </div>
          </div>
        </SectionCard>
        <SectionCard title="Analysis Scope">
          <div className="space-y-2 p-4 text-sm text-gray-700">
            <p>Project baseline information</p>
            <p>Recent progress reports</p>
            <p>Existing risk register</p>
          </div>
        </SectionCard>
      </div>
    </>
  )
}
