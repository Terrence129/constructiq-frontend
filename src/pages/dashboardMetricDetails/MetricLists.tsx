import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getProjects } from '../../api/projectApi'
import { getReports } from '../../api/reportApi'
import { getRisks } from '../../api/riskApi'
import { getTasks } from '../../api/taskApi'
import { SectionCard } from '../../components/ui/SectionCard'
import {
  filterProjects,
  filterReports,
  filterRisks,
  filterTasks,
  getReportProjectOptions,
  getRiskServerFilters,
  getTaskServerFilters,
} from './filterLogic'
import {
  ProjectFilters,
  ReportFilters,
  RiskFilters,
  TaskFilters,
} from './MetricFilters'
import {
  DocumentProjectResultsTable,
  ProjectResultsTable,
  ReportResultsTable,
  RiskResultsTable,
  TableErrorState,
  TableLoadingState,
  TaskResultsTable,
} from './MetricResults'
import type {
  ProjectStatusFilter,
  RiskCategoryFilter,
  RiskLevelFilter,
  RiskStatusFilter,
  TaskDueFilter,
  TaskPriorityFilter,
  TaskStatusFilter,
} from './metricConfig'

export function ProjectMetricList({
  initialStatus,
}: {
  initialStatus: ProjectStatusFilter
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] =
    useState<ProjectStatusFilter>(initialStatus)

  const {
    data: projects = [],
    error,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['dashboard', 'metric-projects'],
    queryFn: getProjects,
  })

  const filteredProjects = useMemo(
    () => filterProjects(projects, searchTerm, statusFilter),
    [projects, searchTerm, statusFilter],
  )

  return (
    <>
      <ProjectFilters
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onReset={() => {
          setSearchTerm('')
          setStatusFilter('ALL')
        }}
        onSearchChange={setSearchTerm}
        onStatusChange={setStatusFilter}
      />
      <SectionCard title={`Project Results (${filteredProjects.length})`}>
        {isLoading ? <TableLoadingState /> : null}
        {isError ? <TableErrorState error={error} label="projects" /> : null}
        {!isLoading && !isError ? (
          <ProjectResultsTable projects={filteredProjects} />
        ) : null}
      </SectionCard>
    </>
  )
}

export function DocumentProjectMetricList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<ProjectStatusFilter>('ALL')

  const {
    data: projects = [],
    error,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['dashboard', 'metric-document-projects'],
    queryFn: getProjects,
  })

  const filteredProjects = useMemo(
    () => filterProjects(projects, searchTerm, statusFilter),
    [projects, searchTerm, statusFilter],
  )

  return (
    <>
      <ProjectFilters
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onReset={() => {
          setSearchTerm('')
          setStatusFilter('ALL')
        }}
        onSearchChange={setSearchTerm}
        onStatusChange={setStatusFilter}
      />
      <SectionCard title={`Projects With Document Access (${filteredProjects.length})`}>
        {isLoading ? <TableLoadingState /> : null}
        {isError ? <TableErrorState error={error} label="projects" /> : null}
        {!isLoading && !isError ? (
          <DocumentProjectResultsTable projects={filteredProjects} />
        ) : null}
      </SectionCard>
    </>
  )
}

export function TaskMetricList({
  initialDueFilter,
  initialStatusFilter,
}: {
  initialDueFilter: TaskDueFilter
  initialStatusFilter: TaskStatusFilter
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] =
    useState<TaskStatusFilter>(initialStatusFilter)
  const [priorityFilter, setPriorityFilter] =
    useState<TaskPriorityFilter>('ALL')
  const [dueFilter, setDueFilter] = useState<TaskDueFilter>(initialDueFilter)

  const serverFilters = getTaskServerFilters(statusFilter, priorityFilter)

  const {
    data: tasks = [],
    error,
    isError,
    isLoading,
  } = useQuery({
    queryKey: [
      'dashboard',
      'metric-tasks',
      serverFilters.status,
      serverFilters.priority,
    ],
    queryFn: () => getTasks(serverFilters),
  })

  const filteredTasks = useMemo(
    () => filterTasks(tasks, searchTerm, statusFilter, dueFilter),
    [dueFilter, searchTerm, statusFilter, tasks],
  )

  return (
    <>
      <TaskFilters
        dueFilter={dueFilter}
        priorityFilter={priorityFilter}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onDueChange={setDueFilter}
        onPriorityChange={setPriorityFilter}
        onReset={() => {
          setSearchTerm('')
          setStatusFilter('ALL')
          setPriorityFilter('ALL')
          setDueFilter('ALL')
        }}
        onSearchChange={setSearchTerm}
        onStatusChange={setStatusFilter}
      />
      <SectionCard title={`Task Results (${filteredTasks.length})`}>
        {isLoading ? <TableLoadingState /> : null}
        {isError ? <TableErrorState error={error} label="tasks" /> : null}
        {!isLoading && !isError ? <TaskResultsTable tasks={filteredTasks} /> : null}
      </SectionCard>
    </>
  )
}

