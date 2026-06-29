export type AiChatRole = 'user' | 'assistant'

export interface AiChatHistoryMessage {
  role: AiChatRole
  content: string
}

export interface AiContextSource {
  sourceType: string
  sourceId: number
  projectId: number
  projectName: string
  title: string
  score: number
  excerpt: string
}

export interface AiChatRequest {
  message: string
  projectId?: number
  history?: AiChatHistoryMessage[]
}

export interface AiAdviceRequest {
  projectId?: number
  focus?: string
}

export interface AiChatResponse {
  answer: string
  projectId: number | null
  chatModel: string
  embedModel: string
  generatedAt: string
  context: AiContextSource[]
}

export interface AiAdviceResponse {
  advice: string
  projectId: number | null
  chatModel: string
  embedModel: string
  generatedAt: string
  context: AiContextSource[]
}
