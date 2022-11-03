export interface IFileData {
  attachmentId: string,
  name: string,
  url: string,
  downloadUrl: string | null,
  id: string,
  originalFileName: string | null,
  size: number | null,
  fileFormatId: string
}
