import type { ReactNode } from 'react'

interface SectionCardProps {
  title: string
  children: ReactNode
  toolbar?: ReactNode
}

export function SectionCard({ title, children, toolbar }: SectionCardProps) {
  return (
    <section className="border border-gray-200 bg-white">
      <div className="flex min-h-11 items-center justify-between border-b border-gray-200 bg-gray-50 px-4">
        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
        {toolbar ? <div>{toolbar}</div> : null}
      </div>
      <div>{children}</div>
    </section>
  )
}
