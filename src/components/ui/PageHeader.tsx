interface PageHeaderProps {
  title: string
  eyebrow?: string
  description?: string
  action?: string
}

export function PageHeader({
  title,
  eyebrow,
  description,
  action,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-gray-200 bg-white px-6 py-5 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow ? (
          <div className="mb-1 text-xs font-semibold text-ci-red-700">
            {eyebrow}
          </div>
        ) : null}
        <h1 className="text-2xl font-semibold text-gray-950">{title}</h1>
        {description ? (
          <p className="mt-2 text-sm text-gray-500">{description}</p>
        ) : null}
      </div>
      {action ? (
        <button className="h-9 rounded bg-ci-blue-800 px-4 text-sm font-medium text-white shadow-sm hover:bg-ci-blue-900">
          {action}
        </button>
      ) : null}
    </div>
  )
}
