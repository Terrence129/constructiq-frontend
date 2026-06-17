## Prompt 1 — Initialize frontend foundation

```text
You are working on the ConstructIQ frontend.

Read these two files carefully:
1. ConstructIQ.md
2. api-documentation.md

Implement the frontend foundation only.

Tech stack:
- React
- TypeScript
- Vite
- TailwindCSS
- React Router
- Axios
- TanStack Query

Requirements:
1. Clean the default Vite template.
2. Create this folder structure:
   src/api
   src/components/layout
   src/components/ui
   src/components/project
   src/components/task
   src/components/risk
   src/components/report
   src/components/document
   src/pages
   src/router
   src/types
   src/hooks
3. Configure TailwindCSS.
4. Configure React Router.
5. Configure TanStack Query in main.tsx.
6. Create a basic AppLayout with:
   - dark blue top header
   - left sidebar
   - main content area
7. Use a formal Chinese state-owned enterprise / government enterprise dashboard style:
   - deep blue main color
   - red/gold accents only when needed
   - white cards
   - gray background
   - dense enterprise tables
   - professional admin-system feeling
8. Do not implement API features yet.
9. Make sure npm run dev and npm run build both work.
```

---

## Prompt 2 — Define TypeScript types and Axios client

```text
Now implement the TypeScript types and API client layer.

Use api-documentation.md as the source of truth.

Requirements:
1. Create src/api/axios.ts.
2. Base URL should be http://localhost:8080.
3. Add an Axios request interceptor:
   - read token from localStorage
   - if token exists, add Authorization: Bearer token
4. Add a response interceptor:
   - if response status is 401, remove token and redirect to /login
5. Create TypeScript types in src/types:
   - auth.ts
   - project.ts
   - task.ts
   - risk.ts
   - report.ts
   - document.ts
   - dashboard.ts
   - common.ts
6. Types must match the backend API response fields exactly.
7. Include enums:
   - UserRole
   - ProjectStatus
   - ProjectMemberRole
   - TaskStatus
   - TaskPriority
   - RiskCategory
   - RiskLevel
   - RiskStatus
8. Do not create pages yet.
9. Make sure TypeScript has no errors.
```

---

## Prompt 3 — Authentication: login, register, auth state

```text
Implement authentication.

Backend endpoints:
- POST /api/auth/login
- POST /api/auth/register

Requirements:
1. Create src/api/authApi.ts.
2. Implement:
   - login(request)
   - register(request)
   - logout()
3. Store JWT token in localStorage after successful login/register.
4. Store user info in localStorage as well.
5. Create useAuth hook:
   - user
   - token
   - isAuthenticated
   - login
   - register
   - logout
6. Create LoginPage.tsx:
   - email input
   - password input
   - submit button
   - loading state
   - error message
   - redirect to /dashboard after success
7. Create RegisterPage.tsx:
   - name input
   - email input
   - password input
   - submit button
   - loading state
   - error message
   - redirect to /dashboard after success
8. Create ProtectedRoute component:
   - unauthenticated users go to /login
9. Add routes:
   - /login
   - /register
   - /dashboard
10. Keep the UI formal, enterprise-style, and suitable for a construction management platform.
11. Make sure npm run build works.
```

---

## Prompt 4 — Dashboard page

```text
Implement the dashboard page.

Backend endpoint:
- GET /api/dashboard/statistics

Requirements:
1. Create src/api/dashboardApi.ts.
2. Fetch dashboard statistics using TanStack Query.
3. Create DashboardPage.tsx.
4. Display statistic cards:
   - totalProjects
   - activeProjects
   - completedProjects
   - totalTasks
   - openTasks
   - completedTasks
   - overdueTasks
   - totalRisks
   - openRisks
   - highRisks
   - criticalRisks
   - progressReports
   - documents
5. Use enterprise dashboard UI:
   - compact cards
   - formal labels
   - blue theme
   - red for high/critical risks and overdue tasks
6. Add loading and error states.
7. Keep the page inside AppLayout.
8. Make sure npm run build works.
```

---

## Prompt 5 — Projects list and project creation

