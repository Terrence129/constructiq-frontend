import { useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react'
import axios from 'axios'
import {formatDateToMin} from "../utils/dateUtils.ts";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  deleteDocument,
  downloadDocument,
  getDocumentMetadata,
  getDocumentsByProject,
  uploadDocument,
} from '../api/documentApi'
import {
  deleteProject,
  getProjectById,
  updateProject,
} from '../api/projectApi'
import {
  addProjectRegistration,
  deleteProjectRegistration,
  getProjectRegistrations,
} from '../api/registrationApi'
import {
  createReport,
  deleteReport,
  getReportById,
  getReportsByProject,
  updateReport,
} from '../api/reportApi'
import {
  createRisk,
  deleteRisk,
  getRisksByProject,
  updateRisk,
} from '../api/riskApi'
import {
  createTask,
  deleteTask,
  getTasksByProject,
  updateTask,
} from '../api/taskApi'
import { DocumentTable } from '../components/document/DocumentTable'
import { formatFileSize } from '../components/document/formatFileSize'
import { ProjectMemberFormModal } from '../components/project/ProjectMemberFormModal'
import { ProjectMemberTable } from '../components/project/ProjectMemberTable'
import { ProjectStatusBadge } from '../components/project/ProjectStatusBadge'
import { RiskFormModal } from '../components/risk/RiskFormModal'
import { RiskMatrix } from '../components/risk/RiskMatrix'
import { RiskTable } from '../components/risk/RiskTable'
import { ReportDetailCard } from '../components/report/ReportDetailCard'
import { ReportFormModal } from '../components/report/ReportFormModal'
import { ReportList } from '../components/report/ReportList'
import { TaskFormModal } from '../components/task/TaskFormModal'
import { TaskTable } from '../components/task/TaskTable'
import { PageHeader } from '../components/ui/PageHeader'
import { SectionCard } from '../components/ui/SectionCard'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import type {
  CreateProgressReportRequest,
  DocumentRecord,
  ErrorResponse,
  Project,
  ProjectRegistration,
  ProjectRegistrationRequest,
  ProgressReport,
  Risk,
  RiskRequest,
  Task,
  TaskRequest,
  UpdateProgressReportRequest,
  UpdateProjectRequest,
} from '../types'
import { ProjectStatus } from '../types'

