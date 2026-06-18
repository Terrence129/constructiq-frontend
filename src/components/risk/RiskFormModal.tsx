import { useState, type FormEvent, type ReactNode } from 'react'
import {
  RiskCategory,
  RiskStatus,
  type Risk,
  type RiskRequest,
} from '../../types'

interface RiskFormState {
  title: string
  description: string
  category: RiskCategory
  probability: number
  impact: number
  status: RiskStatus
  mitigationPlan: string
  owner: string
  targetDate: string
}

interface RiskFormModalProps {
  errorMessage: string | null
  isSubmitting: boolean
  onClose: () => void
  onSubmit: (request: RiskRequest) => void
  risk?: Risk
}

const initialFormState: RiskFormState = {
  title: '',
  description: '',
  category: RiskCategory.GENERAL,
  probability: 1,
  impact: 1,
  status: RiskStatus.OPEN,
  mitigationPlan: '',
  owner: '',
  targetDate: '',
}

export function RiskFormModal({
  errorMessage,
  isSubmitting,
  onClose,
  onSubmit,
  risk,
}: RiskFormModalProps) {
  const [form, setForm] = useState<RiskFormState>(() =>
    risk
      ? {
          title: risk.title,
          description: risk.description ?? '',
          category: risk.category,
          probability: risk.probability,
          impact: risk.impact,
          status: risk.status,
          mitigationPlan: risk.mitigationPlan ?? '',
          owner: risk.owner ?? '',
          targetDate: risk.targetDate ?? '',
        }
      : initialFormState,
  )

  function updateField<Key extends keyof RiskFormState>(
    key: Key,
    value: RiskFormState[Key],
  ) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit(toRiskRequest(form))
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-gray-950/50 px-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto border border-gray-300 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 bg-ci-blue-950 px-5 py-4 text-white">
          <div>
            <h2 className="text-base font-semibold">
              {risk ? 'Edit Risk' : 'Create Risk'}
            </h2>
            <p className="mt-1 text-xs text-blue-100">
              Severity and risk level are calculated by the backend.
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
            <FormField label="Category">
              <select
                className="h-10 w-full border border-gray-300 px-3 outline-none focus:border-ci-blue-800"
                value={form.category}
                onChange={(event) =>
                  updateField('category', event.target.value as RiskCategory)
                }
              >
                {Object.values(RiskCategory).map((category) => (
                  <option key={category} value={category}>
                    {formatEnumLabel(category)}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Probability">
              <NumberSelect
                value={form.probability}
                onChange={(value) => updateField('probability', value)}
              />
            </FormField>
            <FormField label="Impact">
              <NumberSelect
                value={form.impact}
                onChange={(value) => updateField('impact', value)}
              />
            </FormField>
            <FormField label="Status">
              <select
                className="h-10 w-full border border-gray-300 px-3 outline-none focus:border-ci-blue-800"
                value={form.status}
                onChange={(event) =>
                  updateField('status', event.target.value as RiskStatus)
                }
              >
                {Object.values(RiskStatus).map((status) => (
                  <option key={status} value={status}>
                    {formatEnumLabel(status)}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Owner">
              <input
                className="h-10 w-full border border-gray-300 px-3 outline-none focus:border-ci-blue-800"
                value={form.owner}
                onChange={(event) => updateField('owner', event.target.value)}
              />
            </FormField>
            <FormField label="Target Date">
              <input
                className="h-10 w-full border border-gray-300 px-3 outline-none focus:border-ci-blue-800"
                type="date"
                value={form.targetDate}
                onChange={(event) => updateField('targetDate', event.target.value)}
              />
            </FormField>
          </div>

          <FormField label="Description">
            <textarea
              className="min-h-20 w-full border border-gray-300 px-3 py-2 outline-none focus:border-ci-blue-800"
              value={form.description}
              onChange={(event) => updateField('description', event.target.value)}
            />
          </FormField>

          <FormField label="Mitigation Plan">
            <textarea
              className="min-h-20 w-full border border-gray-300 px-3 py-2 outline-none focus:border-ci-blue-800"
              value={form.mitigationPlan}
              onChange={(event) =>
                updateField('mitigationPlan', event.target.value)
              }
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
              {isSubmitting ? 'Saving...' : risk ? 'Save Changes' : 'Create Risk'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function NumberSelect({
  onChange,
  value,
}: {
  onChange: (value: number) => void
  value: number
}) {
  return (
    <select
      className="h-10 w-full border border-gray-300 px-3 outline-none focus:border-ci-blue-800"
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
    >
      {[1, 2, 3, 4, 5].map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
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

function toRiskRequest(form: RiskFormState): RiskRequest {
  return {
    title: form.title.trim(),
    description: optionalString(form.description),
    category: form.category,
    probability: form.probability,
    impact: form.impact,
    status: form.status,
    mitigationPlan: optionalString(form.mitigationPlan),
    owner: optionalString(form.owner),
    targetDate: optionalString(form.targetDate),
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
