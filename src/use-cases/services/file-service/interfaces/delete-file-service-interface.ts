export interface IDeleteFileService {
  delete(fileName: string): Promise<null>
}
