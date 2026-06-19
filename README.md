# ConstructIQ Frontend

React, TypeScript, Vite, TailwindCSS, React Router, Axios, and TanStack Query frontend for the ConstructIQ construction project management platform.

The UI is a formal enterprise dashboard for project registry, project detail workflows, member management, tasks, risks, progress reports, documents, dashboard statistics, and authentication.

## Tech Stack

- React 19
- TypeScript
- Vite
- TailwindCSS 4
- React Router
- Axios
- TanStack Query
- Day.js
- ESLint

## Prerequisites

- Node.js and npm
- ConstructIQ backend running at `http://localhost:8080`

The API base URL is currently configured in [src/api/axios.ts](src/api/axios.ts):

```ts
baseURL: 'http://localhost:8080'
```

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Run lint:

```bash
npm run lint
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```text
src
|-- api
|   |-- authApi.ts
|   |-- axios.ts
|   |-- dashboardApi.ts
|   |-- documentApi.ts
|   |-- projectApi.ts
|   |-- registrationApi.ts
|   |-- reportApi.ts
|   |-- riskApi.ts
|   |-- taskApi.ts
|   `-- userApi.ts
|-- components
|   |-- document
|   |-- layout
|   |-- project
|   |-- report
|   |-- risk
|   |-- task
|   `-- ui
|-- hooks
|-- pages
|-- router
|-- types
|-- App.tsx
|-- index.css
`-- main.tsx
```

## API Layer

The API layer lives in `src/api` and follows `docs/api-documentation.md`.

- `axios.ts`: shared Axios client, JWT request interceptor, and 401 redirect handling.
- `authApi.ts`: login, register, logout, local auth persistence helpers.
- `dashboardApi.ts`: live statistics and dashboard snapshot endpoints.
- `projectApi.ts`: project list, create, detail, update, delete.
- `registrationApi.ts`: project member registration list, add, delete.
- `userApi.ts`: user list/search and user detail for member selection.
- `taskApi.ts`: project task CRUD.
- `riskApi.ts`: project risk CRUD.
- `reportApi.ts`: progress report list, create, detail, update, delete.
- `documentApi.ts`: document list, upload, metadata, download, delete.

## Routing

Routes are configured in [src/router/index.tsx](src/router/index.tsx).

- `/login`
- `/register`
- `/dashboard`
- `/projects`
- `/projects/:projectId`
- `/tasks`
- `/risks`
- `/reports`
- `/documents`
- `/ai-analysis`

Authenticated application routes are wrapped by `ProtectedRoute`.

## Implemented Features

- JWT login/register flow
- Protected routes
- Enterprise app layout with header/sidebar/content shell
- Dashboard statistics with snapshot actions
- Project list, search, status filter, and project creation
- Initial member selection during project creation
- Project detail page with tabs
- Project member management with searchable user selection
- Task CRUD inside project detail
- Risk CRUD and risk matrix inside project detail
- Progress report CRUD and detail viewing inside project detail
- Document upload, metadata, download, and delete inside project detail

## Type Contracts

Backend response and request types live in `src/types`.

- `auth.ts`
- `common.ts`
- `dashboard.ts`
- `document.ts`
- `project.ts`
- `report.ts`
- `risk.ts`
- `task.ts`

Enums are defined for backend enum fields such as `UserRole`, `ProjectStatus`, `ProjectMemberRole`, `TaskStatus`, `TaskPriority`, `RiskCategory`, `RiskLevel`, and `RiskStatus`.

## Authentication Storage

Authentication state is persisted in localStorage:

- token key: `constructiq_token`
- user key: `constructiq_user`

The Axios client sends authenticated requests as:

```http
Authorization: Bearer <token>
```

On a `401` response, the token and user are removed and the browser redirects to `/login`.

## Notes

- Backend runtime testing requires the ConstructIQ backend to be running locally.
- Current frontend API base URL is fixed to `http://localhost:8080`.
