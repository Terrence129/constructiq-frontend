import type { ProgressReport } from '../../types'
import { SectionCard } from '../ui/SectionCard'
import dayjs from "dayjs";

interface ReportDetailCardProps {
  report: ProgressReport
}

export function ReportDetailCard({ report }: ReportDetailCardProps) {
    const updatedAt = dayjs(report.updatedAt).format("YYYY-MM-DD HH:mm")
  return (
    <SectionCard title="Report Detail">
      <div className="grid gap-4 p-4 text-sm md:grid-cols-3">
        <DetailField label="Report Date" value={report.reportDate} />
        <DetailField label="Project" value={report.projectName} />
        <DetailField label="Created By" value={report.createdByName} />
        <DetailField label="Created At" value={dayjs(report.createdAt)
            .format("YYYY-MM-DD HH:mm")} />
        <DetailField label="Updated At" value={updatedAt !== "Invalid Date" ? updatedAt : "-"} />
      </div>
      <div className="grid gap-4 border-t border-gray-200 p-4 lg:grid-cols-2">
        <ContentBlock label="Summary" value={report.summary} />
        <ContentBlock label="Completed Work" value={report.completedWork} />
        <ContentBlock label="Delayed Work" value={report.delayedWork} />
        <ContentBlock label="Issues" value={report.issues} />
        <ContentBlock label="Next Actions" value={report.nextActions} />
      </div>
    </SectionCard>
  )
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-l-4 border-ci-blue-800 bg-blue-50 px-3 py-2">
      <div className="text-xs font-semibold text-gray-500">{label}</div>
      <div className="mt-1 break-words font-medium text-gray-900">{value}</div>
    </div>
  )
}

function ContentBlock({
  label,
  value,
}: {
  label: string
  value: string | null
}) {
  return (
    <div className="border border-gray-200 bg-white p-3">
      <div className="text-xs font-semibold uppercase text-gray-500">{label}</div>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-700">
        {value ?? '-'}
      </p>
    </div>
  )
}
