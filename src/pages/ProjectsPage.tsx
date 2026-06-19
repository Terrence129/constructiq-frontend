import { useMemo, useState, type FormEvent, type ReactNode } from 'react'
import axios from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { createProject, getProjects } from '../api/projectApi'
import { ProjectStatusBadge } from '../components/project/ProjectStatusBadge'
import { PageHeader } from '../components/ui/PageHeader'
import { SectionCard } from '../components/ui/SectionCard'
import { useAuth } from '../hooks/useAuth'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import type {
  CreateProjectRequest,
  ErrorResponse,
  Project,
  ProjectMemberRequest,
} from '../types'
import { ProjectMemberRole, ProjectStatus, UserRole } from '../types'

type StatusFilter = ProjectStatus | 'ALL'

interface ProjectFormState {
  name: string
  description: string
  location: string
  clientName: string
  status: ProjectStatus
  startDate: string
  endDate: string
}

interface ProjectMemberDraft {
  userId: string
  title: string
  description: string
  role: ProjectMemberRole
}

const initialFormState: ProjectFormState = {
  name: '',
  description: '',
  location: '',
  clientName: '',
  status: ProjectStatus.PLANNING,
  startDate: '',
  endDate: '',
}

const initialMemberDraft: ProjectMemberDraft = {
  userId: '',
  title: '',
  description: '',
  role: ProjectMemberRole.MEMBER,
}

export function ProjectsPage() {
  useDocumentTitle('Project Registry')
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const isAdmin = user?.role === UserRole.ADMIN

  const {
    data: projects = [],
    error,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  })

  const createProjectMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setIsCreateModalOpen(false)
    },
  })

  const filteredProjects = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return projects.filter((project) => {
      const matchesStatus =
        statusFilter === 'ALL' || project.status === statusFilter
      const searchableText = [
        project.name,
        project.clientName ?? '',
        project.location ?? '',
      ]
        .join(' ')
        .toLowerCase()

      return matchesStatus && searchableText.includes(normalizedSearch)
    })
  }, [projects, searchTerm, statusFilter])

  function resetFilters() {
    setSearchTerm('')
    setStatusFilter('ALL')
  }

  return (
    <>
      <PageHeader
        title="Project Registry"
        description="Manage project baseline information, status, and client records"
      />
      <div className="space-y-4 p-5">
        <SectionCard
          title="Search Criteria"
          toolbar={
            <button className="text-sm text-ci-blue-800" onClick={resetFilters}>
              Reset
            </button>
          }
        >
          <div className="grid gap-3 p-4 md:grid-cols-[1fr_220px_120px]">
            <input
              className="h-9 border border-gray-300 px-3 outline-none focus:border-ci-blue-800"
              placeholder="Search by project, client, or location"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            <select
              className="h-9 border border-gray-300 px-3 outline-none focus:border-ci-blue-800"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as StatusFilter)
              }
            >
              <option value="ALL">All statuses</option>
              {Object.values(ProjectStatus).map((status) => (
                <option key={status} value={status}>
                  {formatProjectStatus(status)}
                </option>
              ))}
            </select>
            <button
              className="h-9 bg-ci-blue-800 px-4 text-sm font-semibold text-white hover:bg-ci-blue-900"
              type="button"
            >
              Search
            </button>
          </div>
        </SectionCard>

        <SectionCard
          title="Project List"
          toolbar={
            isAdmin ? (
            <button
              className="h-8 bg-ci-blue-800 px-3 text-xs font-semibold text-white hover:bg-ci-blue-900"
              onClick={() => setIsCreateModalOpen(true)}
              type="button"
            >
              New Project
            </button>
            ) : null
          }
        >
          {isLoading ? <ProjectTableLoading /> : null}
          {isError ? <ProjectTableError error={error} /> : null}
          {!isLoading && !isError ? (
            <ProjectTable projects={filteredProjects} />
          ) : null}
        </SectionCard>
      </div>

      {isAdmin && isCreateModalOpen ? (
        <CreateProjectModal
          error={createProjectMutation.error}
          isSubmitting={createProjectMutation.isPending}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={(request) => createProjectMutation.mutate(request)}
        />
      ) : null}
    </>
  )
}

