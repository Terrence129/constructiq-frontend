export enum RiskCategory {
  SAFETY = 'SAFETY',
  SCHEDULE = 'SCHEDULE',
  COST = 'COST',
  QUALITY = 'QUALITY',
  DESIGN = 'DESIGN',
  PROCUREMENT = 'PROCUREMENT',
  ENVIRONMENT = 'ENVIRONMENT',
  LEGAL = 'LEGAL',
  GENERAL = 'GENERAL',
}

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum RiskStatus {
  OPEN = 'OPEN',
  MITIGATING = 'MITIGATING',
  MONITORING = 'MONITORING',
  CLOSED = 'CLOSED',
}

export interface Risk {
  id: number
  projectId: number
  projectName: string
  title: string
  description: string | null
  category: RiskCategory
  probability: number
  impact: number
  severity: number
  riskLevel: RiskLevel
  status: RiskStatus
  mitigationPlan: string | null
  owner: string | null
  targetDate: string | null
  createdById: number
  createdByName: string
  createdAt: string
  updatedAt: string | null
}

export interface RiskRequest {
  title: string
  description?: string
  category?: RiskCategory
  probability: number
  impact: number
  status?: RiskStatus
  mitigationPlan?: string
  owner?: string
  targetDate?: string
}
