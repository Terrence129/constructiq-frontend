import { useState, type FormEvent, type ReactNode } from 'react'
import axios from 'axios'
import dayjs from 'dayjs'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  deleteProject,
  getProjectById,
  updateProject,
} from '../api/projectApi'
import { ProjectStatusBadge } from '../components/project/ProjectStatusBadge'
import { PageHeader } from '../components/ui/PageHeader'
import { SectionCard } from '../components/ui/SectionCard'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import type { ErrorResponse, Project, UpdateProjectRequest } from '../types'
import { ProjectStatus } from '../types'

const tabs = [
  { key: 'overview', label: 'Overview' },
  { key: 'tasks', label: 'Tasks' },
  { key: 'risks', label: 'Risks' },
  { key: 'progressReports', label: 'Progress Reports' },
  { key: 'documents', label: 'Documents' },
  { key: 'aiAnalysis', label: 'AI Analysis' },
] as const

type TabKey = (typeof tabs)[number]['key']

interface ProjectFormState {
  name: string
  description: string
  location: string
  clientName: string
  status: ProjectStatus
  startDate: string
  endDate: string
}

export function ProjectDetailPage() {
  useDocumentTitle('Project Detail')
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { projectId } = useParams()
  const parsedProjectId = Number(projectId)
  const [activeTab, setActiveTab] = useState<TabKey>('overview')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const invalidProjectId = !Number.isInteger(parsedProjectId) || parsedProjectId <= 0

  const {
    data: project,
    error,
    isError,
    isLoading,
  } = useQuery({
    enabled: !invalidProjectId,
    queryKey: ['projects', parsedProjectId],
    queryFn: () => getProjectById(parsedProjectId),
  })

  const updateProjectMutation = useMutation({
    mutationFn: (request: UpdateProjectRequest) =>
      updateProject(parsedProjectId, request),
    onSuccess: (updatedProject) => {
      queryClient.setQueryData(['projects', parsedProjectId], updatedProject)
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setIsEditModalOpen(false)
    },
  })

  const deleteProjectMutation = useMutation({
    mutationFn: () => deleteProject(parsedProjectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      navigate('/projects', { replace: true })
    },
  })

  function handleDeleteProject() {
    const confirmed = window.confirm(
      'Delete this project? This action cannot be undone.',
    )

    if (confirmed) {
      deleteProjectMutation.mutate()
    }
  }

  return (
    <>
      <PageHeader
        title={project?.name ?? 'Project Detail'}
        description="Project overview, management actions, and module tabs"
      />
      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-3 border border-gray-200 bg-white px-4 py-3">
          <Link className="text-sm font-medium text-ci-blue-800" to="/projects">
            Back to Project Registry
          </Link>
          {project ? (
            <div className="flex gap-2">
              <button
                className="h-8 bg-ci-blue-800 px-3 text-xs font-semibold text-white hover:bg-ci-blue-900"
                onClick={() => setIsEditModalOpen(true)}
                type="button"
              >
                Edit Project
              </button>
              <button
                className="h-8 border border-ci-red-700 px-3 text-xs font-semibold text-ci-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400"
                disabled={deleteProjectMutation.isPending}
                onClick={handleDeleteProject}
                type="button"
              >
                {deleteProjectMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          ) : null}
        </div>

        {invalidProjectId ? (
          <DetailErrorState message="Invalid project id." />
        ) : null}
        {isLoading ? <DetailLoadingState /> : null}
        {isError ? <DetailErrorState message={getProjectErrorMessage(error)} /> : null}
        {deleteProjectMutation.error ? (
          <DetailErrorState
            message={getProjectErrorMessage(deleteProjectMutation.error)}
          />
        ) : null}

        {project ? (
          <>
            <div className="flex overflow-x-auto border border-gray-200 bg-white">
              {tabs.map((tab) => (
                <button
                  className={`min-w-32 border-r border-gray-200 px-4 py-3 text-sm font-medium ${
                    activeTab === tab.key
                      ? 'bg-blue-50 text-ci-blue-950'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  type="button"
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'overview' ? (
              <ProjectOverview project={project} />
            ) : (
              <PlaceholderTab
                label={tabs.find((tab) => tab.key === activeTab)?.label ?? 'Module'}
              />
            )}
          </>
        ) : null}
      </div>

      {project && isEditModalOpen ? (
        <EditProjectModal
          error={updateProjectMutation.error}
          isSubmitting={updateProjectMutation.isPending}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={(request) => updateProjectMutation.mutate(request)}
          project={project}
        />
      ) : null}
    </>
  )
}

function ProjectOverview({ project }: { project: Project }) {
  return (
    <SectionCard title="Project Overview">
      <div className="grid gap-4 p-4 text-sm md:grid-cols-3">
        <OverviewField label="Name" value={project.name} />
        <OverviewField label="Location" value={project.location} />
        <OverviewField label="Client Name" value={project.clientName} />
        <OverviewField
          label="Status"
          value={<ProjectStatusBadge status={project.status} />}
        />
        <OverviewField label="Start Date" value={project.startDate} />
        <OverviewField label="End Date" value={project.endDate} />
        <OverviewField label="Created By" value={project.createdByName} />
        <OverviewField label="Created At" value={dayjs(project.createdAt)
            .format("YYYY-MM-DD HH:mm")} />
        <OverviewField label="Updated At" value={dayjs(project.updatedAt)
            .format("YYYY-MM-DD HH:mm")} />
      </div>
      <div className="border-t border-gray-200 p-4">
        <div className="mb-1 text-sm font-semibold text-gray-900">
          Description
        </div>
        <p className="text-sm leading-6 text-gray-700">
          {formatNullable(project.description)}
        </p>
      </div>
    </SectionCard>
  )
}

function OverviewField({
  label,
  value,
}: {
  label: string
  value: ReactNode
}) {
  return (
    <div className="border-l-4 border-ci-blue-800 bg-blue-50 px-3 py-2">
      <div className="text-xs font-semibold text-gray-500">{label}</div>
      <div className="mt-1 break-words font-medium text-gray-900">
        {formatNullable(value)}
      </div>
    </div>
  )
}

function PlaceholderTab({ label }: { label: string }) {
  return (
    <SectionCard title={label}>
      <div className="p-6 text-sm text-gray-600">
        {label} content will be implemented in the next module step.
      </div>
    </SectionCard>
  )
}

function EditProjectModal({
  error,
  isSubmitting,
  onClose,
  onSubmit,
  project,
}: {
  error: unknown
  isSubmitting: boolean
  onClose: () => void
  onSubmit: (request: UpdateProjectRequest) => void
  project: Project
}) {
  const [form, setForm] = useState<ProjectFormState>(() => ({
    name: project.name,
    description: project.description ?? '',
    location: project.location ?? '',
    clientName: project.clientName ?? '',
    status: project.status,
    startDate: project.startDate ?? '',
    endDate: project.endDate ?? '',
  }))

  function updateField<Key extends keyof ProjectFormState>(
    key: Key,
    value: ProjectFormState[Key],
  ) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit(toUpdateProjectRequest(form))
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-gray-950/50 px-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto border border-gray-300 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 bg-ci-blue-950 px-5 py-4 text-white">
          <div>
            <h2 className="text-base font-semibold">Edit Project</h2>
            <p className="mt-1 text-xs text-blue-100">
              Project updates require creator or manager access.
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
              {isSubmitting ? 'Saving...' : 'Save Changes'}
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

function DetailLoadingState() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {Array.from({ length: 6 }, (_, index) => (
        <div className="h-16 animate-pulse bg-gray-100" key={index} />
      ))}
    </div>
  )
}

function DetailErrorState({ message }: { message: string }) {
  return (
    <div className="border border-red-200 bg-red-50 p-4 text-sm text-ci-red-700">
      {message}
    </div>
  )
}

function toUpdateProjectRequest(form: ProjectFormState): UpdateProjectRequest {
  return {
    name: form.name.trim(),
    description: optionalString(form.description),
    location: optionalString(form.location),
    clientName: optionalString(form.clientName),
    status: form.status,
    startDate: optionalString(form.startDate),
    endDate: optionalString(form.endDate),
  }
}

function optionalString(value: string): string | undefined {
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

function formatNullable(value: ReactNode | null): ReactNode {
  return value ?? '-'
}

function formatProjectStatus(status: ProjectStatus): string {
  return status
    .split('_')
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(' ')
}

function getProjectErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ErrorResponse>(error)) {
    if (error.response?.status === 403) {
      return 'You do not have permission to manage this project.'
    }

    return error.response?.data.message ?? error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Please verify the backend service is running and try again.'
}
