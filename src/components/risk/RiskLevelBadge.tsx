import { RiskLevel } from '../../types'

const labelMap: Record<RiskLevel, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical',
}

const classMap: Record<RiskLevel, string> = {
  LOW: 'border-slate-400 bg-slate-50 text-slate-700',
  MEDIUM: 'border-yellow-500 bg-yellow-50 text-yellow-800',
  HIGH: 'border-orange-600 bg-orange-50 text-orange-700',
  CRITICAL: 'border-ci-red-700 bg-red-50 text-ci-red-700',
}

export function RiskLevelBadge({ level }: { level: RiskLevel }) {
  return (
    <span
      className={`inline-flex rounded-sm border px-2 py-0.5 text-xs font-semibold ${classMap[level]}`}
    >
      {labelMap[level]}
    </span>
  )
}