```text
Implement project list and project creation.

Backend endpoints:
- GET /api/projects
- POST /api/projects

Requirements:
1. Create src/api/projectApi.ts.
2. Implement:
   - getProjects()
   - createProject(request)
3. Create ProjectsPage.tsx.
4. Display projects in an enterprise table.
5. Columns:
   - name
   - location
   - clientName
   - status
   - startDate
   - endDate
   - createdByName
   - actions
6. Add search by project name/client/location on frontend.
7. Add status filter.
8. Add Create Project modal/form.
9. Project form fields:
   - name
   - description
   - location
   - clientName
   - status
   - startDate
   - endDate
10. After creating a project, refresh the project list.
11. Show backend error messages clearly.
12. Remember: creating projects requires ADMIN role. If backend returns 403, show a user-friendly message.
13. Make sure npm run build works.
```

---

## Prompt 6 — Project detail page with tabs

```text
Implement ProjectDetailPage.

Backend endpoint:
- GET /api/projects/{id}

Requirements:
1. Add route /projects/:projectId.
2. In ProjectsPage, clicking a project should navigate to /projects/:projectId.
3. Create ProjectDetailPage.tsx.
4. Fetch project detail by ID.
5. Display project overview:
   - name
   - description
   - location
   - clientName
   - status
   - startDate
   - endDate
   - createdByName
6. Add tabs:
   - Overview
   - Tasks
   - Risks
   - Progress Reports
   - Documents
   - AI Analysis
7. For now, tabs can show placeholder text.
8. Keep layout formal and dashboard-like.
9. Make sure npm run build works.
```

---

## Prompt 7 — Task management UI

```text
Implement task management inside ProjectDetailPage.

Backend endpoints:
- GET /api/projects/{projectId}/tasks
- POST /api/projects/{projectId}/tasks
- PUT /api/tasks/{taskId}
- DELETE /api/tasks/{taskId}

Requirements:
1. Create src/api/taskApi.ts.
2. Implement:
   - getTasksByProject(projectId)
   - createTask(projectId, request)
   - updateTask(taskId, request)
   - deleteTask(taskId)
3. Create task components:
   - TaskTable
   - TaskFormModal
   - TaskStatusBadge
   - TaskPriorityBadge
4. Task fields:
   - title
   - description
   - status
   - priority
   - assignee
   - dueDate
5. Show tasks in table.
6. Add create, edit, delete actions.
7. Use confirmation before delete.
8. Refresh task list after mutation.
9. Show 403 errors clearly because only project creator or MANAGER can create/update/delete tasks.
10. Make sure npm run build works.
```

---

## Prompt 8 — Risk register UI

```text
Implement risk management inside ProjectDetailPage.

Backend endpoints:
- GET /api/projects/{projectId}/risks
- POST /api/projects/{projectId}/risks
- PUT /api/risks/{riskId}
- DELETE /api/risks/{riskId}

Requirements:
1. Create src/api/riskApi.ts.
2. Implement:
   - getRisksByProject(projectId)
   - createRisk(projectId, request)
   - updateRisk(riskId, request)
   - deleteRisk(riskId)
3. Create risk components:
   - RiskTable
   - RiskFormModal
   - RiskLevelBadge
   - RiskMatrix
4. Risk fields:
   - title
   - description
   - category
   - probability
   - impact
   - status
   - mitigationPlan
   - owner
   - targetDate
5. Backend calculates:
   - severity = probability * impact
   - riskLevel
6. Display severity and riskLevel in the table.
7. RiskMatrix should show probability × impact visually in a simple 5x5 grid.
8. Use red for CRITICAL, orange for HIGH, yellow for MEDIUM, green/blue-gray for LOW.
9. Add create, edit, delete actions.
10. Make sure npm run build works.
```

---

## Prompt 9 — Progress reports UI

```text
Implement progress reports inside ProjectDetailPage.

Backend endpoints:
- GET /api/projects/{projectId}/progressReports
- POST /api/projects/{projectId}/progressReports
- GET /api/progressReports/{progressReportId}
- PUT /api/progressReports/{progressReportId}
- DELETE /api/progressReports/{progressReportId}

Requirements:
1. Create src/api/reportApi.ts.
2. Implement:
   - getReportsByProject(projectId)
   - createReport(projectId, request)
   - getReportById(reportId)
   - updateReport(reportId, request)
   - deleteReport(reportId)
3. Create report components:
   - ReportList
   - ReportFormModal
   - ReportDetailCard
4. Report fields:
   - reportDate
   - summary
   - completedWork
   - delayedWork
   - issues
   - nextActions
5. Display reports in reverse chronological order.
6. Add create, edit, delete actions.
7. Use larger text areas for report content.
8. Make sure npm run build works.
```

