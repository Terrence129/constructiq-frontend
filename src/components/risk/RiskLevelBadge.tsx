import { RiskLevel } from '../../types'

const labelMap: Record<RiskLevel, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical',
}

export function RiskLevelBadge({ level }: { level: RiskLevel }) {
  const strong = level === RiskLevel.HIGH || level === RiskLevel.CRITICAL

  return (
    <span
      className={`inline-flex rounded-sm border px-2 py-0.5 text-xs font-semibold ${
        strong
          ? 'border-ci-red-700 bg-red-50 text-ci-red-700'
          : 'border-ci-gold-500 bg-yellow-50 text-yellow-800'
      }`}
    >
      {labelMap[level]}
    </span>
  )
}
