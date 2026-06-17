import { NavLink } from 'react-router-dom'
import { PageHeader } from '../components/ui/PageHeader'
import { SectionCard } from '../components/ui/SectionCard'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

const tabs = ['Overview', 'Tasks', 'Reports', 'Risks', 'Documents', 'AI Analysis']

export function ProjectDetailPage() {
  useDocumentTitle('Project Detail')

  return (
    <>
      <PageHeader
        title="Harbour Tower Phase 1"
        description="Mixed-use construction project. This is a frontend foundation page."
        action="Edit Project"
      />
      <div className="space-y-4 p-5">
        <div className="flex overflow-x-auto border border-gray-200 bg-white">
          {tabs.map((tab) => (
            <button
              className="min-w-24 border-r border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50"
              key={tab}
            >
              {tab}
            </button>
          ))}
        </div>
        <SectionCard title="Project Overview">
          <div className="grid gap-4 p-4 text-sm md:grid-cols-3">
            <div><span className="text-gray-500">Location: </span>Singapore</div>
            <div><span className="text-gray-500">Client: </span>ConstructIQ Client</div>
            <div><span className="text-gray-500">Status: </span>Active</div>
            <div><span className="text-gray-500">Start Date: </span>2026-07-01</div>
            <div><span className="text-gray-500">End Date: </span>2027-12-31</div>
            <div><span className="text-gray-500">Created By: </span>Admin User</div>
          </div>
        </SectionCard>
        <NavLink className="text-sm font-medium text-ci-blue-800" to="/projects">
          Back to Project Registry
        </NavLink>
      </div>
    </>
  )
}
