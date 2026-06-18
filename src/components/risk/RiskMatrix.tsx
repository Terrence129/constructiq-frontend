import { Fragment } from 'react'
import type { Risk } from '../../types'

interface RiskMatrixProps {
  risks: Risk[]
}

export function RiskMatrix({ risks }: RiskMatrixProps) {
  const probabilities = [5, 4, 3, 2, 1]
  const impacts = [1, 2, 3, 4, 5]

  return (
    <div className="p-4">
      <div className="mb-3 text-sm text-gray-600">
        Severity = probability x impact. Cell count shows registered risks in
        that band.
      </div>
      <div className="grid grid-cols-[56px_repeat(5,minmax(56px,1fr))] gap-1 text-xs">
        <div />
        {impacts.map((impact) => (
          <div
            className="bg-gray-100 px-2 py-2 text-center font-semibold text-gray-700"
            key={impact}
          >
            I{impact}
          </div>
        ))}
        {probabilities.map((probability) => (
          <Fragment key={probability}>
            <div
              className="bg-gray-100 px-2 py-4 text-center font-semibold text-gray-700"
            >
              P{probability}
            </div>
            {impacts.map((impact) => {
              const severity = probability * impact
              const riskCount = risks.filter(
                (risk) =>
                  risk.probability === probability && risk.impact === impact,
              ).length

              return (
                <div
                  className={`min-h-16 border border-white p-2 text-center font-semibold ${getSeverityClass(
                    severity,
                  )}`}
                  key={`${probability}-${impact}`}
                  title={`Probability ${probability}, impact ${impact}, severity ${severity}`}
                >
                  <div>{severity}</div>
                  <div className="mt-1 text-[11px] font-medium">
                    {riskCount} risks
                  </div>
                </div>
              )
            })}
          </Fragment>
        ))}
      </div>
    </div>
  )
}

function getSeverityClass(severity: number): string {
  if (severity >= 16) {
    return 'bg-red-100 text-ci-red-700'
  }

  if (severity >= 11) {
    return 'bg-orange-100 text-orange-800'
  }

  if (severity >= 6) {
    return 'bg-yellow-100 text-yellow-800'
  }

  return 'bg-slate-100 text-slate-700'
}