const tabs = [
  { key: 'overview', label: 'Overview' },
  { key: 'members', label: 'Members' },
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
            ) : activeTab === 'members' ? (
              <ProjectMembersPanel projectId={parsedProjectId} />
            ) : activeTab === 'tasks' ? (
              <TaskManagementPanel projectId={parsedProjectId} />
            ) : activeTab === 'risks' ? (
              <RiskManagementPanel projectId={parsedProjectId} />
            ) : activeTab === 'progressReports' ? (
              <ReportManagementPanel projectId={parsedProjectId} />
            ) : activeTab === 'documents' ? (
              <DocumentManagementPanel projectId={parsedProjectId} />
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

function ProjectMembersPanel({ projectId }: { projectId: number }) {
  const queryClient = useQueryClient()
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false)
  const [deletingRegistrationId, setDeletingRegistrationId] = useState<
    number | null
  >(null)

  const memberQueryKey = ['projects', projectId, 'registrations']

  const {
    data: members = [],
    error,
    isError,
    isLoading,
  } = useQuery({
    queryKey: memberQueryKey,
    queryFn: () => getProjectRegistrations(projectId),
  })

  const addMemberMutation = useMutation({
    mutationFn: (request: ProjectRegistrationRequest) =>
      addProjectRegistration(projectId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: memberQueryKey })
      closeMemberModal()
    },
  })

  const deleteMemberMutation = useMutation({
    mutationFn: (registrationId: number) =>
      deleteProjectRegistration(projectId, registrationId),
    onMutate: (registrationId) => setDeletingRegistrationId(registrationId),
    onSettled: () => setDeletingRegistrationId(null),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: memberQueryKey })
    },
  })

  function closeMemberModal() {
    setIsMemberModalOpen(false)
    addMemberMutation.reset()
  }

  function handleDeleteMember(member: ProjectRegistration) {
    const confirmed = window.confirm(
      `Remove ${member.userName} from this project?`,
    )

    if (confirmed) {
      deleteMemberMutation.mutate(member.id)
    }
  }

  return (
    <>
      <SectionCard
        title="Project Members"
        toolbar={
          <button
            className="h-8 bg-ci-blue-800 px-3 text-xs font-semibold text-white hover:bg-ci-blue-900"
            onClick={() => setIsMemberModalOpen(true)}
            type="button"
          >
            Add Member
          </button>
        }
      >
        {isLoading ? <MemberLoadingState /> : null}
        {isError ? (
          <div className="border-t border-red-200 bg-red-50 p-4 text-sm text-ci-red-700">
            <div className="font-semibold">Unable to load project members.</div>
            <div className="mt-1">{getRegistrationErrorMessage(error)}</div>
          </div>
        ) : null}
        {deleteMemberMutation.error ? (
          <div className="border-t border-red-200 bg-red-50 p-4 text-sm text-ci-red-700">
            {getRegistrationErrorMessage(deleteMemberMutation.error)}
          </div>
        ) : null}
        {!isLoading && !isError ? (
          <ProjectMemberTable
            deletingRegistrationId={deletingRegistrationId}
            members={members}
            onDelete={handleDeleteMember}
          />
        ) : null}
      </SectionCard>

      {isMemberModalOpen ? (
        <ProjectMemberFormModal
          errorMessage={
            addMemberMutation.error
              ? getRegistrationErrorMessage(addMemberMutation.error)
              : null
          }
          excludedUserIds={members.map((member) => member.userId)}
          isSubmitting={addMemberMutation.isPending}
          onClose={closeMemberModal}
          onSubmit={(request) => addMemberMutation.mutate(request)}
        />
      ) : null}
    </>
  )
}

