import {
  IFileRepositoryReturnData,
  IFileData,
  IFileTypeRepositoryReturnData,
  IFileFormatRepositoryReturnData,
  IFileTypeEditableData,
  IFileFormatEditableData,
  IFileDataQuery,
} from '@/use-cases/file/interfaces';

export interface IFileRepository {
    findByFileName(fileName: string): Promise<IFileRepositoryReturnData | null>
    findFileById(id: string): Promise<IFileRepositoryReturnData | null>
    findById(id: string): Promise<IFileRepositoryReturnData | null>
    add(fileData: IFileData): Promise<IFileRepositoryReturnData>
    deleteFileById(id: string): Promise<IFileRepositoryReturnData>
    readAllFiles(fileDataQuery: IFileDataQuery): Promise<IFileRepositoryReturnData[] | []>
    findFileTypeByType(type: string): Promise<IFileTypeRepositoryReturnData | null>
    addFileType(id: string, type: string): Promise<IFileTypeRepositoryReturnData>
    findTypeById(id: string): Promise<IFileTypeRepositoryReturnData | null>
    updateFileTypeById(id: string, fileTypeEditableData: IFileTypeEditableData):
      Promise<IFileTypeRepositoryReturnData>
    findFileFormatByFormat(format: string): Promise<IFileFormatRepositoryReturnData | null>
    addFileFormat(id: string, format: string, fileTypeId: string):
      Promise<IFileFormatRepositoryReturnData>
    findFormatById(id: string): Promise<IFileFormatRepositoryReturnData | null>
    updateFileFormatById(id: string, fileFormatEditableData: IFileFormatEditableData):
      Promise<IFileFormatRepositoryReturnData>
}
