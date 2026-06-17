export function DocumentTypeBadge({ type }: { type: string }) {
  return (
    <span className="inline-flex rounded-sm border border-gray-300 px-2 py-0.5 text-xs text-gray-700">
      {type}
    </span>
  )
}
