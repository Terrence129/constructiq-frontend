import { DocumentTypeBadge } from '../components/document/DocumentTypeBadge'
import { PageHeader } from '../components/ui/PageHeader'
import { SectionCard } from '../components/ui/SectionCard'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

const documents = [
  ['site-plan.pdf', 'application/pdf', 'Harbour Tower Phase 1', '204 KB'],
  ['inspection-photo.zip', 'application/zip', 'East Utility Tunnel', '18 MB'],
  ['monthly-report.docx', 'application/docx', 'Urban Renewal Section B', '1.4 MB'],
]

export function DocumentsPage() {
  useDocumentTitle('Document Archive')

  return (
    <>
      <PageHeader
        title="Document Archive"
        description="Foundation screen for project file metadata and upload entry points"
        action="Upload Document"
      />
      <div className="p-5">
        <SectionCard title="Document List">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-ci-blue-950 text-xs text-white">
                <tr>
                  {['File Name', 'Type', 'Project', 'Size'].map((column) => (
                    <th key={column} className="px-4 py-3">{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {documents.map(([fileName, type, project, size]) => (
                  <tr key={fileName} className="hover:bg-blue-50">
                    <td className="px-4 py-3 font-medium text-ci-blue-900">{fileName}</td>
                    <td className="px-4 py-3"><DocumentTypeBadge type={type} /></td>
                    <td className="px-4 py-3">{project}</td>
                    <td className="px-4 py-3">{size}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>
    </>
  )
}
