import type { AxiosProgressEvent } from 'axios'
import { apiClient } from './axios'
import type { DocumentRecord } from '../types'

export interface DocumentDownload {
  blob: Blob
  fileName: string | null
}

export async function getDocumentsByProject(
  projectId: number,
): Promise<DocumentRecord[]> {
  const { data } = await apiClient.get<DocumentRecord[]>(
    `/api/projects/${projectId}/documents`,
  )

  return data
}

export async function uploadDocument(
  projectId: number,
  file: File,
  onUploadProgress?: (event: AxiosProgressEvent) => void,
): Promise<DocumentRecord> {
  const formData = new FormData()
  formData.append('file', file)

  const { data } = await apiClient.post<DocumentRecord>(
    `/api/projects/${projectId}/documents/upload`,
    formData,
    { onUploadProgress },
  )

  return data
}

export async function getDocumentMetadata(
  documentId: number,
): Promise<DocumentRecord> {
  const { data } = await apiClient.get<DocumentRecord>(
    `/api/documents/${documentId}`,
  )

  return data
}

export async function downloadDocument(
  documentId: number,
): Promise<DocumentDownload> {
  const response = await apiClient.get<Blob>(
    `/api/documents/${documentId}/download`,
    { responseType: 'blob' },
  )

  return {
    blob: response.data,
    fileName: parseContentDispositionFileName(
      response.headers['content-disposition'],
    ),
  }
}

export async function deleteDocument(documentId: number): Promise<void> {
  await apiClient.delete(`/api/documents/${documentId}`)
}

function parseContentDispositionFileName(
  contentDisposition: string | undefined,
): string | null {
  if (!contentDisposition) {
    return null
  }

  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i)
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1])
  }

  const quotedMatch = contentDisposition.match(/filename="([^"]+)"/i)
  if (quotedMatch?.[1]) {
    return quotedMatch[1]
  }

  const plainMatch = contentDisposition.match(/filename=([^;]+)/i)
  return plainMatch?.[1]?.trim() ?? null
}
