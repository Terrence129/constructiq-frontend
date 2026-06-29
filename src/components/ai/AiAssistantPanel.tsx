import { useMemo, useState, type FormEvent } from 'react'
import axios from 'axios'
import { useMutation, useQuery } from '@tanstack/react-query'
import { generateAiAdvice, sendAiChatMessage } from '../../api/aiApi'
import { getProjects } from '../../api/projectApi'
import { SectionCard } from '../ui/SectionCard'
import { formatDateToMin } from '../../utils/dateUtils'
import type {
  AiAdviceResponse,
  AiChatHistoryMessage,
  AiContextSource,
  ErrorResponse,
} from '../../types'

const ALL_PROJECTS_VALUE = 'ALL'
const HISTORY_LIMIT = 10
const MESSAGE_MAX_LENGTH = 4000
const FOCUS_MAX_LENGTH = 1000

interface AiAssistantPanelProps {
  initialProjectId?: number
  lockProjectSelection?: boolean
  projectName?: string
}

interface ChatTranscriptMessage extends AiChatHistoryMessage {
  id: string
  generatedAt?: string
  chatModel?: string
  embedModel?: string
  contextCount?: number
}

interface LatestAiMeta {
  label: string
  generatedAt: string
  chatModel: string
  embedModel: string
}

