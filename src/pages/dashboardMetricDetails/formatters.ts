import axios from 'axios'
import dayjs from 'dayjs'
import type { ErrorResponse } from '../../types'

export function formatNullable(value: string | null): string {
  return value ?? '-'
}

export function formatDateTime(value: string): string {
  const formatted = dayjs(value).format('YYYY-MM-DD HH:mm')

  return formatted === 'Invalid Date' ? value : formatted
}

export function formatEnumLabel(value: string): string {
  return value
    .split('_')
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(' ')
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ErrorResponse>(error)) {
    return error.response?.data.message ?? error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Please verify the backend service is running and try again.'
}
