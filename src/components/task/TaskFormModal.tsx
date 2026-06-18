import { useState, type FormEvent, type ReactNode } from 'react'
import { TaskPriority, TaskStatus, type Task, type TaskRequest } from '../../types'

interface TaskFormState {
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  assignee: string
  dueDate: string
}

interface TaskFormModalProps {
  errorMessage: string | null
  isSubmitting: boolean
  onClose: () => void
  onSubmit: (request: TaskRequest) => void
  task?: Task
}

const initialFormState: TaskFormState = {
  title: '',
  description: '',
  status: TaskStatus.TODO,
  priority: TaskPriority.MEDIUM,
  assignee: '',
  dueDate: '',
}

export function TaskFormModal({
  errorMessage,
  isSubmitting,
  onClose,
  onSubmit,
  task,
}: TaskFormModalProps) {
  const [form, setForm] = useState<TaskFormState>(() =>
    task
      ? {
          title: task.title,
          description: task.description ?? '',
          status: task.status,
          priority: task.priority,
          assignee: task.assignee ?? '',
          dueDate: task.dueDate ?? '',
        }
      : initialFormState,
  )

  function updateField<Key extends keyof TaskFormState>(
    key: Key,
    value: TaskFormState[Key],
  ) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit(toTaskRequest(form))
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-gray-950/50 px-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto border border-gray-300 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 bg-ci-blue-950 px-5 py-4 text-white">
          <div>
            <h2 className="text-base font-semibold">
              {task ? 'Edit Task' : 'Create Task'}
            </h2>
            <p className="mt-1 text-xs text-blue-100">
              Task changes require project creator or manager access.
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

          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Title">
              <input
                className="h-10 w-full border border-gray-300 px-3 outline-none focus:border-ci-blue-800"
                required
                value={form.title}
                onChange={(event) => updateField('title', event.target.value)}
              />
            </FormField>
            <FormField label="Assignee">
              <input
                className="h-10 w-full border border-gray-300 px-3 outline-none focus:border-ci-blue-800"
                value={form.assignee}
                onChange={(event) => updateField('assignee', event.target.value)}
              />
            </FormField>
            <FormField label="Status">
              <select
                className="h-10 w-full border border-gray-300 px-3 outline-none focus:border-ci-blue-800"
                value={form.status}
                onChange={(event) =>
                  updateField('status', event.target.value as TaskStatus)
                }
              >
                {Object.values(TaskStatus).map((status) => (
                  <option key={status} value={status}>
                    {formatEnumLabel(status)}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Priority">
              <select
                className="h-10 w-full border border-gray-300 px-3 outline-none focus:border-ci-blue-800"
                value={form.priority}
                onChange={(event) =>
                  updateField('priority', event.target.value as TaskPriority)
                }
              >
                {Object.values(TaskPriority).map((priority) => (
                  <option key={priority} value={priority}>
                    {formatEnumLabel(priority)}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Due Date">
              <input
                className="h-10 w-full border border-gray-300 px-3 outline-none focus:border-ci-blue-800"
                type="date"
                value={form.dueDate}
                onChange={(event) => updateField('dueDate', event.target.value)}
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
              {isSubmitting ? 'Saving...' : task ? 'Save Changes' : 'Create Task'}
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

function toTaskRequest(form: TaskFormState): TaskRequest {
  return {
    title: form.title.trim(),
    description: optionalString(form.description),
    status: form.status,
    priority: form.priority,
    assignee: optionalString(form.assignee),
    dueDate: optionalString(form.dueDate),
  }
}

function optionalString(value: string): string | undefined {
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

function formatEnumLabel(value: string): string {
  return value
    .split('_')
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(' ')
}
