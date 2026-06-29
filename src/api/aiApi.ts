import { apiClient } from './axios'
import type {
  AiAdviceRequest,
  AiAdviceResponse,
  AiChatRequest,
  AiChatResponse,
} from '../types'

export async function sendAiChatMessage(
  request: AiChatRequest,
): Promise<AiChatResponse> {
  const { data } = await apiClient.post<AiChatResponse>('/api/ai/chat', request)

  return data
}

export async function generateAiAdvice(
  request: AiAdviceRequest,
): Promise<AiAdviceResponse> {
  const { data } = await apiClient.post<AiAdviceResponse>(
    '/api/ai/advice',
    request,
  )

  return data
}