function DocumentManagementPanel({ projectId }: { projectId: number }) {
  const queryClient = useQueryClient()
  const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(null)
  const [deletingDocumentId, setDeletingDocumentId] = useState<number | null>(null)
  const [downloadingDocumentId, setDownloadingDocumentId] = useState<number | null>(
    null,
  )
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const [downloadError, setDownloadError] = useState<string | null>(null)

  const documentListQueryKey = ['projects', projectId, 'documents']

  const {
    data: documents = [],
    error,
    isError,
    isLoading,
  } = useQuery({
    queryKey: documentListQueryKey,
    queryFn: () => getDocumentsByProject(projectId),
  })

  const {
    data: selectedDocument,
    error: selectedDocumentError,
    isError: isSelectedDocumentError,
    isFetching: isSelectedDocumentFetching,
  } = useQuery({
    enabled: selectedDocumentId !== null,
    queryKey: ['documents', selectedDocumentId],
    queryFn: () => getDocumentMetadata(selectedDocumentId as number),
  })

  const uploadDocumentMutation = useMutation({
    mutationFn: (file: File) =>
      uploadDocument(projectId, file, (event) => {
        if (event.total) {
          setUploadProgress(Math.round((event.loaded / event.total) * 100))
        }
      }),
    onMutate: () => {
      setUploadProgress(0)
    },
    onSuccess: (document) => {
      queryClient.invalidateQueries({ queryKey: documentListQueryKey })
      queryClient.setQueryData(['documents', document.id], document)
      setSelectedDocumentId(document.id)
    },
    onSettled: () => {
      setUploadProgress(null)
    },
  })

  const deleteDocumentMutation = useMutation({
    mutationFn: deleteDocument,
    onMutate: (documentId) => setDeletingDocumentId(documentId),
    onSettled: () => setDeletingDocumentId(null),
    onSuccess: (_data, documentId) => {
      queryClient.invalidateQueries({ queryKey: documentListQueryKey })
      queryClient.removeQueries({ queryKey: ['documents', documentId] })

      if (selectedDocumentId === documentId) {
        setSelectedDocumentId(null)
      }
    },
  })

  async function handleDownloadDocument(document: DocumentRecord) {
    setDownloadError(null)
    setDownloadingDocumentId(document.id)

    try {
      const result = await downloadDocument(document.id)
      saveBlob(result.blob, result.fileName ?? document.fileName)
    } catch (downloadFailure) {
      setDownloadError(getDocumentErrorMessage(downloadFailure))
    } finally {
      setDownloadingDocumentId(null)
    }
  }

  function handleDeleteDocument(document: DocumentRecord) {
    const confirmed = window.confirm(
      `Delete document "${document.fileName}"? This action cannot be undone.`,
    )

    if (confirmed) {
      deleteDocumentMutation.mutate(document.id)
    }
  }

  function handleUploadChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (file) {
      uploadDocumentMutation.mutate(file)
    }
  }

  return (
    <div className="space-y-4">
      <SectionCard
        title="Project Documents"
        toolbar={
          <label className="inline-flex h-8 cursor-pointer items-center bg-ci-blue-800 px-3 text-xs font-semibold text-white hover:bg-ci-blue-900">
            Upload Document
            <input
              className="hidden"
              disabled={uploadDocumentMutation.isPending}
              type="file"
              onChange={handleUploadChange}
            />
          </label>
        }
      >
        {uploadDocumentMutation.isPending && uploadProgress !== null ? (
          <div className="border-t border-gray-200 bg-blue-50 p-4">
            <div className="mb-2 text-sm font-medium text-ci-blue-900">
              Uploading document: {uploadProgress}%
            </div>
            <div className="h-2 bg-white">
              <div
                className="h-2 bg-ci-blue-800"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        ) : null}
        {uploadDocumentMutation.error ? (
          <div className="border-t border-red-200 bg-red-50 p-4 text-sm text-ci-red-700">
            {getDocumentErrorMessage(uploadDocumentMutation.error)}
          </div>
        ) : null}
        {downloadError ? (
          <div className="border-t border-red-200 bg-red-50 p-4 text-sm text-ci-red-700">
            {downloadError}
          </div>
        ) : null}
        {isLoading ? <DocumentLoadingState /> : null}
        {isError ? (
          <div className="border-t border-red-200 bg-red-50 p-4 text-sm text-ci-red-700">
            <div className="font-semibold">Unable to load documents.</div>
            <div className="mt-1">{getDocumentErrorMessage(error)}</div>
          </div>
        ) : null}
        {deleteDocumentMutation.error ? (
          <div className="border-t border-red-200 bg-red-50 p-4 text-sm text-ci-red-700">
            {getDocumentErrorMessage(deleteDocumentMutation.error)}
          </div>
        ) : null}
        {!isLoading && !isError ? (
          <DocumentTable
            deletingDocumentId={deletingDocumentId}
            documents={documents}
            downloadingDocumentId={downloadingDocumentId}
            onDelete={handleDeleteDocument}
            onDownload={handleDownloadDocument}
            onViewMetadata={(document) => setSelectedDocumentId(document.id)}
            selectedDocumentId={selectedDocumentId}
          />
        ) : null}
      </SectionCard>

      {isSelectedDocumentFetching ? <DocumentMetadataLoadingState /> : null}
      {isSelectedDocumentError ? (
        <DetailErrorState message={getDocumentErrorMessage(selectedDocumentError)} />
      ) : null}
      {selectedDocument ? (
        <DocumentMetadataCard document={selectedDocument} />
      ) : null}
    </div>
  )
}

