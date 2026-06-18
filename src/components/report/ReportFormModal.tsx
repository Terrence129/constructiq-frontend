import { useState, type FormEvent, type ReactNode } from 'react'
import type { CreateProgressReportRequest, ProgressReport } from '../../types'

interface ReportFormState {
  reportDate: string
  summary: string
  completedWork: string
  delayedWork: string
  issues: string
  nextActions: string
}

interface ReportFormModalProps {
  errorMessage: string | null
  isSubmitting: boolean
  onClose: () => void
  onSubmit: (request: CreateProgressReportRequest) => void
  report?: ProgressReport
}

const initialFormState: ReportFormState = {
  reportDate: '',
  summary: '',
  completedWork: '',
  delayedWork: '',
  issues: '',
  nextActions: '',
}

export function ReportFormModal({
  errorMessage,
  isSubmitting,
  onClose,
  onSubmit,
  report,
}: ReportFormModalProps) {
  const [form, setForm] = useState<ReportFormState>(() =>
    report
      ? {
          reportDate: report.reportDate,
          summary: report.summary,
          completedWork: report.completedWork ?? '',
          delayedWork: report.delayedWork ?? '',
          issues: report.issues ?? '',
          nextActions: report.nextActions ?? '',
        }
      : initialFormState,
  )

  function updateField<Key extends keyof ReportFormState>(
    key: Key,
    value: ReportFormState[Key],
  ) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit(toReportRequest(form))
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-gray-950/50 px-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto border border-gray-300 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 bg-ci-blue-950 px-5 py-4 text-white">
          <div>
            <h2 className="text-base font-semibold">
              {report ? 'Edit Progress Report' : 'Create Progress Report'}
            </h2>
            <p className="mt-1 text-xs text-blue-100">
              Use detailed work notes for downstream project reporting and AI
              summaries.
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

          <div className="grid gap-4 md:grid-cols-[220px_1fr]">
            <FormField label="Report Date">
              <input
                className="h-10 w-full border border-gray-300 px-3 outline-none focus:border-ci-blue-800"
                required
                type="date"
                value={form.reportDate}
                onChange={(event) => updateField('reportDate', event.target.value)}
              />
            </FormField>
            <FormField label="Summary">
              <input
                className="h-10 w-full border border-gray-300 px-3 outline-none focus:border-ci-blue-800"
                required
                value={form.summary}
                onChange={(event) => updateField('summary', event.target.value)}
              />
            </FormField>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <FormField label="Completed Work">
              <textarea
                className="min-h-36 w-full border border-gray-300 px-3 py-2 outline-none focus:border-ci-blue-800"
                value={form.completedWork}
                onChange={(event) =>
                  updateField('completedWork', event.target.value)
                }
              />
            </FormField>
            <FormField label="Delayed Work">
              <textarea
                className="min-h-36 w-full border border-gray-300 px-3 py-2 outline-none focus:border-ci-blue-800"
                value={form.delayedWork}
                onChange={(event) => updateField('delayedWork', event.target.value)}
              />
            </FormField>
            <FormField label="Issues">
              <textarea
                className="min-h-36 w-full border border-gray-300 px-3 py-2 outline-none focus:border-ci-blue-800"
                value={form.issues}
                onChange={(event) => updateField('issues', event.target.value)}
              />
            </FormField>
            <FormField label="Next Actions">
              <textarea
                className="min-h-36 w-full border border-gray-300 px-3 py-2 outline-none focus:border-ci-blue-800"
                value={form.nextActions}
                onChange={(event) => updateField('nextActions', event.target.value)}
              />
            </FormField>
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
              {isSubmitting
                ? 'Saving...'
                : report
                  ? 'Save Changes'
                  : 'Create Report'}
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

function toReportRequest(
  form: ReportFormState,
): CreateProgressReportRequest {
  return {
    reportDate: form.reportDate,
    summary: form.summary.trim(),
    completedWork: optionalString(form.completedWork),
    delayedWork: optionalString(form.delayedWork),
    issues: optionalString(form.issues),
    nextActions: optionalString(form.nextActions),
  }
}

function optionalString(value: string): string | undefined {
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}
