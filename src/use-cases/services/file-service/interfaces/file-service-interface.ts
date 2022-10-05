export interface IFileService {
  delete(fileName: string): Promise<null>
}