function ReportManagementPanel({ projectId }: { projectId: number }) {
  const queryClient = useQueryClient()
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [editingReport, setEditingReport] = useState<ProgressReport | null>(null)
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null)
  const [deletingReportId, setDeletingReportId] = useState<number | null>(null)

  const reportListQueryKey = ['projects', projectId, 'progressReports']

  const {
    data: reports = [],
    error,
    isError,
    isLoading,
  } = useQuery({
    queryKey: reportListQueryKey,
    queryFn: () => getReportsByProject(projectId),
  })

  const sortedReports = [...reports].sort((a, b) =>
    b.reportDate.localeCompare(a.reportDate),
  )

  const {
    data: selectedReport,
    error: selectedReportError,
    isError: isSelectedReportError,
    isFetching: isSelectedReportFetching,
  } = useQuery({
    enabled: selectedReportId !== null,
    queryKey: ['progressReports', selectedReportId],
    queryFn: () => getReportById(selectedReportId as number),
  })

  const createReportMutation = useMutation({
    mutationFn: (request: CreateProgressReportRequest) =>
      createReport(projectId, request),
    onSuccess: (report) => {
      queryClient.invalidateQueries({ queryKey: reportListQueryKey })
      queryClient.setQueryData(['progressReports', report.id], report)
      setSelectedReportId(report.id)
      closeReportModal()
    },
  })

  const updateReportMutation = useMutation({
    mutationFn: ({
      reportId,
      request,
    }: {
      reportId: number
      request: UpdateProgressReportRequest
    }) => updateReport(reportId, request),
    onSuccess: (report) => {
      queryClient.invalidateQueries({ queryKey: reportListQueryKey })
      queryClient.setQueryData(['progressReports', report.id], report)
      setSelectedReportId(report.id)
      closeReportModal()
    },
  })

  const deleteReportMutation = useMutation({
    mutationFn: deleteReport,
    onMutate: (reportId) => setDeletingReportId(reportId),
    onSettled: () => setDeletingReportId(null),
    onSuccess: (_data, reportId) => {
      queryClient.invalidateQueries({ queryKey: reportListQueryKey })
      queryClient.removeQueries({ queryKey: ['progressReports', reportId] })

      if (selectedReportId === reportId) {
        setSelectedReportId(null)
      }
    },
  })

  function openCreateModal() {
    setEditingReport(null)
    setIsReportModalOpen(true)
  }

  function openEditModal(report: ProgressReport) {
    setEditingReport(report)
    setIsReportModalOpen(true)
  }

  function closeReportModal() {
    setIsReportModalOpen(false)
    setEditingReport(null)
    createReportMutation.reset()
    updateReportMutation.reset()
  }

  function handleSubmitReport(request: CreateProgressReportRequest) {
    if (editingReport) {
      updateReportMutation.mutate({ reportId: editingReport.id, request })
      return
    }

    createReportMutation.mutate(request)
  }

  function handleDeleteReport(report: ProgressReport) {
    const confirmed = window.confirm(
      `Delete progress report "${report.summary}"? This action cannot be undone.`,
    )

    if (confirmed) {
      deleteReportMutation.mutate(report.id)
    }
  }

  const modalError = editingReport
    ? updateReportMutation.error
    : createReportMutation.error

  return (
    <div className="space-y-4">
      <SectionCard
        title="Progress Reports"
        toolbar={
          <button
            className="h-8 bg-ci-blue-800 px-3 text-xs font-semibold text-white hover:bg-ci-blue-900"
            onClick={openCreateModal}
            type="button"
          >
            New Report
          </button>
        }
      >
        {isLoading ? <ReportLoadingState /> : null}
        {isError ? (
          <div className="border-t border-red-200 bg-red-50 p-4 text-sm text-ci-red-700">
            <div className="font-semibold">Unable to load progress reports.</div>
            <div className="mt-1">{getReportErrorMessage(error)}</div>
          </div>
        ) : null}
        {deleteReportMutation.error ? (
          <div className="border-t border-red-200 bg-red-50 p-4 text-sm text-ci-red-700">
            {getReportErrorMessage(deleteReportMutation.error)}
          </div>
        ) : null}
        {!isLoading && !isError ? (
          <ReportList
            deletingReportId={deletingReportId}
            onDelete={handleDeleteReport}
            onEdit={openEditModal}
            onSelect={(report) => setSelectedReportId(report.id)}
            reports={sortedReports}
            selectedReportId={selectedReportId}
          />
        ) : null}
      </SectionCard>

      {isSelectedReportFetching ? <ReportDetailLoadingState /> : null}
      {isSelectedReportError ? (
        <DetailErrorState message={getReportErrorMessage(selectedReportError)} />
      ) : null}
      {selectedReport ? <ReportDetailCard report={selectedReport} /> : null}

      {isReportModalOpen ? (
        <ReportFormModal
          errorMessage={modalError ? getReportErrorMessage(modalError) : null}
          isSubmitting={
            editingReport
              ? updateReportMutation.isPending
              : createReportMutation.isPending
          }
          onClose={closeReportModal}
          onSubmit={handleSubmitReport}
          report={editingReport ?? undefined}
        />
      ) : null}
    </div>
  )
}

