interface MetricCardProps {
  label: string
  value: string
  detail: string
  accent?: 'blue' | 'red' | 'gold'
}

const accentClass = {
  blue: 'border-l-ci-blue-800',
  red: 'border-l-ci-red-700',
  gold: 'border-l-ci-gold-500',
}

export function MetricCard({
  label,
  value,
  detail,
  accent = 'blue',
}: MetricCardProps) {
  return (
    <div className={`border border-l-4 border-gray-200 bg-white p-4 ${accentClass[accent]}`}>
      <div className="text-xs font-medium text-gray-500">{label}</div>
      <div className="mt-2 text-3xl font-semibold text-gray-950">{value}</div>
      <div className="mt-2 text-xs text-gray-500">{detail}</div>
    </div>
  )
}
