import {
  IFileRepositoryReturnData,
  IFileData,
  IFileTypeRepositoryReturnData,
  IFileFormatRepositoryReturnData,
} from '@/use-cases/file/interfaces';

export interface IFileRepository {
    findByFileName(fileName: string): Promise<IFileRepositoryReturnData | null>
    findById(id: string): Promise<IFileRepositoryReturnData | null>
    add(fileData: IFileData): Promise<IFileRepositoryReturnData>
    findFileTypeByType(type: string): Promise<IFileTypeRepositoryReturnData | null>
    addFileType(id: string, type: string): Promise<IFileTypeRepositoryReturnData>
    findTypeById(type: string): Promise<IFileTypeRepositoryReturnData | null>
    findFileFormatByFormat(format: string): Promise<IFileFormatRepositoryReturnData | null>
    addFileFormat(id: string, format: string, fileTypeId: string):
      Promise<IFileFormatRepositoryReturnData>
    findFormatById(format: string): Promise<IFileFormatRepositoryReturnData | null>
}
