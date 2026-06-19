import type { DocumentRecord } from '../../types'
import { DocumentTypeBadge } from './DocumentTypeBadge'
import { formatFileSize } from './formatFileSize'
import {formatDateToMin} from "../../utils/dateUtils.ts";

interface DocumentTableProps {
  deletingDocumentId: number | null
  downloadingDocumentId: number | null
  documents: DocumentRecord[]
  onDelete: (document: DocumentRecord) => void
  onDownload: (document: DocumentRecord) => void
  onViewMetadata: (document: DocumentRecord) => void
  selectedDocumentId: number | null
}

export function DocumentTable({
  deletingDocumentId,
  documents,
  downloadingDocumentId,
  onDelete,
  onDownload,
  onViewMetadata,
  selectedDocumentId,
}: DocumentTableProps) {
  if (documents.length === 0) {
    return (
      <div className="border-t border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
        No documents have been uploaded for this project.
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[1040px] table-fixed text-left text-sm">
        <colgroup>
          <col className="w-[300px]" />
          <col className="w-[180px]" />
          <col className="w-[120px]" />
          <col className="w-[170px]" />
          <col className="w-[170px]" />
          <col className="w-[160px]" />
        </colgroup>
        <thead className="bg-ci-blue-950 text-xs text-white">
          <tr>
            {[
              'File Name',
              'File Type',
              'File Size',
              'Uploaded By',
              'Created At',
              'Actions',
            ].map((column) => (
              <th className="whitespace-nowrap px-4 py-3" key={column}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {documents.map((document) => (
            <tr
              className={
                selectedDocumentId === document.id
                  ? 'bg-blue-50'
                  : 'hover:bg-blue-50'
              }
              key={document.id}
            >
              <td className="px-4 py-3 font-medium text-gray-900">
                <button
                  className="block max-w-full truncate text-left text-ci-blue-800 hover:text-ci-blue-950 hover:underline"
                  onClick={() => onViewMetadata(document)}
                  title={document.fileName}
                  type="button"
                >
                  {document.fileName}
                </button>
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <DocumentTypeBadge type={document.fileType} />
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                {formatFileSize(document.fileSize)}
              </td>
              <td className="px-4 py-3 text-gray-700">
                <span className="block truncate" title={document.uploadedByName}>
                  {document.uploadedByName}
                </span>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                {formatDateToMin(document.createdAt)}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <div className="flex gap-2">
                  <button
                    className="font-medium text-ci-blue-800 hover:text-ci-blue-950"
                    onClick={() => onViewMetadata(document)}
                    type="button"
                  >
                    View
                  </button>
                  <button
                    className="font-medium text-ci-blue-800 hover:text-ci-blue-950 disabled:cursor-not-allowed disabled:text-gray-400"
                    disabled={downloadingDocumentId === document.id}
                    onClick={() => onDownload(document)}
                    type="button"
                  >
                    {downloadingDocumentId === document.id
                      ? 'Downloading...'
                      : 'Download'}
                  </button>
                  <button
                    className="font-medium text-ci-red-700 hover:text-red-900 disabled:cursor-not-allowed disabled:text-gray-400"
                    disabled={deletingDocumentId === document.id}
                    onClick={() => onDelete(document)}
                    type="button"
                  >
                    {deletingDocumentId === document.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
