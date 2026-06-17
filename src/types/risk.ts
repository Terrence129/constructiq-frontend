export type RiskCategory =
  | 'SAFETY'
  | 'SCHEDULE'
  | 'COST'
  | 'QUALITY'
  | 'DESIGN'
  | 'PROCUREMENT'
  | 'ENVIRONMENT'
  | 'LEGAL'
  | 'GENERAL'

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type RiskStatus = 'OPEN' | 'MITIGATING' | 'MONITORING' | 'CLOSED'

export interface Risk {
  id: number
  projectId: number
  projectName: string
  title: string
  category: RiskCategory
  probability: number
  impact: number
  severity: number
  riskLevel: RiskLevel
  status: RiskStatus
  owner?: string
  targetDate?: string
}