---

## Prompt 10 — Document upload and download UI

```text
Implement document management inside ProjectDetailPage.

Backend endpoints:
- GET /api/projects/{projectId}/documents
- POST /api/projects/{projectId}/documents/upload
- GET /api/documents/{documentId}
- GET /api/documents/{documentId}/download
- DELETE /api/documents/{documentId}

Requirements:
1. Create src/api/documentApi.ts.
2. Implement:
   - getDocumentsByProject(projectId)
   - uploadDocument(projectId, file)
   - getDocumentMetadata(documentId)
   - downloadDocument(documentId)
   - deleteDocument(documentId)
3. Upload must use multipart/form-data with field name file.
4. Do not manually set Content-Type boundary; let Axios handle it.
5. Display documents in table:
   - fileName
   - fileType
   - fileSize
   - uploadedByName
   - createdAt
   - actions
6. Add file upload input.
7. Add download button.
8. Download should preserve filename from Content-Disposition if possible.
9. Add delete button with confirmation.
10. Show upload progress if simple to implement.
11. Make sure npm run build works.
```

---

## Prompt 11 — Project registrations UI

```text
Implement project registration/member management.

Backend endpoints:
- POST /api/projects/{projectId}/registrations
- GET /api/projects/{projectId}/registrations
- DELETE /api/projects/{projectId}/registrations/{registrationId}

Requirements:
1. Create src/api/registrationApi.ts.
2. Implement:
   - getProjectRegistrations(projectId)
   - addProjectRegistration(projectId, request)
   - deleteProjectRegistration(projectId, registrationId)
3. Add a Members tab or section in ProjectDetailPage.
4. Display members in table:
   - userName
   - userEmail
   - title
   - description
   - role
   - createdAt
   - actions
5. Add member form fields:
   - userId
   - title
   - description
   - role
6. Role options:
   - MEMBER
   - MANAGER
7. Show clear error if:
   - user is already registered
   - target user is project creator
   - current user has no permission
8. Make sure npm run build works.
```

---

## Prompt 12 — Polish UI and navigation

```text
Polish the whole frontend UI.

Requirements:
1. Make the UI consistent across all pages.
2. Use a Chinese state-owned enterprise / government enterprise management platform style:
   - deep blue header/sidebar
   - white content cards
   - compact tables
   - formal typography
   - clear borders
   - minimal rounded corners
   - red/gold accents only for important states
3. Improve AppLayout:
   - active sidebar item
   - logout button
   - current user display
4. Add reusable UI components:
   - Button
   - Input
   - Select
   - Textarea
   - Modal
   - Card
   - Badge
   - PageHeader
   - EmptyState
   - LoadingState
   - ErrorState
5. Replace repeated raw HTML with reusable components.
6. Ensure all pages are responsive enough for desktop and laptop screens.
7. Do not over-design. Prioritize professional and functional.
8. Make sure npm run build works.
```

---

## Prompt 13 — Final integration test and cleanup

```text
Perform final frontend integration cleanup.

Requirements:
1. Check all API endpoints match api-documentation.md exactly.
2. Check all protected requests include Authorization: Bearer token.
3. Check login/register flow.
4. Check dashboard statistics.
5. Check project list/detail.
6. Check task CRUD.
7. Check risk CRUD.
8. Check progress report CRUD.
9. Check document upload/download/delete.
10. Check project member registration.
11. Remove unused files, unused imports, and console logs.
12. Add basic README frontend instructions:
    - install dependencies
    - run dev server
    - backend base URL
    - environment variable example
13. Replace hardcoded API base URL with:
    VITE_API_BASE_URL=http://localhost:8080
14. Make npm run build pass without TypeScript errors.
```

Use this order. It follows your planned frontend implementation sequence: login/register first, then dashboard and project pages, then tasks/risks/reports UI.
