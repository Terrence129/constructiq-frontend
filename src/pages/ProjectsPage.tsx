import { ProjectStatusBadge } from '../components/project/ProjectStatusBadge'
import { PageHeader } from '../components/ui/PageHeader'
import { SectionCard } from '../components/ui/SectionCard'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import type { ProjectStatus } from '../types'

const projects: Array<[string, string, ProjectStatus, string, string]> = [
  ['Harbour Tower Phase 1', 'Singapore', 'ACTIVE', 'ConstructIQ Client', '2027-12-31'],
  ['East Utility Tunnel', 'Shanghai', 'PLANNING', 'Municipal Works Authority', '2026-11-30'],
  ['Urban Renewal Section B', 'Shenzhen', 'ON_HOLD', 'City Investment Group', '2027-03-15'],
]

export function ProjectsPage() {
  useDocumentTitle('Project Registry')

  return (
    <>
      <PageHeader
        title="Project Registry"
        description="Manage project baseline information, status, and client records"
        action="New Project"
      />
      <div className="space-y-4 p-5">
        <SectionCard
          title="Search Criteria"
          toolbar={<button className="text-sm text-ci-blue-800">Reset</button>}
        >
          <div className="grid gap-3 p-4 md:grid-cols-4">
            <input className="h-9 border border-gray-300 px-3" placeholder="Project name" />
            <select className="h-9 border border-gray-300 px-3">
              <option>All statuses</option>
              <option>Active</option>
              <option>Planning</option>
            </select>
            <input className="h-9 border border-gray-300 px-3" placeholder="Project location" />
            <button className="h-9 bg-ci-blue-800 text-white">Search</button>
          </div>
        </SectionCard>

        <SectionCard title="Project List">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-ci-blue-950 text-xs text-white">
                <tr>
                  {['Project Name', 'Location', 'Status', 'Client', 'Planned Finish'].map((column) => (
                    <th key={column} className="px-4 py-3">{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {projects.map(([name, location, status, client, endDate]) => (
                  <tr key={name} className="hover:bg-blue-50">
                    <td className="px-4 py-3 font-medium text-ci-blue-900">{name}</td>
                    <td className="px-4 py-3">{location}</td>
                    <td className="px-4 py-3"><ProjectStatusBadge status={status} /></td>
                    <td className="px-4 py-3">{client}</td>
                    <td className="px-4 py-3">{endDate}</td>
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