export function AiAssistantPanel({
  initialProjectId,
  lockProjectSelection = false,
  projectName,
}: AiAssistantPanelProps) {
  const [projectSelectionValue, setProjectSelectionValue] = useState(
    initialProjectId ? String(initialProjectId) : ALL_PROJECTS_VALUE,
  )
  const [chatInput, setChatInput] = useState('')
  const [adviceFocus, setAdviceFocus] = useState('')
  const [chatMessages, setChatMessages] = useState<ChatTranscriptMessage[]>([])
  const [adviceResponse, setAdviceResponse] =
    useState<AiAdviceResponse | null>(null)
  const [latestContext, setLatestContext] = useState<AiContextSource[]>([])
  const [latestMeta, setLatestMeta] = useState<LatestAiMeta | null>(null)
  const [chatValidationError, setChatValidationError] = useState<string | null>(
    null,
  )
  const [adviceValidationError, setAdviceValidationError] = useState<
    string | null
  >(null)

  const {
    data: projects = [],
    error: projectError,
    isError: isProjectError,
    isLoading: isProjectLoading,
  } = useQuery({
    enabled: !lockProjectSelection,
    queryKey: ['projects'],
    queryFn: getProjects,
  })

  const selectedProjectValue =
    lockProjectSelection && initialProjectId
      ? String(initialProjectId)
      : projectSelectionValue

  const selectedProjectId = useMemo(() => {
    if (selectedProjectValue === ALL_PROJECTS_VALUE) {
      return undefined
    }

    const parsedProjectId = Number(selectedProjectValue)
    return Number.isInteger(parsedProjectId) && parsedProjectId > 0
      ? parsedProjectId
      : undefined
  }, [selectedProjectValue])

  const selectedProjectName = useMemo(() => {
    if (lockProjectSelection) {
      return projectName ?? `Project ${initialProjectId ?? ''}`.trim()
    }

    if (!selectedProjectId) {
      return 'All accessible projects'
    }

    return (
      projects.find((project) => project.id === selectedProjectId)?.name ??
      `Project ${selectedProjectId}`
    )
  }, [
    initialProjectId,
    lockProjectSelection,
    projectName,
    projects,
    selectedProjectId,
  ])

  const chatMutation = useMutation({
    mutationFn: sendAiChatMessage,
    onSuccess: (response, request) => {
      const submittedAt = new Date().toISOString()

      setChatMessages((currentMessages) => [
        ...currentMessages,
        {
          id: `${submittedAt}-user-${currentMessages.length}`,
          role: 'user',
          content: request.message,
          generatedAt: submittedAt,
        },
        {
          id: `${response.generatedAt}-assistant-${currentMessages.length}`,
          role: 'assistant',
          content: response.answer,
          generatedAt: response.generatedAt,
          chatModel: response.chatModel,
          embedModel: response.embedModel,
          contextCount: response.context.length,
        },
      ])
      setLatestContext(response.context)
      setLatestMeta({
        label: 'Chat answer',
        generatedAt: response.generatedAt,
        chatModel: response.chatModel,
        embedModel: response.embedModel,
      })
      setChatInput('')
      setChatValidationError(null)
    },
  })

  const adviceMutation = useMutation({
    mutationFn: generateAiAdvice,
    onSuccess: (response) => {
      setAdviceResponse(response)
      setLatestContext(response.context)
      setLatestMeta({
        label: 'Project advice',
        generatedAt: response.generatedAt,
        chatModel: response.chatModel,
        embedModel: response.embedModel,
      })
      setAdviceValidationError(null)
    },
  })

  function handleProjectChange(value: string) {
    setProjectSelectionValue(value)
    setLatestContext([])
    setLatestMeta(null)
    setAdviceResponse(null)
    setChatMessages([])
    chatMutation.reset()
    adviceMutation.reset()
  }

  function handleSubmitChat(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    chatMutation.reset()

    const message = chatInput.trim()
    if (!message) {
      setChatValidationError('Enter a question before sending.')
      return
    }

    if (message.length > MESSAGE_MAX_LENGTH) {
      setChatValidationError(
        `Questions must be ${MESSAGE_MAX_LENGTH} characters or fewer.`,
      )
      return
    }

    const history = chatMessages
      .map(({ content, role }) => ({ content, role }))
      .slice(-HISTORY_LIMIT)

    chatMutation.mutate({
      message,
      projectId: selectedProjectId,
      history: history.length > 0 ? history : undefined,
    })
  }

  function handleGenerateAdvice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    adviceMutation.reset()

    const focus = adviceFocus.trim()
    if (focus.length > FOCUS_MAX_LENGTH) {
      setAdviceValidationError(
        `Advice focus must be ${FOCUS_MAX_LENGTH} characters or fewer.`,
      )
      return
    }

    adviceMutation.mutate({
      projectId: selectedProjectId,
      focus: focus.length > 0 ? focus : undefined,
    })
  }

  function resetChat() {
    setChatMessages([])
    setChatInput('')
    setChatValidationError(null)
    chatMutation.reset()
  }

  const historyCount = Math.min(chatMessages.length, HISTORY_LIMIT)

  return (
    <div className="space-y-5">
      <SectionCard
        title="AI Scope"
        toolbar={
          chatMessages.length > 0 ? (
            <button
              className="h-8 border border-gray-300 px-3 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              onClick={resetChat}
              type="button"
            >
              New Chat
            </button>
          ) : null
        }
      >
        <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-3">
            {lockProjectSelection ? (
              <div>
                <div className="mb-1 text-sm font-medium text-gray-700">
                  Project Scope
                </div>
                <div className="border border-gray-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-ci-blue-950">
                  {selectedProjectName}
                </div>
              </div>
            ) : (
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-gray-700">
                  Project Scope
                </span>
                <select
                  className="h-10 w-full border border-gray-300 px-3 outline-none focus:border-ci-blue-800 disabled:bg-gray-100"
                  disabled={isProjectLoading}
                  value={selectedProjectValue}
                  onChange={(event) => handleProjectChange(event.target.value)}
                >
                  <option value={ALL_PROJECTS_VALUE}>
                    All accessible projects
                  </option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </label>
            )}
            {isProjectError ? (
              <div className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-ci-red-700">
                {getAiErrorMessage(projectError)}
              </div>
            ) : null}
          </div>

          <dl className="grid gap-3 text-sm sm:grid-cols-3 lg:grid-cols-1">
            <ScopeMetric label="Active Scope" value={selectedProjectName} />
            <ScopeMetric
              label="History Sent"
              value={`${historyCount}/${HISTORY_LIMIT} messages`}
            />
            <ScopeMetric
              label="Context Sources"
              value={`${latestContext.length} from latest output`}
            />
          </dl>
        </div>
      </SectionCard>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.75fr)]">
        <SectionCard title="Project Chat">
          <div className="flex min-h-[520px] flex-col">
            <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50 p-4">
              {chatMessages.length === 0 ? <EmptyChatState /> : null}
              {chatMessages.map((message) => (
                <ChatMessageBubble key={message.id} message={message} />
              ))}
              {chatMutation.isPending ? <PendingAssistantBubble /> : null}
            </div>

            <form
              className="space-y-3 border-t border-gray-200 bg-white p-4"
              onSubmit={handleSubmitChat}
            >
              <label className="block">
                <span className="mb-1 flex items-center justify-between gap-3 text-sm font-medium text-gray-700">
                  <span>Question</span>
                  <span className="text-xs font-normal text-gray-500">
                    {chatInput.length}/{MESSAGE_MAX_LENGTH}
                  </span>
                </span>
                <textarea
                  className="min-h-28 w-full resize-y border border-gray-300 px-3 py-2 outline-none focus:border-ci-blue-800"
                  maxLength={MESSAGE_MAX_LENGTH}
                  placeholder="Ask about schedule risks, procurement blockers, tasks, reports, or project actions."
                  value={chatInput}
                  onChange={(event) => setChatInput(event.target.value)}
                />
              </label>

              {chatValidationError ? (
                <InlineError message={chatValidationError} />
              ) : null}
              {chatMutation.error ? (
                <InlineError message={getAiErrorMessage(chatMutation.error)} />
              ) : null}

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-xs text-gray-500">
                  The request includes up to the last {HISTORY_LIMIT} user and
                  assistant messages.
                </div>
                <button
                  className="h-10 bg-ci-blue-800 px-5 text-sm font-semibold text-white hover:bg-ci-blue-900 disabled:cursor-not-allowed disabled:bg-gray-400"
                  disabled={chatMutation.isPending || chatInput.trim().length === 0}
                  type="submit"
                >
                  {chatMutation.isPending ? 'Asking...' : 'Ask AI'}
                </button>
              </div>
            </form>
          </div>
        </SectionCard>

        <div className="space-y-5">
          <SectionCard title="Advice">
            <form className="space-y-3 p-4" onSubmit={handleGenerateAdvice}>
              <label className="block">
                <span className="mb-1 flex items-center justify-between gap-3 text-sm font-medium text-gray-700">
                  <span>Focus</span>
                  <span className="text-xs font-normal text-gray-500">
                    {adviceFocus.length}/{FOCUS_MAX_LENGTH}
                  </span>
                </span>
                <textarea
                  className="min-h-24 w-full resize-y border border-gray-300 px-3 py-2 outline-none focus:border-ci-blue-800"
                  maxLength={FOCUS_MAX_LENGTH}
                  placeholder="Example: schedule risk and next actions"
                  value={adviceFocus}
                  onChange={(event) => setAdviceFocus(event.target.value)}
                />
              </label>

              {adviceValidationError ? (
                <InlineError message={adviceValidationError} />
              ) : null}
              {adviceMutation.error ? (
                <InlineError message={getAiErrorMessage(adviceMutation.error)} />
              ) : null}

              <button
                className="h-10 w-full bg-ci-blue-800 px-4 text-sm font-semibold text-white hover:bg-ci-blue-900 disabled:cursor-not-allowed disabled:bg-gray-400"
                disabled={adviceMutation.isPending}
                type="submit"
              >
                {adviceMutation.isPending ? 'Generating...' : 'Generate Advice'}
              </button>
            </form>

            <div className="border-t border-gray-200 p-4">
              {adviceMutation.isPending ? (
                <AdviceLoadingState />
              ) : adviceResponse ? (
                <AdviceResult adviceResponse={adviceResponse} />
              ) : (
                <div className="border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-600">
                  Generated project-management advice will appear here.
                </div>
              )}
            </div>
          </SectionCard>

          <SectionCard title="Model and Context">
            <div className="space-y-4 p-4">
              {latestMeta ? (
                <dl className="grid gap-3 text-sm sm:grid-cols-2 xl:grid-cols-1">
                  <ScopeMetric label="Latest Output" value={latestMeta.label} />
                  <ScopeMetric
                    label="Generated At"
                    value={formatDateToMin(latestMeta.generatedAt)}
                  />
                  <ScopeMetric label="Chat Model" value={latestMeta.chatModel} />
                  <ScopeMetric label="Embedding Model" value={latestMeta.embedModel} />
                </dl>
              ) : (
                <div className="border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-600">
                  Model details and retrieved project context will update after
                  a chat answer or advice response.
                </div>
              )}

              <ContextSourceList context={latestContext} />
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  )
}

function ScopeMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-l-4 border-ci-blue-800 bg-blue-50 px-3 py-2">
      <dt className="text-xs font-semibold text-gray-500">{label}</dt>
      <dd className="mt-1 break-words font-semibold text-gray-900">{value}</dd>
    </div>
  )
}

function ChatMessageBubble({
  message,
}: {
  message: ChatTranscriptMessage
}) {
  const isUser = message.role === 'user'

  return (
    <div
      className={`max-w-[88%] border px-3 py-2 text-sm shadow-sm ${
        isUser
          ? 'ml-auto border-ci-blue-800 bg-ci-blue-800 text-white'
          : 'mr-auto border-gray-200 bg-white text-gray-800'
      }`}
    >
      <div
        className={`mb-1 text-xs font-semibold ${
          isUser ? 'text-blue-100' : 'text-ci-blue-900'
        }`}
      >
        {isUser ? 'You' : 'Assistant'}
      </div>
      <div className="whitespace-pre-wrap break-words leading-6">
        {message.content}
      </div>
      {!isUser ? (
        <div className="mt-2 border-t border-gray-200 pt-2 text-xs text-gray-500">
          {message.chatModel ?? 'AI model'} · {message.contextCount ?? 0}{' '}
          context sources
        </div>
      ) : null}
    </div>
  )
}

