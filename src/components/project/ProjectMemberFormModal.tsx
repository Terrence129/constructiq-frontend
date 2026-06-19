import { useState, type FormEvent, type ReactNode } from 'react'
import {
  ProjectMemberRole,
  type ProjectRegistrationRequest,
  type User,
} from '../../types'
import { UserSearchSelect } from './UserSearchSelect'

interface ProjectMemberFormState {
  title: string
  description: string
  role: ProjectMemberRole
}

interface ProjectMemberFormModalProps {
  errorMessage: string | null
  excludedUserIds?: number[]
  isSubmitting: boolean
  onClose: () => void
  onSubmit: (request: ProjectRegistrationRequest) => void
}

const initialFormState: ProjectMemberFormState = {
  title: '',
  description: '',
  role: ProjectMemberRole.MEMBER,
}

export function ProjectMemberFormModal({
  errorMessage,
  excludedUserIds = [],
  isSubmitting,
  onClose,
  onSubmit,
}: ProjectMemberFormModalProps) {
  const [form, setForm] = useState<ProjectMemberFormState>(initialFormState)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  function updateField<Key extends keyof ProjectMemberFormState>(
    key: Key,
    value: ProjectMemberFormState[Key],
  ) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!selectedUser) {
      return
    }

    onSubmit({
      userId: selectedUser.id,
      title: optionalString(form.title),
      description: optionalString(form.description),
      role: form.role,
    })
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-gray-950/50 px-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-gray-300 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 bg-ci-blue-950 px-5 py-4 text-white">
          <div>
            <h2 className="text-base font-semibold">Add Project Member</h2>
            <p className="mt-1 text-xs text-blue-100">
              Members can access project data. Managers can manage project data.
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
          {errorMessage ? (
            <div className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-ci-red-700">
              {errorMessage}
            </div>
          ) : null}

          <FormField label="User Selection">
            <UserSearchSelect
              excludedUserIds={excludedUserIds}
              selectedUser={selectedUser}
              onSelect={setSelectedUser}
            />
          </FormField>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Role">
              <select
                className="h-10 w-full border border-gray-300 px-3 outline-none focus:border-ci-blue-800"
                value={form.role}
                onChange={(event) =>
                  updateField('role', event.target.value as ProjectMemberRole)
                }
              >
                <option value={ProjectMemberRole.MEMBER}>Member</option>
                <option value={ProjectMemberRole.MANAGER}>Manager</option>
              </select>
            </FormField>
            <FormField label="Title">
              <input
                className="h-10 w-full border border-gray-300 px-3 outline-none focus:border-ci-blue-800"
                value={form.title}
                onChange={(event) => updateField('title', event.target.value)}
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
              disabled={isSubmitting || !selectedUser}
              type="submit"
            >
              {isSubmitting ? 'Adding...' : 'Add Member'}
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

function optionalString(value: string): string | undefined {
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}