function RiskManagementPanel({ projectId }: { projectId: number }) {
  const queryClient = useQueryClient()
  const [isRiskModalOpen, setIsRiskModalOpen] = useState(false)
  const [editingRisk, setEditingRisk] = useState<Risk | null>(null)
  const [deletingRiskId, setDeletingRiskId] = useState<number | null>(null)

  const riskQueryKey = ['projects', projectId, 'risks']

  const {
    data: risks = [],
    error,
    isError,
    isLoading,
  } = useQuery({
    queryKey: riskQueryKey,
    queryFn: () => getRisksByProject(projectId),
  })

  const createRiskMutation = useMutation({
    mutationFn: (request: RiskRequest) => createRisk(projectId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: riskQueryKey })
      closeRiskModal()
    },
  })

  const updateRiskMutation = useMutation({
    mutationFn: ({ request, riskId }: { request: RiskRequest; riskId: number }) =>
      updateRisk(riskId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: riskQueryKey })
      closeRiskModal()
    },
  })

  const deleteRiskMutation = useMutation({
    mutationFn: deleteRisk,
    onMutate: (riskId) => setDeletingRiskId(riskId),
    onSettled: () => setDeletingRiskId(null),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: riskQueryKey })
    },
  })

  function openCreateModal() {
    setEditingRisk(null)
    setIsRiskModalOpen(true)
  }

  function openEditModal(risk: Risk) {
    setEditingRisk(risk)
    setIsRiskModalOpen(true)
  }

  function closeRiskModal() {
    setIsRiskModalOpen(false)
    setEditingRisk(null)
    createRiskMutation.reset()
    updateRiskMutation.reset()
  }

  function handleSubmitRisk(request: RiskRequest) {
    if (editingRisk) {
      updateRiskMutation.mutate({ request, riskId: editingRisk.id })
      return
    }

    createRiskMutation.mutate(request)
  }

  function handleDeleteRisk(risk: Risk) {
    const confirmed = window.confirm(
      `Delete risk "${risk.title}"? This action cannot be undone.`,
    )

    if (confirmed) {
      deleteRiskMutation.mutate(risk.id)
    }
  }

  const modalError = editingRisk
    ? updateRiskMutation.error
    : createRiskMutation.error

  return (
    <div className="space-y-4">
      <SectionCard
        title="Risk Register"
        toolbar={
          <button
            className="h-8 bg-ci-blue-800 px-3 text-xs font-semibold text-white hover:bg-ci-blue-900"
            onClick={openCreateModal}
            type="button"
          >
            New Risk
          </button>
        }
      >
        {isLoading ? <RiskLoadingState /> : null}
        {isError ? (
          <div className="border-t border-red-200 bg-red-50 p-4 text-sm text-ci-red-700">
            <div className="font-semibold">Unable to load risks.</div>
            <div className="mt-1">{getRiskErrorMessage(error)}</div>
          </div>
        ) : null}
        {deleteRiskMutation.error ? (
          <div className="border-t border-red-200 bg-red-50 p-4 text-sm text-ci-red-700">
            {getRiskErrorMessage(deleteRiskMutation.error)}
          </div>
        ) : null}
        {!isLoading && !isError ? (
          <RiskTable
            deletingRiskId={deletingRiskId}
            onDelete={handleDeleteRisk}
            onEdit={openEditModal}
            risks={risks}
          />
        ) : null}
      </SectionCard>

      {!isLoading && !isError ? (
        <SectionCard title="Risk Matrix">
          <RiskMatrix risks={risks} />
        </SectionCard>
      ) : null}

      {isRiskModalOpen ? (
        <RiskFormModal
          errorMessage={modalError ? getRiskErrorMessage(modalError) : null}
          isSubmitting={
            editingRisk
              ? updateRiskMutation.isPending
              : createRiskMutation.isPending
          }
          onClose={closeRiskModal}
          onSubmit={handleSubmitRisk}
          risk={editingRisk ?? undefined}
        />
      ) : null}
    </div>
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
        <OverviewField label="Created At" value={formatDateToMin(project.createdAt)} />
        <OverviewField label="Updated At" value={formatDateToMin(project.updatedAt)} />
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

function TaskManagementPanel({ projectId }: { projectId: number }) {
  const queryClient = useQueryClient()
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null)

  const taskQueryKey = ['projects', projectId, 'tasks']

  const {
    data: tasks = [],
    error,
    isError,
    isLoading,
  } = useQuery({
    queryKey: taskQueryKey,
    queryFn: () => getTasksByProject(projectId),
  })

  const createTaskMutation = useMutation({
    mutationFn: (request: TaskRequest) => createTask(projectId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskQueryKey })
      closeTaskModal()
    },
  })

  const updateTaskMutation = useMutation({
    mutationFn: ({ request, taskId }: { request: TaskRequest; taskId: number }) =>
      updateTask(taskId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskQueryKey })
      closeTaskModal()
    },
  })

  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onMutate: (taskId) => setDeletingTaskId(taskId),
    onSettled: () => setDeletingTaskId(null),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskQueryKey })
    },
  })

  function openCreateModal() {
    setEditingTask(null)
    setIsTaskModalOpen(true)
  }

  function openEditModal(task: Task) {
    setEditingTask(task)
    setIsTaskModalOpen(true)
  }

  function closeTaskModal() {
    setIsTaskModalOpen(false)
    setEditingTask(null)
    createTaskMutation.reset()
    updateTaskMutation.reset()
  }

  function handleSubmitTask(request: TaskRequest) {
    if (editingTask) {
      updateTaskMutation.mutate({ request, taskId: editingTask.id })
      return
    }

    createTaskMutation.mutate(request)
  }

  function handleDeleteTask(task: Task) {
    const confirmed = window.confirm(
      `Delete task "${task.title}"? This action cannot be undone.`,
    )

    if (confirmed) {
      deleteTaskMutation.mutate(task.id)
    }
  }

  const modalError = editingTask
    ? updateTaskMutation.error
    : createTaskMutation.error

  return (
    <>
      <SectionCard
        title="Project Tasks"
        toolbar={
          <button
            className="h-8 bg-ci-blue-800 px-3 text-xs font-semibold text-white hover:bg-ci-blue-900"
            onClick={openCreateModal}
            type="button"
          >
            New Task
          </button>
        }
      >
        {isLoading ? <TaskLoadingState /> : null}
        {isError ? (
          <div className="border-t border-red-200 bg-red-50 p-4 text-sm text-ci-red-700">
            <div className="font-semibold">Unable to load tasks.</div>
            <div className="mt-1">{getTaskErrorMessage(error)}</div>
          </div>
        ) : null}
        {deleteTaskMutation.error ? (
          <div className="border-t border-red-200 bg-red-50 p-4 text-sm text-ci-red-700">
            {getTaskErrorMessage(deleteTaskMutation.error)}
          </div>
        ) : null}
        {!isLoading && !isError ? (
          <TaskTable
            deletingTaskId={deletingTaskId}
            onDelete={handleDeleteTask}
            onEdit={openEditModal}
            tasks={tasks}
          />
        ) : null}
      </SectionCard>

      {isTaskModalOpen ? (
        <TaskFormModal
          errorMessage={modalError ? getTaskErrorMessage(modalError) : null}
          isSubmitting={
            editingTask
              ? updateTaskMutation.isPending
              : createTaskMutation.isPending
          }
          onClose={closeTaskModal}
          onSubmit={handleSubmitTask}
          task={editingTask ?? undefined}
        />
      ) : null}
    </>
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

function TaskLoadingState() {
  return (
    <div className="space-y-2 p-4">
      {Array.from({ length: 5 }, (_, index) => (
        <div className="h-10 animate-pulse bg-gray-100" key={index} />
      ))}
    </div>
  )
}

function RiskLoadingState() {
  return (
    <div className="space-y-2 p-4">
      {Array.from({ length: 5 }, (_, index) => (
        <div className="h-10 animate-pulse bg-gray-100" key={index} />
      ))}
    </div>
  )
}

function ReportLoadingState() {
  return (
    <div className="space-y-2 p-4">
      {Array.from({ length: 5 }, (_, index) => (
        <div className="h-10 animate-pulse bg-gray-100" key={index} />
      ))}
    </div>
  )
}

function ReportDetailLoadingState() {
  return (
    <div className="space-y-3 border border-gray-200 bg-white p-4">
      <div className="h-4 w-40 animate-pulse bg-gray-100" />
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div className="h-16 animate-pulse bg-gray-100" key={index} />
        ))}
      </div>
      <div className="h-32 animate-pulse bg-gray-100" />
    </div>
  )
}