export function RiskMetricList({
  initialLevelFilter,
  initialStatusFilter,
}: {
  initialLevelFilter: RiskLevelFilter
  initialStatusFilter: RiskStatusFilter
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] =
    useState<RiskCategoryFilter>('ALL')
  const [levelFilter, setLevelFilter] =
    useState<RiskLevelFilter>(initialLevelFilter)
  const [statusFilter, setStatusFilter] =
    useState<RiskStatusFilter>(initialStatusFilter)

  const serverFilters = getRiskServerFilters(
    categoryFilter,
    levelFilter,
    statusFilter,
  )

  const {
    data: risks = [],
    error,
    isError,
    isLoading,
  } = useQuery({
    queryKey: [
      'dashboard',
      'metric-risks',
      serverFilters.category,
      serverFilters.riskLevel,
      serverFilters.status,
    ],
    queryFn: () => getRisks(serverFilters),
  })

  const filteredRisks = useMemo(
    () => filterRisks(risks, searchTerm, statusFilter),
    [risks, searchTerm, statusFilter],
  )

  return (
    <>
      <RiskFilters
        categoryFilter={categoryFilter}
        levelFilter={levelFilter}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onCategoryChange={setCategoryFilter}
        onLevelChange={setLevelFilter}
        onReset={() => {
          setSearchTerm('')
          setCategoryFilter('ALL')
          setLevelFilter('ALL')
          setStatusFilter('ALL')
        }}
        onSearchChange={setSearchTerm}
        onStatusChange={setStatusFilter}
      />
      <SectionCard title={`Risk Results (${filteredRisks.length})`}>
        {isLoading ? <TableLoadingState /> : null}
        {isError ? <TableErrorState error={error} label="risks" /> : null}
        {!isLoading && !isError ? <RiskResultsTable risks={filteredRisks} /> : null}
      </SectionCard>
    </>
  )
}

export function ReportMetricList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [projectFilter, setProjectFilter] = useState('ALL')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  const {
    data: reports = [],
    error,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['dashboard', 'metric-reports'],
    queryFn: getReports,
  })

  const projectOptions = useMemo(
    () => getReportProjectOptions(reports),
    [reports],
  )

  const filteredReports = useMemo(
    () =>
      filterReports(reports, searchTerm, projectFilter, fromDate, toDate),
    [fromDate, projectFilter, reports, searchTerm, toDate],
  )

  return (
    <>
      <ReportFilters
        fromDate={fromDate}
        projectFilter={projectFilter}
        projectOptions={projectOptions}
        searchTerm={searchTerm}
        toDate={toDate}
        onFromDateChange={setFromDate}
        onProjectChange={setProjectFilter}
        onReset={() => {
          setSearchTerm('')
          setProjectFilter('ALL')
          setFromDate('')
          setToDate('')
        }}
        onSearchChange={setSearchTerm}
        onToDateChange={setToDate}
      />
      <SectionCard title={`Progress Report Results (${filteredReports.length})`}>
        {isLoading ? <TableLoadingState /> : null}
        {isError ? (
          <TableErrorState error={error} label="progress reports" />
        ) : null}
        {!isLoading && !isError ? (
          <ReportResultsTable reports={filteredReports} />
        ) : null}
      </SectionCard>
    </>
  )
}