function ProjectTable({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return (
      <div className="border-t border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
        No projects match the current criteria.
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[1040px] table-fixed text-left text-sm">
        <colgroup>
          <col className="w-[260px]" />
          <col className="w-[130px]" />
          <col className="w-[180px]" />
          <col className="w-[80px]" />
          <col className="w-[100px]" />
          <col className="w-[100px]" />
          <col className="w-[120px]" />
        </colgroup>
        <thead className="bg-ci-blue-950 text-xs text-white">
          <tr>
            {[
              'Name',
              'Location',
              'Client',
              'Status',
              'Start Date',
              'End Date',
              'Created By'
            ].map((column) => (
              <th className="whitespace-nowrap px-4 py-3" key={column}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {projects.map((project) => (
            <tr className="hover:bg-blue-50" key={project.id}>
              <td className="px-4 py-3 font-medium text-ci-blue-900">
                <Link
                  className="block truncate hover:text-ci-blue-950 hover:underline"
                  title={project.name}
                  to={`/projects/${project.id}`}
                >
                  {project.name}
                </Link>
              </td>
              <td className="truncate px-4 py-3" title={formatNullable(project.location)}>
                {formatNullable(project.location)}
              </td>
              <td className="truncate px-4 py-3" title={formatNullable(project.clientName)}>
                {formatNullable(project.clientName)}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <ProjectStatusBadge status={project.status} />
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                {formatNullable(project.startDate)}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                {formatNullable(project.endDate)}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                {project.createdByName}
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function CreateProjectModal({
  error,
  isSubmitting,
  onClose,
  onSubmit,
}: {
  error: unknown
  isSubmitting: boolean
  onClose: () => void
  onSubmit: (request: CreateProjectRequest) => void
}) {
  const [form, setForm] = useState<ProjectFormState>(initialFormState)
  const [memberDraft, setMemberDraft] =
    useState<ProjectMemberDraft>(initialMemberDraft)
  const [members, setMembers] = useState<ProjectMemberRequest[]>([])

  function updateField<Key extends keyof ProjectFormState>(
    key: Key,
    value: ProjectFormState[Key],
  ) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function updateMemberDraft<Key extends keyof ProjectMemberDraft>(
    key: Key,
    value: ProjectMemberDraft[Key],
  ) {
    setMemberDraft((current) => ({ ...current, [key]: value }))
  }

  function addInitialMember() {
    const userId = Number(memberDraft.userId)

    if (!Number.isInteger(userId) || userId <= 0) {
      return
    }

    setMembers((current) => [
      ...current,
      {
        userId,
        title: optionalString(memberDraft.title),
        description: optionalString(memberDraft.description),
        role: memberDraft.role,
      },
    ])
    setMemberDraft(initialMemberDraft)
  }

  function removeInitialMember(index: number) {
    setMembers((current) => current.filter((_member, itemIndex) => itemIndex !== index))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit(toCreateProjectRequest(form, members))
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-gray-950/50 px-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto border border-gray-300 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 bg-ci-blue-950 px-5 py-4 text-white">
          <div>
            <h2 className="text-base font-semibold">Create Project</h2>
            <p className="mt-1 text-xs text-blue-100">
              Project creation requires an ADMIN account.
            </p>
          </div>
          <button
            className="border border-blue-200 px-3 py-1 text-xs font-medium hover:bg-ci-blue-800"
            onClick={onClose}
            type="button"
          >
            Close
          </button>
        </div>

        <form className="space-y-4 p-5" onSubmit={handleSubmit}>
          {error ? (
            <div className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-ci-red-700">
              {getProjectErrorMessage(error)}
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Project Name">
              <input
                className="h-10 w-full border border-gray-300 px-3 outline-none focus:border-ci-blue-800"
                required
                value={form.name}
                onChange={(event) => updateField('name', event.target.value)}
              />
            </FormField>
            <FormField label="Status">
              <select
                className="h-10 w-full border border-gray-300 px-3 outline-none focus:border-ci-blue-800"
                value={form.status}
                onChange={(event) =>
                  updateField('status', event.target.value as ProjectStatus)
                }
              >
                {Object.values(ProjectStatus).map((status) => (
                  <option key={status} value={status}>
                    {formatProjectStatus(status)}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Location">
              <input
                className="h-10 w-full border border-gray-300 px-3 outline-none focus:border-ci-blue-800"
                value={form.location}
                onChange={(event) => updateField('location', event.target.value)}
              />
            </FormField>
            <FormField label="Client Name">
              <input
                className="h-10 w-full border border-gray-300 px-3 outline-none focus:border-ci-blue-800"
                value={form.clientName}
                onChange={(event) =>
                  updateField('clientName', event.target.value)
                }
              />
            </FormField>
            <FormField label="Start Date">
              <input
                className="h-10 w-full border border-gray-300 px-3 outline-none focus:border-ci-blue-800"
                type="date"
                value={form.startDate}
                onChange={(event) => updateField('startDate', event.target.value)}
              />
            </FormField>
            <FormField label="End Date">
              <input
                className="h-10 w-full border border-gray-300 px-3 outline-none focus:border-ci-blue-800"
                type="date"
                value={form.endDate}
                onChange={(event) => updateField('endDate', event.target.value)}
              />
            </FormField>
          </div>

          <FormField label="Description">
            <textarea
              className="min-h-24 w-full border border-gray-300 px-3 py-2 outline-none focus:border-ci-blue-800"
              value={form.description}
              onChange={(event) => updateField('description', event.target.value)}
            />
          </FormField>

          <div className="border border-gray-200">
            <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-900">
              Initial Project Members
            </div>
            <div className="space-y-4 p-4">
              <div className="grid gap-3 md:grid-cols-[120px_1fr_1fr_140px_110px]">
                <input
                  className="h-9 border border-gray-300 px-3 outline-none focus:border-ci-blue-800"
                  min={1}
                  placeholder="User ID"
                  type="number"
                  value={memberDraft.userId}
                  onChange={(event) =>
                    updateMemberDraft('userId', event.target.value)
                  }
                />
                <input
                  className="h-9 border border-gray-300 px-3 outline-none focus:border-ci-blue-800"
                  placeholder="Title"
                  value={memberDraft.title}
                  onChange={(event) =>
                    updateMemberDraft('title', event.target.value)
                  }
                />
                <input
                  className="h-9 border border-gray-300 px-3 outline-none focus:border-ci-blue-800"
                  placeholder="Description"
                  value={memberDraft.description}
                  onChange={(event) =>
                    updateMemberDraft('description', event.target.value)
                  }
                />
                <select
                  className="h-9 border border-gray-300 px-3 outline-none focus:border-ci-blue-800"
                  value={memberDraft.role}
                  onChange={(event) =>
                    updateMemberDraft(
                      'role',
                      event.target.value as ProjectMemberRole,
                    )
                  }
                >
                  <option value={ProjectMemberRole.MEMBER}>Member</option>
                  <option value={ProjectMemberRole.MANAGER}>Manager</option>
                </select>
                <button
                  className="h-9 bg-ci-blue-800 px-3 text-sm font-semibold text-white hover:bg-ci-blue-900"
                  onClick={addInitialMember}
                  type="button"
                >
                  Add
                </button>
              </div>

              {members.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-ci-blue-950 text-xs text-white">
                      <tr>
                        {['User ID', 'Title', 'Description', 'Role', 'Actions'].map(
                          (column) => (
                            <th className="px-4 py-3" key={column}>
                              {column}
                            </th>
                          ),
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {members.map((member, index) => (
                        <tr key={`${member.userId}-${index}`}>
                          <td className="px-4 py-3">{member.userId}</td>
                          <td className="px-4 py-3">{member.title ?? '-'}</td>
                          <td className="px-4 py-3">
                            {member.description ?? '-'}
                          </td>
                          <td className="px-4 py-3">
                            {formatMemberRole(member.role ?? ProjectMemberRole.MEMBER)}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              className="font-medium text-ci-red-700"
                              onClick={() => removeInitialMember(index)}
                              type="button"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-sm text-gray-500">
                  Optional. Members can also be managed later from the project
                  detail page.
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
            <button
              className="h-9 border border-gray-300 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button
              className="h-9 bg-ci-blue-800 px-4 text-sm font-semibold text-white hover:bg-ci-blue-900 disabled:cursor-not-allowed disabled:bg-gray-400"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function FormField({
  children,
  label,
}: {
  children: ReactNode
  label: string
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-gray-700">{label}</span>
      {children}
    </label>
  )
}

function ProjectTableLoading() {
  return (
    <div className="space-y-2 p-4">
      {Array.from({ length: 5 }, (_, index) => (
        <div className="h-10 animate-pulse bg-gray-100" key={index} />
      ))}
    </div>
  )
}

function ProjectTableError({ error }: { error: unknown }) {
  return (
    <div className="border-t border-red-200 bg-red-50 p-4 text-sm text-ci-red-700">
      <div className="font-semibold">Unable to load projects.</div>
      <div className="mt-1">{getProjectErrorMessage(error)}</div>
    </div>
  )
}

function toCreateProjectRequest(
  form: ProjectFormState,
  members: ProjectMemberRequest[],
): CreateProjectRequest {
  return {
    name: form.name.trim(),
    description: optionalString(form.description),
    location: optionalString(form.location),
    clientName: optionalString(form.clientName),
    status: form.status,
    startDate: optionalString(form.startDate),
    endDate: optionalString(form.endDate),
    members: members.length > 0 ? members : undefined,
  }
}

function optionalString(value: string): string | undefined {
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

function formatNullable(value: string | null): string {
  return value ?? '-'
}

function formatProjectStatus(status: ProjectStatus): string {
  return status
    .split('_')
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(' ')
}

function formatMemberRole(role: ProjectMemberRole): string {
  return role
    .split('_')
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(' ')
}

function getProjectErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ErrorResponse>(error)) {
    if (error.response?.status === 403) {
      return 'Only administrators can create projects. Please use an ADMIN account or contact an administrator.'
    }

    return error.response?.data.message ?? error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Please verify the backend service is running and try again.'
}