function DocumentLoadingState() {
  return (
    <div className="space-y-2 p-4">
      {Array.from({ length: 5 }, (_, index) => (
        <div className="h-10 animate-pulse bg-gray-100" key={index} />
      ))}
    </div>
  )
}

function DocumentMetadataLoadingState() {
  return (
    <div className="grid gap-4 border border-gray-200 bg-white p-4 md:grid-cols-3">
      {Array.from({ length: 6 }, (_, index) => (
        <div className="h-16 animate-pulse bg-gray-100" key={index} />
      ))}
    </div>
  )
}

function MemberLoadingState() {
  return (
    <div className="space-y-2 p-4">
      {Array.from({ length: 5 }, (_, index) => (
        <div className="h-10 animate-pulse bg-gray-100" key={index} />
      ))}
    </div>
  )
}

function DocumentMetadataCard({ document }: { document: DocumentRecord }) {
  return (
    <SectionCard title="Document Metadata">
      <div className="grid gap-4 p-4 text-sm md:grid-cols-3">
        <OverviewField label="File Name" value={document.fileName} />
        <OverviewField label="File Type" value={document.fileType} />
        <OverviewField label="File Size" value={formatFileSize(document.fileSize)} />
        <OverviewField label="Project" value={document.projectName} />
        <OverviewField label="Uploaded By" value={document.uploadedByName} />
        <OverviewField label="Created At" value={formatDateToMin(document.createdAt)} />
        <OverviewField label="Download URL" value={document.fileUrl} />
      </div>
    </SectionCard>
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

function getTaskErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ErrorResponse>(error)) {
    if (error.response?.status === 403) {
      return 'You do not have permission to manage tasks for this project. Only the project creator or a MANAGER can create, update, or delete tasks.'
    }

    return error.response?.data.message ?? error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Please verify the backend service is running and try again.'
}

function getRiskErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ErrorResponse>(error)) {
    if (error.response?.status === 403) {
      return 'You do not have permission to manage risks for this project. Only the project creator or a MANAGER can create, update, or delete risks.'
    }

    return error.response?.data.message ?? error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Please verify the backend service is running and try again.'
}

function getReportErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ErrorResponse>(error)) {
    if (error.response?.status === 403) {
      return 'You do not have permission to manage progress reports for this project. Only the project creator or a MANAGER can create, update, or delete reports.'
    }

    return error.response?.data.message ?? error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Please verify the backend service is running and try again.'
}

function getDocumentErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ErrorResponse>(error)) {
    if (error.response?.status === 403) {
      return 'You do not have permission to manage documents for this project. Only the project creator or a MANAGER can upload or delete documents.'
    }

    return error.response?.data.message ?? error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Please verify the backend service is running and try again.'
}

function getRegistrationErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ErrorResponse>(error)) {
    if (error.response?.status === 403) {
      return 'You do not have permission to manage members for this project. Only the project creator or a MANAGER can add or remove members.'
    }

    if (error.response?.status === 400) {
      return (
        error.response.data.message ||
        'Unable to add this member. The user may already be registered, or the target user may be the project creator.'
      )
    }

    return error.response?.data.message ?? error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Please verify the backend service is running and try again.'
}

function saveBlob(blob: Blob, fileName: string) {
  const objectUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = objectUrl
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(objectUrl)
}
