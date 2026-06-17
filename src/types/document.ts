export interface DocumentRecord {
  id: number
  projectId: number
  projectName: string
  fileName: string
  fileUrl: string
  fileType: string
  fileSize: number
  uploadedById: number
  uploadedByName: string
  createdAt: string
  updatedAt: string | null
}
