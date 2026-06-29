import { AiAssistantPanel } from '../components/ai/AiAssistantPanel'
import { PageHeader } from '../components/ui/PageHeader'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function AiAnalysisPage() {
  useDocumentTitle('AI Analysis')

  return (
    <>
      <PageHeader
        title="AI Analysis"
        description="Ask project questions, generate concise advice, and inspect the context used by the AI service"
      />
      <div className="p-5">
        <AiAssistantPanel />
      </div>
    </>
  )
}