function PendingAssistantBubble() {
  return (
    <div className="mr-auto max-w-[88%] border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm">
      <div className="mb-2 text-xs font-semibold text-ci-blue-900">
        Assistant
      </div>
      <div className="space-y-2">
        <div className="h-3 w-48 animate-pulse bg-gray-100" />
        <div className="h-3 w-64 animate-pulse bg-gray-100" />
        <div className="h-3 w-36 animate-pulse bg-gray-100" />
      </div>
    </div>
  )
}

function EmptyChatState() {
  return (
    <div className="flex min-h-[300px] items-center justify-center border border-dashed border-gray-300 bg-white px-4 text-center">
      <div>
        <div className="text-sm font-semibold text-gray-900">
          Ask a project question
        </div>
        <p className="mt-2 max-w-lg text-sm leading-6 text-gray-600">
          Scope the answer to a project or use all accessible project context,
          then ask about risks, delayed work, reports, documents, or next
          actions.
        </p>
      </div>
    </div>
  )
}

function AdviceResult({
  adviceResponse,
}: {
  adviceResponse: AiAdviceResponse
}) {
  return (
    <div className="space-y-3">
      <div className="border-l-4 border-ci-gold-500 bg-yellow-50 px-3 py-3">
        <div className="text-xs font-semibold text-gray-500">
          Generated Advice
        </div>
        <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-gray-900">
          {adviceResponse.advice}
        </p>
      </div>
      <div className="grid gap-3 text-sm sm:grid-cols-2 xl:grid-cols-1">
        <ScopeMetric
          label="Generated At"
          value={formatDateToMin(adviceResponse.generatedAt)}
        />
        <ScopeMetric
          label="Context Sources"
          value={String(adviceResponse.context.length)}
        />
      </div>
    </div>
  )
}

function AdviceLoadingState() {
  return (
    <div className="space-y-2 border border-gray-200 bg-gray-50 p-3">
      <div className="h-3 w-36 animate-pulse bg-gray-200" />
      <div className="h-3 w-full animate-pulse bg-gray-200" />
      <div className="h-3 w-5/6 animate-pulse bg-gray-200" />
      <div className="h-3 w-2/3 animate-pulse bg-gray-200" />
    </div>
  )
}

function ContextSourceList({ context }: { context: AiContextSource[] }) {
  if (context.length === 0) {
    return (
      <div className="border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-600">
        No context sources returned yet.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="text-sm font-semibold text-gray-900">
        Retrieved Context
      </div>
      {context.map((source) => (
        <article
          className="border border-gray-200 bg-white px-3 py-3"
          key={`${source.sourceType}-${source.sourceId}`}
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase text-ci-red-700">
                {formatSourceType(source.sourceType)}
              </div>
              <h3 className="mt-1 text-sm font-semibold text-gray-950">
                {source.title}
              </h3>
            </div>
            <div className="shrink-0 border border-gray-200 bg-gray-50 px-2 py-1 text-xs font-semibold text-gray-700">
              Score {formatScore(source.score)}
            </div>
          </div>
          <dl className="mt-3 grid gap-2 text-xs text-gray-600 sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-gray-500">Project</dt>
              <dd className="mt-0.5 break-words">{source.projectName}</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-500">Source ID</dt>
              <dd className="mt-0.5">{source.sourceId}</dd>
            </div>
          </dl>
          <p className="mt-3 line-clamp-4 whitespace-pre-wrap break-words text-sm leading-6 text-gray-700">
            {source.excerpt}
          </p>
        </article>
      ))}
    </div>
  )
}

function InlineError({ message }: { message: string }) {
  return (
    <div className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-ci-red-700">
      {message}
    </div>
  )
}

function formatSourceType(sourceType: string): string {
  return sourceType
    .split('_')
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(' ')
}

function formatScore(score: number): string {
  return Number.isFinite(score) ? score.toFixed(3) : '-'
}

function getAiErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ErrorResponse>(error)) {
    const backendMessage = error.response?.data.message

    if (error.response?.status === 400) {
      return (
        backendMessage ??
        'Review the message, chat history, or focus length and try again.'
      )
    }

    if (error.response?.status === 403) {
      return (
        backendMessage ??
        'Your account cannot access the selected project context.'
      )
    }

    if (error.response?.status === 404) {
      return backendMessage ?? 'The selected project does not exist.'
    }

    if (error.response?.status === 503) {
      return (
        backendMessage ??
        'The configured AI provider or chat model is unavailable.'
      )
    }

    return backendMessage ?? error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Please verify the backend service is running and try again.'
}
